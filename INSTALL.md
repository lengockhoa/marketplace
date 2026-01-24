# Install LeNK Marketplace for Claude Code

## Quick Install

### Step 1: Open Terminal

### Step 2: Run this command
```bash
curl -sL https://raw.githubusercontent.com/lengockhoa/marketplace/main/install-plugin-system.sh | bash
```

### Step 3: Restart Claude Code

### Step 4: Done!

---

## Available Agents

Use with `@agent-name` in Claude Code:

| Agent | Description |
|-------|-------------|
| `@architect` | Design systems & plan implementations |
| `@coder` | Write production-quality code |
| `@debugger` | Fix bugs & root cause analysis |
| `@orchestrator` | Coordinate complex multi-phase tasks |
| `@librarian` | Research GitHub repos & documentation |
| `@researcher` | Explore codebases & technologies |
| `@security` | Security audits & vulnerability checks |

---

## Update

When new agents or features are added, run the same command:

```bash
curl -sL https://raw.githubusercontent.com/lengockhoa/marketplace/main/install-plugin-system.sh | bash
```

Then restart Claude Code.

---

## Workflow

```
Your Request
     ↓
@orchestrator (plans phases)
     ↓
@architect (designs) → @coder (implements) → @debugger (verifies)
     ↓
Done!
```

---

## Uninstall

```bash
rm -rf ~/.claude/plugins/lenk-marketplace
rm ~/.claude/agents/{architect,coder,debugger,orchestrator,librarian,researcher,security}
rm ~/.claude/skills/{unic-vue,unic-sql}
```

---

## Troubleshooting

**Agents not showing in `@` autocomplete?**
- Make sure you restarted Claude Code after install
- Check symlinks exist: `ls -la ~/.claude/agents/`

**Update not working?**
- Run install command again
- Check internet connection
- Verify GitHub repo is accessible
