# LeNK's Claude Code Marketplace

A repository of curated components for [Claude Code](https://code.claude.com) by **LeNK**.

## ⚡ Quick Start (Recommended)

Install the marketplace plugin system with a single command:

```bash
curl -sL "https://raw.githubusercontent.com/lengockhoa/marketplace/main/install-plugin-system.sh" | bash
```

Once installed, restart Claude Code and use:

- `/plugin browse` - See available tools
- `/plugin add unic-vue` - Install the Vue.js Expert skill
- `/plugin add unic-sql` - Install the UNIC SQL skill

---

## 📂 Structure

- `agents/`: Specialized subagent definitions (`AGENT.md`). Includes: **Architect, Debugger, Researcher, Security Auditor, and Librarian** (GitHub research agent).
- `skills/`: Reusable agent skills (`SKILL.md`). Includes: **Vue.js Expert** and **UNIC SQL**.
- `slash-commands/`: Custom slash commands (`.md`). Includes: **/review, /refactor, /document, /explain, and /test**.
- `mcp-servers/configs/`: MCP server configuration templates (GitHub + Memory servers). Users manually integrate into their own `~/.claude/.mcp.json`.
- `templates/`: Project-level templates (`CLAUDE.md`, `settings.json`, and **Conventional Commits**).

## 🚀 How to Use

### 1. Add this Marketplace to Claude Code

Run the following command in your terminal to add this repository as a marketplace:

```bash
/plugin marketplace add https://github.com/lengockhoa/marketplace.git
```

### 2. Install the Core Plugin

Once the marketplace is added, install the core plugin to get all agents, skills, and commands:

```bash
/plugin install lenk-marketplace@LeNK Marketplace
```

---

## 📂 Manual Installation (Optional)

If you prefer not to use the plugin system, you can copy components manually:

### Installing Agents

Copy the directory of the agent you want into your project's `.claude/agents/` or your global `~/.claude/agents/` directory.

```bash
cp -r agents/architect ~/.claude/agents/
```

**Note for Librarian Agent**: This agent requires additional GitHub setup. See [SETUP_LIBRARIAN.md](SETUP_LIBRARIAN.md) for complete installation instructions including GitHub token configuration.

### Installing Slash Commands

Copy the markdown file into `.claude/commands/` or `~/.claude/commands/`.

```bash
cp slash-commands/review.md ~/.claude/commands/
```

### Using Templates

Copy the template content into your project's root `CLAUDE.md` or `.claude/settings.json`.

## 🤝 Contributing

1. Fork the repository.
2. Add your component to the appropriate directory.
3. Submit a pull request!
