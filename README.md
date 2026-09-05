# LeNK's Claude Code Marketplace

A repository of curated components for [Claude Code](https://code.claude.com) by **LeNK**.

## ⚡ Quick Start (Recommended)

Install the marketplace plugin system with a single command:

```bash
curl -sL "https://raw.githubusercontent.com/lengockhoa/marketplace/main/install-plugin-system.sh" | bash
```

Once installed, restart Claude Code and use:

- `/plugin browse` - See available tools
- `/plugin install unic` - Install the `unic` umbrella plugin (8 skills + 5 slash commands)

---

## 📂 Structure

The marketplace ships a single `unic` umbrella plugin. Installing it gives you:

- **Skills** (under `skills/unic-*/SKILL.md`):
  - `unic-vue` — Nuxt 3 + Vue 2 Options API patterns, Control/Grid/Panel components.
  - `unic-sql` — PostgreSQL SQL writing conventions (functions, views, tables, queries).
  - `unic-architect` — System architect: designs, trade-offs, implementation plans.
  - `unic-coder` — Implementation specialist for production-quality code.
  - `unic-debugger` — Root cause analysis and bug fixing.
  - `unic-orchestrator` — Workflow coordination for multi-phase tasks.
  - `unic-researcher` — Codebase exploration and external technology research.
  - `unic-security-auditor` — OWASP Top 10, auth/authz, secrets, hardening.
- **Slash commands** (under `slash-commands/*.md`): `/document`, `/explain`, `/refactor`, `/review`, `/test`.
- **MCP server templates** (`mcp-servers/configs/`): GitHub + Memory templates for manual integration.
- **Project templates** (`templates/`): `CLAUDE.md`, `settings.json`, Conventional Commits reference.

## 🚀 How to Use

### 1. Add this Marketplace to Claude Code

```bash
/plugin marketplace add https://github.com/lengockhoa/marketplace.git
```

### 2. Install the `unic` Plugin

```bash
/plugin install unic@lenk-marketplace
```

---

## 📂 Manual Installation (Optional)

If you prefer not to use the plugin system, copy components manually.

### Installing Skills

Copy the `skills/unic-<name>/` directory into your project's `.claude/skills/` or your global `~/.claude/skills/`:

```bash
cp -r skills/unic-vue ~/.claude/skills/
```

### Installing Slash Commands

Copy the markdown file into `.claude/commands/` or `~/.claude/commands/`:

```bash
cp slash-commands/review.md ~/.claude/commands/
```

### Using Templates

Copy the template content into your project's root `CLAUDE.md` or `.claude/settings.json`.

## 🤝 Contributing

1. Fork the repository.
2. Add your component under the appropriate directory.
3. Submit a pull request!

## 📦 Versioning

This marketplace follows semantic versioning on the umbrella `unic` plugin (see `registry.json`):

- **patch** (`1.2.0` → `1.2.1`): bug fix, copy fix, doc fix.
- **minor** (`1.2.0` → `1.3.0`): add skill / command / agent.
- **major** (`1.2.0` → `2.0.0`): breaking — rename, restructure, or remove a component.
