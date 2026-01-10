# MCP Servers Configuration Templates

This folder contains **template** MCP server configurations that users can integrate into their own Claude Code setup after installing the marketplace.

## How Users Install MCP Configs from Marketplace

When users install this marketplace:
1. Marketplace components (agents, skills, commands) are installed to their Claude Code
2. **MCP configs are NOT auto-installed** - users must manually set them up
3. Users reference these templates to configure MCP servers in their own `~/.claude/.mcp.json`

# MCP Servers Configuration Templates

This folder contains **template** MCP server configurations that users can integrate into their own Claude Code setup after installing the marketplace.

## How Users Install MCP Configs from Marketplace

When users install this marketplace:
1. Marketplace components (agents, skills, commands) are installed to their Claude Code
2. **MCP configs are NOT auto-installed** - users must manually set them up
3. Users reference these templates to configure MCP servers in their own `~/.claude/.mcp.json`

## Available MCP Server Templates

### Core MCP Servers (Recommended)

**File**: `configs/essentials.json`

**Contains**:
- **GitHub MCP Server**: For Librarian agent (repository access, code search)
- **Memory MCP Server**: For persistent knowledge storage

**User Setup**:
```bash
# After installing marketplace, users should:

# 1. View the template
cat ~/.claude/plugins/lenk-marketplace/mcp-servers/configs/essentials.json

# 2. Merge into their ~/.claude/.mcp.json
# Manually add the servers they want

# 3. Set required environment variable
export GITHUB_TOKEN="ghp_your_token_here"

# 4. Restart Claude Code
```

## For Users: How to Configure MCP Servers

### Step 1: View Template

```bash
# View the MCP template from marketplace
cat ~/.claude/plugins/lenk-marketplace/mcp-servers/configs/essentials.json
```

### Step 2: Add to Your Config

Manually add the servers you need to your `~/.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      },
      "description": "GitHub MCP server for Librarian agent"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "Memory MCP server for persistent knowledge"
    }
  }
}
```

### Step 3: Set Environment Variables

For GitHub MCP server (required by Librarian agent):
```bash
# Add to ~/.zshrc or ~/.bashrc
export GITHUB_TOKEN="ghp_your_personal_access_token"

# Reload
source ~/.zshrc
```

Create GitHub token at: https://github.com/settings/tokens/new
- Scopes needed: `repo`, `read:org`, `read:user`, `user:email`

### Step 4: Restart Claude Code

The MCP servers will be available to agents after restart.

## For Marketplace Maintainers: Adding New MCP Templates

When adding new MCP server templates to the marketplace:

### 1. For Core Servers (Needed by Agents)

Add to `configs/essentials.json` or create new template file:

```json
{
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

### 2. For Optional Servers (Advanced Features)

Create `configs/server-name.json`:

```json
{
  "$comment": "Optional MCP server for [use case]. Users copy this to their ~/.claude/.mcp.json if needed.",
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-package"],
      "description": "What this provides"
    }
  }
}
```

### 3. Update Documentation

- Add setup instructions to agent's README if server is required by that agent
- Update this README with new server details
- Create `SETUP_<NAME>.md` in root if complex setup needed (like `SETUP_LIBRARIAN.md`)

## Important Notes for Users

⚠️ **MCP configs are NOT auto-installed** when you install the marketplace
- You must manually copy/merge templates into your `~/.claude/.mcp.json`
- This is by design - MCP servers may require environment variables and user preferences

✅ **Use environment variable syntax** for tokens:
- ✅ Correct: `"TOKEN": "${GITHUB_TOKEN}"`
- ❌ Wrong: `"TOKEN": "ghp_actual_token_here"`

🔒 **Never commit actual tokens** to git
- Always use `${ENV_VAR}` references in templates
- Users set actual tokens in their shell environment

## Example: Full User Setup for Librarian Agent

```bash
# 1. Install marketplace
claude install https://github.com/lengockhoa/marketplace.git

# 2. View MCP template
cat ~/.claude/plugins/lenk-marketplace/mcp-servers/configs/essentials.json

# 3. Manually add servers to your ~/.claude/.mcp.json
# Copy the github and memory server configurations

# 4. Create GitHub token: https://github.com/settings/tokens/new
#    Scopes: repo, read:org, read:user, user:email

# 5. Set environment variable (add to ~/.zshrc or ~/.bashrc)
echo 'export GITHUB_TOKEN="ghp_your_token_here"' >> ~/.zshrc
source ~/.zshrc

# 6. Restart Claude Code

# 7. Test Librarian agent
# Ask: "How does React implement useState?"
```

See [SETUP_LIBRARIAN.md](../SETUP_LIBRARIAN.md) for complete Librarian setup guide.

