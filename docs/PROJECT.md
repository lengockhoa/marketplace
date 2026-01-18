# Project Context

## Overview

**LeNK's Claude Code Marketplace** - A centralized repository of reusable Claude Code components for team collaboration.

## Goals

1. **Standardize team workflows** - Shared CLAUDE.md templates, coding conventions
2. **Reusable components** - Agents, skills, slash commands available to all team members
3. **Easy onboarding** - New members install once, get everything
4. **Auto-inject instructions** - SessionStart hook injects CLAUDE.md template automatically

## Team Workflow

```
Team Member                          Marketplace (GitHub)
    │                                       │
    │  1. /plugin marketplace add <url>     │
    ├──────────────────────────────────────>│
    │                                       │
    │  2. /plugin install lenk-marketplace  │
    ├──────────────────────────────────────>│
    │                                       │
    │  3. Start new session                 │
    │     ↓                                 │
    │  SessionStart hook triggers           │
    │     ↓                                 │
    │  CLAUDE.md.template injected          │
    │     ↓                                 │
    │  All agents/skills/commands ready     │
    │                                       │
```

## Architecture

```
marketplace/
├── .claude-plugin/
│   ├── plugin.json           # Plugin metadata
│   └── marketplace.json      # Available plugins list
│
├── hooks/
│   └── hooks.json            # SessionStart → inject CLAUDE.md
│
├── scripts/
│   └── inject-claude-md.sh   # Inject template script
│
├── templates/
│   └── CLAUDE.md.template    # Team's standard instructions
│
├── agents/                   # Specialized agents
├── skills/                   # Reusable skills
├── slash-commands/           # Custom commands
└── mcp-servers/configs/      # MCP templates
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `hooks/hooks.json` | SessionStart hook definition |
| `scripts/inject-claude-md.sh` | Inject CLAUDE.md template into context |
| `templates/CLAUDE.md.template` | Team's standard project instructions |

## Setup Requirements

- GitHub repository accessible to team
- Team members have Claude Code installed
- Each member runs plugin install once
