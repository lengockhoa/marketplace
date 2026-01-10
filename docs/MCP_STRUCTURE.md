# MCP Configuration Structure

## Overview

The marketplace now has a **consolidated MCP configuration structure** that makes it easier for users to understand and use MCP servers.

## Structure

### Root `.mcp.json` (Auto-installed)

**Location**: `/Users/lenk/DATA/WORKING/AI Agent/claude-marketplace/.mcp.json`

**Purpose**: Core MCP servers that are **automatically available** when users install the marketplace.

**Current servers**:
- **GitHub MCP Server**: Required by Librarian agent for repository access
- **Memory MCP Server**: Persistent knowledge storage across sessions

**Key features**:
- Uses `${GITHUB_TOKEN}` environment variable (portable)
- Includes descriptions for each server
- JSON schema reference for validation
- Automatically copied when marketplace is installed

### mcp-servers/configs/ (Templates/Optional)

**Location**: `/Users/lenk/DATA/WORKING/AI Agent/claude-marketplace/mcp-servers/configs/`

**Purpose**: **Optional** or **template** configurations that users can manually integrate if needed.

**Current files**:
- `essentials.json`: Template showing GitHub + Memory setup (reference only)

**Use case**: Future optional servers that aren't needed by all users but provide additional functionality.

## User Experience

### When Installing Marketplace

1. User runs: `claude install https://github.com/lengockhoa/marketplace.git`
2. Root `.mcp.json` is copied to their project/global config
3. GitHub and Memory MCP servers are **automatically available**
4. For Librarian agent: User only needs to set `GITHUB_TOKEN` environment variable

### For Optional Servers (Future)

1. User browses `mcp-servers/configs/`
2. Finds server config they want (e.g., `slack.json`, `jira.json`)
3. Manually copies configuration to their `.mcp.json`
4. Sets required environment variables
5. Restarts Claude Code

## Benefits of This Structure

1. **Clear separation**: Core (auto-installed) vs Optional (manual)
2. **User-friendly**: Essential servers work out-of-box
3. **Flexible**: Users can add optional servers as needed
4. **Documented**: Each location has clear README explaining purpose
5. **No duplication**: Single source of truth for each server type
6. **Portable**: Uses `${ENV_VAR}` syntax, works across systems

## Migration from Old Structure

### Before (Confusing)
- `.mcp.json` had only GitHub (incomplete)
- `mcp-servers/configs/essentials.json` had GitHub + Memory (duplicate)
- Users didn't know which to use
- Placeholder tokens (`YOUR_TOKEN_HERE`) were not portable

### After (Clear)
- `.mcp.json` has GitHub + Memory (complete, auto-installed)
- `mcp-servers/configs/essentials.json` is template/reference
- Clear documentation in both locations
- Portable env var syntax: `${GITHUB_TOKEN}`

## Adding New MCP Servers

### For Core Servers (Required by agents)

Add to root `.mcp.json`:

```json
{
  "mcpServers": {
    "new-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "REQUIRED_TOKEN": "${ENV_VAR_NAME}"
      },
      "description": "What this server provides and which agent needs it"
    }
  }
}
```

### For Optional Servers (Advanced features)

Create `mcp-servers/configs/server-name.json`:

```json
{
  "$comment": "Optional server for [use case]. Add to your .mcp.json if needed.",
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "description": "What this provides"
    }
  }
}
```

Update `mcp-servers/README.md` with usage instructions.

## Documentation Files

- `/mcp-servers/README.md`: Explains configs folder structure
- `/SETUP_LIBRARIAN.md`: GitHub MCP server setup for Librarian
- `/docs/MCP_STRUCTURE.md`: This file (architectural overview)

## Environment Variables

### Required for Current Setup

- `GITHUB_TOKEN`: GitHub Personal Access Token for Librarian agent
  - Scopes: `repo`, `read:org`, `read:user`, `user:email`
  - Set in: `~/.zshrc` or `~/.bashrc`
  - Used by: GitHub MCP server

### Future Optional Servers Might Need

- `SLACK_TOKEN`: For Slack MCP server
- `JIRA_API_KEY`: For Jira MCP server
- `OPENAI_API_KEY`: For OpenAI MCP server
- etc.

All should use `${VAR}` syntax in configs for portability.

## Testing

Before committing MCP config changes:

```bash
# 1. Validate JSON syntax
cat .mcp.json | jq .

# 2. Test server installation
npx -y @modelcontextprotocol/server-github

# 3. Verify environment variable access
echo $GITHUB_TOKEN

# 4. Restart Claude Code and test agent
# Ask: "@librarian How does React implement useState?"
```

## Summary

The new structure provides:
- ✅ **Auto-installed core servers** (in root `.mcp.json`)
- ✅ **Optional templates** (in `mcp-servers/configs/`)
- ✅ **Clear documentation** (README in each location)
- ✅ **Portable configs** (`${ENV_VAR}` syntax)
- ✅ **No duplication** (single source for each server)
- ✅ **User-friendly** (works out-of-box for essential features)

This makes the marketplace easier to install, understand, and extend.
