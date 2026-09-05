---
name: unic-api
description: LeNK/UNIC backend API contract — endpoints (/select, /insert, /save, /update, /hard_delete, /sync, /upload_more_data, /call, /user/login, /send_email), conditions grammar (eq, (in), (like), (between), (or)), GZIP response envelope, schema namespacing (qas vs prd), and auth flow. Use when writing or reviewing any client → API integration.
triggers:
  - api
  - backend
  - endpoint
  - select
  - insert
  - save
  - update
  - hard delete
  - sync
  - upload
  - conditions
  - gzip
  - envelope
  - schema
  - qas
  - prd
  - login
  - session
category: skill
---

# unic-api

The canonical reference for the **UNIC backend HTTP API**. Every client
that talks to this API — Nuxt 3 portals, internal admin tools, ETL jobs —
must follow this contract.

## Base URL

```
{schema}.example.com
```

`schema` is one of:

| Schema  | Use                                      |
|---------|------------------------------------------|
| `prd`   | production                               |
| `qas`   | QA / staging                             |
| `dev`   | developer machine (local backend)        |

The full base URL is built by `composables/state.js#baseurl()` and exposed
to the client as a runtime config — never hard-code it in components.

## Endpoints

All endpoints sit under `{baseurl}api/...` unless noted. Every endpoint
**except** `/user/login` and `/send_email/*` uses the GZIP envelope below.

| Method | Path                  | Body shape                          | Purpose                                  |
|--------|-----------------------|-------------------------------------|------------------------------------------|
| GET    | `/api/select`         | `{ table, conditions, fields?, ... }` | Read rows from a view or table          |
| POST   | `/api/insert`         | `{ table, data: {...} }`            | Insert one row                           |
| POST   | `/api/save`           | `{ table, data: {...} }`            | Upsert (insert-or-update by PK)          |
| POST   | `/api/update`         | `{ table, conditions, data }`       | Update rows matching conditions          |
| POST   | `/api/hard_delete`    | `{ table, conditions }`             | Hard delete (bypasses soft-delete)       |
| POST   | `/api/sync`           | `{ table, data: [...], mode }`      | Bulk upsert (mode: `replace` / `merge`)  |
| POST   | `/api/upload_more_data` | `multipart/form-data`             | File upload (image, pdf, xlsx)           |
| POST   | `/api/call`           | `{ fn: "fn_xxx", args: {...} }`     | Call a stored function and return its result |
| POST   | `/user/login`         | `{ username, password }`             | Auth (raw response — **no envelope**)    |
| POST   | `/send_email/send_email` | `{ to, subject, body }`           | Outbound email (raw response)            |

### Conventions

- Table names follow `v_*` (view) or `t_*` (table) prefixes — see `unic-sql` skill.
- Functions follow `fn_*` and are called via `/api/call`.
- Use `JSON.stringify(conditions)` before sending — the server expects a string.

## Conditions grammar

Conditions are a flat object. Equality is implicit. Special keys are
prefixed with `(operator)`.

```js
// Equality
{ id: 1 }
{ name: "Alice" }

// IN
{ "(in)id": [1, 2, 3] }
{ "(in)usergroup": [10, 20] }

// LIKE
{ "(like)name": "ali%" }
{ "(like)email": "%@example.com" }

// BETWEEN
{ "(between)created_on": ["2026-01-01", "2026-12-31"] }

// OR group
{ "(or)status": ["draft", "pending"] }

// Combine with normal keys (AND)
{ "(in)usergroup": [1, 2], menu: "Agreement", can_create: true }
```

## Response envelope (GZIP)

Every endpoint except the two raw ones returns this shape:

```json
{
  "is_compress": true,
  "data": "<base64-encoded gzipped UTF-8 string>"
}
```

The client decodes `data` with `pako.ungzip(atob(data))` to get the
actual JSON payload (typically an array of rows, or `{ success: true }`).

### Decode flow (reference)

```js
import pako from "pako";

function decode(response) {
  if (!response?.is_compress) return response;
  const compressed = Uint8Array.from(atob(response.data), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(pako.ungzip(compressed)));
}
```

> **SSR safety**: `atob` is a browser API. Wrap decoding in
> `typeof window !== "undefined"` or call it only inside event handlers.

## Auth flow

1. Client POSTs `{ username, password }` to `/user/login`.
2. Server returns a session object directly (no envelope).
3. Client stores the session in `localStorage` under key `unic_service`
   using `composables/useSession.js` (see also `unic-vue`).
4. Every subsequent `/api/*` call includes the session cookie or
   `Authorization` header depending on backend config.

> The current `useSession.js` ships with a broken obfuscation — see its
> `SECURITY NOTES` block. The real crypto rewrite is planned for v1.5.

## Client helper pattern

`composables/useRequest.js` (in `unic-vue`) wraps every call with:

- `loading_count` bookkeeping (UI spinner on/off).
- GZIP envelope encode + decode.
- Centralized error logging.

```js
import { request, requestForm, requestLogin, requestSendmail } from "@/composables/useRequest";

// Read
const rows = await request("/select", {
  table: "v_agreement",
  conditions: JSON.stringify({ id_agreement: 42 }),
}, "get");

// Write
await request("/save", { table: "t_user", data: { id: 1, name: "Alice" } });

// Upload
const fd = new FormData();
fd.append("file", file);
const result = await requestForm("/upload_more_data", fd);

// Login
const session = await requestLogin({ username: "...", password: "..." });
```

## ALWAYS

- Use `request()` (or one of its siblings) for every API call — never call `axios` directly from a component.
- `JSON.stringify(conditions)` before sending — the server expects a string, not an object.
- Treat the GZIP envelope as mandatory; `/user/login` and `/send_email` are the only raw responses.
- Keep table and function names aligned with `unic-sql` (`v_*` for views, `fn_*` for functions).
- Pass `with_loading = false` for background refreshes that shouldn't toggle the global spinner.

## NEVER

- Hard-code the base URL in components — read it from runtime config.
- Read from `t_*` tables in the `/select` endpoint — use `v_*` views.
- Store the session in anything other than `localStorage`/`unic_service` (until the v1.5 crypto rewrite).
- Call `/user/login` more than once per session — the server rate-limits it.
- Skip error logging on `/api/call` failures — silent failures here usually mean a SQL function errored.

## Examples

### Read with IN + AND

```js
const rows = await request("/select", {
  table: "v_usergroup",
  conditions: JSON.stringify({
    "(in)usergroup": [1, 2, 3],
    menu: "Agreement",
    can_create: true,
  }),
}, "get");
```

### Upsert

```js
await request("/save", {
  table: "t_user",
  data: { id: 42, name: "Alice", email: "alice@example.com" },
});
```

### Call a function

```js
const result = await request("/call", {
  fn: "fn_rpt_sales_summary",
  args: { from: "2026-01-01", to: "2026-12-31" },
});
```

### File upload

```js
const fd = new FormData();
fd.append("file", fileInput.files[0]);
fd.append("kind", "invoice");
const out = await requestForm("/upload_more_data", fd);
```

## See also

- `unic-sql` — table/function naming and SQL conventions.
- `unic-vue` — `useRequest`, `useSession`, `indexDBStore` composables.
- `unic-security-auditor` — review auth/authz when adding new endpoints.
