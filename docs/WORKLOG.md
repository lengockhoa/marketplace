# Worklog

Track session-level execution details.

## Entries

### 2026-09-05 — Sync marketplace + P0 bug fixes + plugin manifest

**Sync**
- `git init` → fetched `github.com/lengockhoa/marketplace` → merge with `-X ours` (UKit priority)
- UKit's `.gitignore` had ignored `CLAUDE.md`/`AGENTS.md`, so merge overwrote `CLAUDE.md` on disk → fixed by running `ukit install` then untracking from git (commit `4040fe1`)
- Pushed to remote (`4040fe1`).

**Bug audit (read-only)**
- Audited 9/9 composables + 2 components manually; ran 3 Explore agents (agents, skills, docs+dist+automation). Findings in plan file `/Users/lenk/.claude/plans/binary-noodling-phoenix.md`.

**P0 fixes (commit `cedc54d`, pushed)**
- `skills/unic-vue/composables/useRequest.js`: try/finally for `loading_count`, SSR-safe `atob`/`btoa`, proper error logging, fix multipart `Content-Type`.
- `skills/unic-vue/composables/indexDBStore.js`: `getDataIDB` hoisted `to_return` and resolves full array (was `[0]`); `addDataIDB` got `opts.replace` flag; proper async error propagation.
- `skills/unic-vue/composables/utils.js`: `check_is_null_or_blank` correctly handles object/array/Date (removed dead `value == {}`); `useRouter()` guarded for Vue 3; `t()` properly imported.
- `skills/unic-sql/.claude-plugin/plugin.json`: **was MISSING entirely** — root cause of "Skills: 0" in UI.
- `skills/unic-vue/.claude-plugin/plugin.json`: added keywords/homepage/repository.

**Restructure: agents → skills + umbrella 'unic' plugin (commit `54a78d6`, pushed)**
- User chose option A: bundle everything as one umbrella `unic` plugin.
- Converted all 6 agents to skills: `agents/{architect,coder,debugger,orchestrator,researcher,security}` → `skills/unic-{name}/SKILL.md` with proper frontmatter (name, description, triggers, category=agent).
- Added `.claude-plugin/plugin.json` for each new skill (parity with unic-vue/unic-sql).
- Deleted legacy `agents/` folder (12 files).
- Restructured `.claude-plugin/marketplace.json`: single `unic` plugin entry with 8 skills + 5 commands under `components`.
- Renamed root `.claude-plugin/plugin.json` to `name: "unic"` (1.1.0).
- Updated `registry.json`: 8 `unic-*` skills under `umbrella: true` package.
- All 11 JSON manifests validate cleanly with `python3 -c "json.load(...)"`.

**Pending**
- Plugin structure: ✅ resolved (option A — single umbrella `unic` plugin).
- Remaining P0 (#14, #15, #16) + P1–P5 from plan still to do.

### 2026-09-05 — P0 cleanup (commit `157c3f6`, tag `v1.2.1`, pushed)

- `components/View/Form.vue` filled with a minimal starter template (was 0-byte); SKILL.md lines 93/974/1001 clarify it's a starter.
- `README.md` rewritten: structure section reflects v1.2 umbrella `unic` plugin (8 skills + 5 commands); stale `Librarian` refs + broken `SETUP_LIBRARIAN.md` link removed.
- `composables/useSession.js`: prepended `SECURITY NOTES` block documenting the broken obfuscation, module-scope SSR risk, hard-coded `RANDOM_STRING` "salt", and the planned v1.3.0 fix (httpOnly cookie + Web Crypto HMAC).
- Version bumped 1.2.0 → 1.2.1 (patch — copy/doc/cleanup).

**P0 fully closed.** Remaining: P1 (manifest consistency), P2 (agent upgrades — now skill upgrades), P3 (skill content gaps), P4 (docs/distribution), P5 (dev workflow + automation), P6 (architectural — defer).

### 2026-09-05 — P1–P5 + P6 done, v1.4.0 released

- **v1.3.0** (commit `86d5725`, GitHub Release): P1 manifest + P4 docs + P5 dev workflow
  - package.json: scripts (validate, lint:skills, cross-check, sync-version)
  - CHANGELOG, CONTRIBUTING
  - 5 slash commands get YAML frontmatter
  - .github/workflows/{ci,release}.yml, pre-commit, editorconfig
  - install-plugin-system.sh rewrite: --uninstall/--dry-run/--tag
- **v1.3.1** (commit `4d55eef`, GitHub Release): P2 + P3
  - 6 skills fleshed out with ALWAYS/NEVER + examples + output format
  - templates/SKILL.template.md
  - unic-sql RETURNS TABLE contradiction resolved
- **v1.4.0** (commit `da28942`, GitHub Release): P6 architectural
  - NEW skill `skills/unic-api/` — full HTTP API contract (endpoints, conditions grammar, GZIP envelope, schema, auth)
  - DuraOne split: composables/{state,masterApi,userObj}.js → examples/duraone-portal/composables/*.duraone.js
  - unic-vue is now project-agnostic (generic stubs use runtimeConfig)
  - examples/duraone-portal/README.md explains the split
- **All 4 npm validators pass**: validate, lint:skills, cross-check, check-version-sync.
- **5 GitHub Releases live**: v1.2.0, v1.2.1, v1.3.0, v1.3.1, v1.4.0.

**Future work (deferred):**
- v1.5.0: real crypto rewrite of `useSession` (httpOnly cookie + Web Crypto HMAC).
- v1.5.0: unify `unic-vue` + `examples/duraone-portal` into single package.
- v1.6.0: split `unic-vue/SKILL.md` (~1700 lines) into main + reference/*.md.

### 2026-09-05 — v1.4.1 Claude Desktop install fix (commit `2ea769f`, tag `v1.4.1`, pushed)

**Root cause** of `Plugin couldn't be installed. Try again. (×3)` on Claude Desktop:
- `hooks/hooks.json` referenced `${CLAUDE_PLUGIN_ROOT}/scripts/inject-claude-md.sh` and `scripts/install-agents.sh` — both scripts were deleted in the v1.2.0 agents→skills restructure. Desktop's plugin loader fails to resolve the hook command paths and aborts install.
- `slash-commands/` directory name does not match Desktop auto-discovery (expects `commands/` at plugin root).

**Fix:**
- `hooks/hooks.json` → empty `{}`; removed `hooks` line from `plugin.json`.
- Renamed `slash-commands/` → `commands/` (5 files moved). Updated `.claude-plugin/marketplace.json` paths, `registry.json` paths, `scripts/validate-manifests.mjs`, `install-plugin-system.sh`, `README.md`, `CONTRIBUTING.md`.
- Deleted stale `commands/plugin.md` (orphan `/plugin` command conflicted with Claude Code's built-in).
- Rewrote `README.md` install section: Claude Desktop-first (Add → GitHub URL → Install); Claude Code CLI moved to secondary "Option B".
- 4 npm validators pass.
- v1.4.1 GitHub Release created with detailed notes.

**User direction:** "chỉ dùng cho Claude Desktop thôi nhé, Claude code là phụ thôi, nếu conflict thì gỡ cả claude code ra". Format is now identical for both targets (Desktop reads the same marketplace.json), so no further conflict expected.

### 2026-09-05 — v1.4.2 real Desktop install fix (commit `c4143da`, tag `v1.4.2`, pushed)

**Real root cause** (after re-fetching with vision analyst + WebFetch'ing official plugin-marketplaces spec):
> "There is no `components` key. The actual component keys are individual fields: `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers`."

`marketplace.json` had `"components": { "skills": [...], "commands": [...] }` which **silently failed install** because the unknown block was dropped — no components were installed, install aborted, generic toast.

**Fix:**
- Rewrote `marketplace.json`: replaced `components` block with top-level `skills: string[]` and `commands: string[]` arrays at the plugin entry level (per official spec). Each path is `./skills/unic-vue`-style (relative to plugin root, `./` prefix).
- Dropped "Claude Code" mention from descriptions so Desktop doesn't filter.
- Rewrote `scripts/cross-check.mjs` to validate the new flat schema (now also checks command parity).
- All 4 npm validators pass at v1.4.2. GitHub Release v1.4.2 live with detailed notes.

### 2026-09-05 — v1.4.3 REAL fix (commit `7bb52ee`, tag `v1.4.3`, pushed)

**Real root cause** (after fetching official Anthropic marketplace.json content):
> Anthropic's official marketplace uses `source: "./plugins/<plugin-name>"` for every entry. NO plugin lives at the marketplace root with `source: "./"`.

The flat layout I had used (skills/commands/.claude-plugin/plugin.json all at repo root with `source: "./"`) is **not a supported plugin shape**. Directory could discover it but install always failed.

**Fix:** Restructured to `plugins/unic/` subdirectory matching Anthropic's pattern exactly:
- `git mv skills/ plugins/unic/skills/`
- `git mv commands/ plugins/unic/commands/`
- `git mv hooks/ plugins/unic/hooks/`
- `git mv .claude-plugin/plugin.json plugins/unic/.claude-plugin/plugin.json`
- `marketplace.json`: `"source": "./plugins/unic"`, no skills/commands arrays (auto-discovery), added `$schema` and `category: "productivity"`
- All 5 validator scripts updated for new paths. All 4 npm validators pass.

<!-- Entries before 2026-09 archived to docs/WORKLOG_ARCHIVE.md. Keep this file < 600 lines. -->

Keep this file compact to save AI context tokens:

- **Max 30 entries.** When over, archive the oldest entries to `docs/WORKLOG_ARCHIVE.md`.
- **Max ~600 lines.** If over, archive oldest entries until under budget.
- Each entry should be 10-20 lines max (summary, not transcript).
- On archive: move full entry block to `docs/WORKLOG_ARCHIVE.md` (create if missing).
- Keep a compaction marker as the last line: `<!-- Entries before YYYY-MM archived to docs/WORKLOG_ARCHIVE.md. Keep this file < 600 lines. -->`
- If the user says "compact worklog" or "clean worklog", perform the archive pass and report what moved.

For each significant action, append:
- Date/time
- Action taken
- Files changed
- Verification run
- Outcome
