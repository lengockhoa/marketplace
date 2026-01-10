# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Instructions

### Documentation

Always read these files at session start:

- docs/MEMORY.md - Project memory and decisions
- docs/PROJECT.md - Project context and setup

### File Creation Rules

- Place all new documentation or informational files in the `docs/` folder.
- Place all new automated test files in the `test/` folder.

### After Significant Work

Update or create docs/MEMORY.md with:

- Decisions made
- Tasks completed
- New learnings

## Repository Purpose

This is a **Claude Code marketplace repository** that provides reusable components (agents, skills, slash commands, and MCP configurations) for Claude Code users. Components are distributed via:
1. **Plugin system**: Users run `/plugin install lenk-marketplace` after adding the marketplace
2. **Manual installation**: Users copy files from `agents/`, `skills/`, `slash-commands/` to their `~/.claude/` directory
3. **Direct git clone**: Advanced users clone and manage components themselves

## Architecture Overview

### Component Types and Structure

Each component type has a specific file format and YAML frontmatter structure:

1. **Agents** (`agents/*/AGENT.md`):
   - YAML frontmatter: `name`, `description`, `model`, `color`
   - Markdown body: System prompt defining agent behavior
   - Example: `agents/librarian/AGENT.md` - specialized GitHub research agent
   - Used via Task tool or `@agent-name` syntax

2. **Skills** (`skills/*/SKILL.md`):
   - YAML frontmatter: `name`, `description`, `triggers`
   - Markdown body: Reusable procedures/knowledge for agents
   - Example: `skills/vue-expert/SKILL.md` - Vue.js development expertise
   - Loaded by agents when relevant to task

3. **Slash Commands** (`slash-commands/*.md`):
   - YAML frontmatter: `name`, `description`, `args`
   - Markdown body: Command behavior and instructions
   - Example: `slash-commands/review.md` - code review command
   - Invoked by users via `/command-name`

4. **MCP Servers** (`mcp-servers/configs/*.json`):
   - JSON configuration templates for Model Context Protocol servers
   - Example: `mcp-servers/configs/essentials.json` - GitHub + Memory servers
   - Users manually integrate into their own `~/.claude/.mcp.json`
   - Provides external tool access (GitHub API, etc.)

### Plugin Manifest Files

- **`.claude-plugin/plugin.json`**: Plugin metadata (name, version, author)
- **`.claude-plugin/marketplace.json`**: Marketplace configuration listing available plugins
- Both files are required for plugin system discovery

### Special Cases

**Librarian Agent**: Requires external setup beyond standard agent installation:
- GitHub Personal Access Token (`GITHUB_TOKEN` env var)
- GitHub MCP server (configured in `.mcp.json`)
- See `SETUP_LIBRARIAN.md` for complete setup instructions

## Adding New Components

### Creating a New Agent

1. Create directory: `agents/<agent-name>/`
2. Create `AGENT.md` with frontmatter:
   ```yaml
   ---
   name: agent-name
   description: When to use this agent (include examples)
   model: sonnet|opus|haiku  # Maps to user's configured models
   color: blue|green|red|purple|yellow  # UI color indicator
   ---
   ```
3. Write system prompt describing agent's capabilities and constraints
4. Add `README.md` explaining usage for end users
5. Update root `README.md` to list new agent

### Creating a New Skill

1. Create directory: `skills/<skill-name>/`
2. Create `SKILL.md` with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What this skill provides
   triggers: ["keyword1", "keyword2"]  # When to load this skill
   ---
   ```
3. Write skill content (procedures, patterns, knowledge)
4. Update root `README.md`

### Creating a New Slash Command

1. Create file: `slash-commands/<command-name>.md`
2. Add frontmatter:
   ```yaml
   ---
   name: command-name
   description: What this command does
   args: "<required-arg> [optional-arg]"  # If command takes arguments
   ---
   ```
3. Write command instructions
4. Update root `README.md`

### Adding MCP Server Configuration

For agents requiring external tools:
1. Add configuration template to `mcp-servers/configs/` directory
2. Update `mcp-servers/README.md` with usage instructions
3. Document environment variables needed (like `GITHUB_TOKEN`)
4. Create setup guide in root directory (e.g., `SETUP_<NAME>.md`)
5. Update agent's README with MCP setup instructions

Example template structure:
```json
{
  "$comment": "MCP server for [purpose]. Users copy to ~/.claude/.mcp.json",
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-package"],
      "env": {
        "REQUIRED_VAR": "${ENV_VAR_NAME}"
      },
      "description": "What this server provides. Required by [agent-name] agent."
    }
  }
}
```

## Model Configuration

Components specify `model: sonnet|opus|haiku` in frontmatter, which maps to user's `~/.claude/settings.json`:
```json
{
  "env": {
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "unic-code",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "unic-smart",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.7"
  }
}
```

This allows users to customize which actual model each tier uses while components remain portable.

## File Naming Conventions

- Agent definitions: `AGENT.md` (uppercase)
- Skill definitions: `SKILL.md` (uppercase)
- Slash commands: `lowercase-with-hyphens.md`
- Documentation: `README.md` (per component) or `SETUP_*.md` (root level)
- Templates: `*.template` suffix (in `templates/` directory)

## Testing Components

Before committing new components:

1. **Test locally**:
   ```bash
   # Copy to global Claude directory
   cp -r agents/<new-agent> ~/.claude/agents/
   # Restart Claude Code
   # Test invocation
   ```

2. **Verify frontmatter**: YAML syntax must be valid
3. **Check documentation**: Ensure README explains usage clearly
4. **Test edge cases**: Try triggering with various queries

## Distribution Guidelines

When adding components, ensure:
- **Self-contained**: Each component directory has all necessary files
- **Documented**: README explains what, why, when to use
- **Examples**: Include usage examples in description or README
- **No secrets**: Never commit API keys, tokens, or credentials
- **Portable**: Components work across different user setups

## Updating Existing Components

When modifying agents/skills/commands:
1. Maintain backward compatibility in frontmatter structure
2. Update version in `.claude-plugin/plugin.json` if changing core functionality
3. Document breaking changes in component's README
4. Test with existing users' workflows in mind
