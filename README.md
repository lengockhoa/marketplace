# LeNK's `unic` Plugin Marketplace

A curated marketplace of skills and slash commands for **Claude Desktop** (and Claude Code) — bundled as one `unic` plugin.

## ⚡ Install on Claude Desktop

1. Open **Claude Desktop → Settings → Plugins**
2. Click **Add ▾** → **Add from GitHub**
3. Paste: `https://github.com/lengockhoa/marketplace`
4. Click **Install `unic`**

That's it — Desktop will download the plugin and activate all 9 skills + 5 slash commands.

> **Why a single `unic` plugin?** LeNK ships everything under one umbrella so a single Add installs the full LeNK stack — no per-skill installs, no marketplace browsing, no half-installed bundles.

---

## 📂 What's inside `unic`

- **Skills** (under `skills/unic-*/SKILL.md`):
  - `unic-vue` — Nuxt 3 + Vue 2 Options API patterns, Control/Grid/Panel components.
  - `unic-sql` — PostgreSQL SQL writing conventions (functions, views, tables, queries).
  - `unic-api` — Backend HTTP API contract (`/select`, `/insert`, `/save`, conditions, GZIP, schema).
  - `unic-architect` — System architect: designs, trade-offs, implementation plans.
  - `unic-coder` — Implementation specialist for production-quality code.
  - `unic-debugger` — Root cause analysis and bug fixing.
  - `unic-orchestrator` — Workflow coordination for multi-phase tasks.
  - `unic-researcher` — Codebase exploration and external technology research.
  - `unic-security-auditor` — OWASP Top 10, auth/authz, secrets, hardening.
- **Slash commands** (under `commands/*.md`): `/document`, `/explain`, `/refactor`, `/review`, `/test`.
- **Examples** (`examples/duraone-portal/`): DuraOne Portal-specific Vue composables for the `unic-vue` patterns.
- **MCP server templates** (`mcp-servers/configs/`): GitHub + Memory templates for manual integration.
- **Project templates** (`templates/`): `CLAUDE.md`, `settings.json`, Conventional Commits reference.

---

## 🚀 Install on Claude Code (CLI)

Two options:

### Option A — Marketplace (recommended)

```bash
/plugin marketplace add https://github.com/lengockhoa/marketplace.git
/plugin install unic@lenk-marketplace
```

### Option B — One-shot installer

```bash
curl -sL https://raw.githubusercontent.com/lengockhoa/marketplace/main/install-plugin-system.sh | bash
```

Useful flags:

- `--uninstall` — remove the symlinks the installer created.
- `--dry-run` — show what would happen, do nothing.
- `--tag v1.4.1` — pin to a specific release.

---

## 📂 Manual Installation (Optional)

If you prefer not to use the plugin system, copy components manually.

### Installing Skills

Copy the `skills/unic-<name>/` directory into Claude Desktop's skills folder, or your project's `.claude/skills/`:

```bash
# Claude Desktop (macOS)
cp -r skills/unic-vue ~/Library/Application\ Support/Claude/skills/

# Claude Code (project scope)
cp -r skills/unic-vue .claude/skills/
```

### Installing Slash Commands

```bash
# Claude Desktop (macOS)
cp commands/review.md ~/Library/Application\ Support/Claude/commands/

# Claude Code
cp commands/review.md .claude/commands/
```

### Using Templates

Copy template content into your project's root `CLAUDE.md` or `.claude/settings.json`.

---

## 🛠️ Troubleshooting (Desktop)

**`Plugin couldn't be installed. Try again.`**
1. Check that the repo URL is reachable: `https://github.com/lengockhoa/marketplace` must load in your browser.
2. Verify `https://raw.githubusercontent.com/lengockhoa/marketplace/main/.claude-plugin/marketplace.json` returns valid JSON.
3. Restart Claude Desktop and retry.
4. If still failing: open **Developer → Open Logs Folder** and search for the install attempt; share the relevant lines when reporting.

---

## 🤝 Contributing

1. Fork the repository.
2. Add your component under the appropriate directory.
3. Run `npm run validate` (or `node scripts/validate-manifests.mjs`) before pushing.
4. Submit a pull request!

See `CONTRIBUTING.md` for the full authoring guide.

---

## 📦 Versioning

This marketplace follows semantic versioning on the umbrella `unic` plugin (see `registry.json`):

- **patch** (`1.4.0` → `1.4.1`): bug fix, copy fix, doc fix, install-fix.
- **minor** (`1.4.0` → `1.5.0`): add skill / command / agent.
- **major** (`1.4.0` → `2.0.0`): breaking — rename, restructure, or remove a component.
