# Claude Code Marketplace

A repository of shared components for [Claude Code](https://code.claude.com).

## 📂 Structure

- `agents/`: Specialized subagent definitions (`AGENT.md`). Includes: **Architect, Debugger, Researcher, and Security Auditor**.
- `skills/`: Reusable agent skills (`SKILL.md`). Includes: **Vue.js Expert**.
- `slash-commands/`: Custom slash commands (`.md`). Includes: **/review, /refactor, /document, /explain, and /test**.
- `mcp-servers/`: Configuration files for Model Context Protocol servers. Includes **Memory and GitHub** server configs.
- `templates/`: Project-level templates (`CLAUDE.md`, `settings.json`, and **Conventional Commits**).

## 🚀 How to Use

### Installing Agents
Copy the directory of the agent you want into your project's `.claude/agents/` or your global `~/.claude/agents/` directory.

```bash
cp -r agents/architect ~/.claude/agents/
```

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
