# Changelog

All notable changes to LeNK Marketplace are documented here.
This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the marketplace adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned
- v1.5.0: real crypto rewrite of `useSession` (httpOnly cookie + Web Crypto HMAC).
- v1.5.0: unify `unic-vue` + `examples/duraone-portal` into a single repo-level package.
- v1.6.0: split `unic-vue/SKILL.md` (~1700 lines) into `skills/unic-vue/SKILL.md` + `skills/unic-vue/reference/*.md`.

## [1.4.1] — 2026-09-05

### Fixed (Claude Desktop install blocker)
- **`hooks/hooks.json`**: removed `SessionStart` hooks that referenced `scripts/inject-claude-md.sh` and `scripts/install-agents.sh` (these scripts no longer exist after the v1.2.0 agents→skills restructure). Empty `hooks` block keeps the file present without triggering Desktop's install-error path. Plugin.json no longer points to a hooks file at all.
- **Directory rename `slash-commands/` → `commands/`**: matches Claude Desktop / Claude Code plugin convention (the `commands/` folder at the plugin root is auto-discovered). Updated `.claude-plugin/marketplace.json`, `registry.json`, `scripts/validate-manifests.mjs`, `install-plugin-system.sh`, `README.md`, `CONTRIBUTING.md`.
- **Stale `commands/plugin.md` removed**: the orphan `/plugin` slash command conflicted with the built-in Claude Code `/plugin` command and confused Desktop discovery.

### Changed
- **README rewritten**: install section is now Claude Desktop-first (Add → GitHub URL → Install). Claude Code CLI install moved to a secondary "Option B" section. Added troubleshooting block for the `Plugin couldn't be installed. Try again.` error.

## [1.4.0] — 2026-09-05

## [1.4.0] — 2026-09-05

### Added
- **`skills/unic-api/`** (new skill): full backend HTTP API contract — endpoints (`/select`, `/insert`, `/save`, `/update`, `/hard_delete`, `/sync`, `/upload_more_data`, `/call`, `/user/login`, `/send_email`), conditions grammar (`(in)`, `(like)`, `(between)`, `(or)`), GZIP envelope, schema namespacing (`qas` vs `prd`), and auth flow.
- **`examples/duraone-portal/`** (new example folder): holds the DuraOne Portal-specific `state.duraone.js`, `masterApi.duraone.js`, `userObj.duraone.js` that were previously bundled inside `unic-vue/composables/`.

### Changed
- **unic-vue is now project-agnostic.** The generic stubs (`state.js`, `masterApi.js`, `userObj.js`) no longer hard-code DuraOne URLs, menu structure, or table names. The `baseurl()` function reads from `runtimeConfig.public.apiBase` instead.
- Marketplace, registry, and root plugin.json now list **9 skills** (was 8) — `unic-api` added.

## [1.2.1] — 2026-09-05

### Fixed
- `skills/unic-vue/components/View/Form.vue`: filled the empty 0-byte file with a minimal starter template; `SKILL.md` lines 93/974/1001 now clarify it's a starter.
- `README.md`: rewrote the `Structure` section for the v1.2 umbrella `unic` plugin; removed stale `Librarian` references and the broken `SETUP_LIBRARIAN.md` link.
- `skills/unic-vue/composables/useSession.js`: prepended a `SECURITY NOTES` block documenting the broken obfuscation, module-scope SSR risk, hard-coded `RANDOM_STRING` "salt", and the planned v1.3.0 fix.

## [1.2.0] — 2026-09-05

### Changed
- **Restructure**: converted 6 agents (`agents/{architect,coder,debugger,orchestrator,researcher,security}`) → skills under `skills/unic-{architect,coder,debugger,orchestrator,researcher,security-auditor}/`.
- **Umbrella plugin**: marketplace now ships a single `unic` plugin containing all 8 skills + 5 slash commands, instead of 8 separate plugin entries.
- Deleted the legacy `agents/` folder.
- Renamed root `.claude-plugin/plugin.json` from `lenk-marketplace` to `unic`.

### Added
- `skills/unic-architect/`, `skills/unic-coder/`, `skills/unic-debugger/`, `skills/unic-orchestrator/`, `skills/unic-researcher/`, `skills/unic-security-auditor/` — each with `SKILL.md` (frontmatter + workflow) and `.claude-plugin/plugin.json`.

### Fixed
- `skills/unic-vue/.claude-plugin/plugin.json`: added `keywords`, `homepage`, `repository`.
- Created the missing `skills/unic-sql/.claude-plugin/plugin.json` (root cause of "Skills: 0" in the Plugin Browser UI).
- `skills/unic-vue/composables/useRequest.js`: try/finally for `loading_count` (was stuck forever on error); SSR-safe `atob`/`btoa`; proper error logging; fixed multipart `Content-Type`.
- `skills/unic-vue/composables/indexDBStore.js`: hoisted `to_return` out of the closure (was undefined when `trans.oncomplete` fired); resolves with the full array (was `to_return[0]`); added `opts.replace` flag.
- `skills/unic-vue/composables/utils.js`: `check_is_null_or_blank` handles object/array/Date; `useRouter()` guarded for Vue 3; `t()` properly imported.

## [1.1.0] and earlier

See git history: `git log --oneline -- .claude-plugin/`.
