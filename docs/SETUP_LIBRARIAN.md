# Librarian Agent - Setup Guide

## Overview
The **Librarian** is a specialized research agent for Claude Code that excels at:
- Searching and analyzing code across GitHub repositories (public + private)
- Finding real-world implementation examples
- Researching documentation and best practices
- Analyzing code evolution through commit history

**Model**: unic-code (via sonnet mapping in your settings)
**Access**: Works with Claude Code, OpenCode, and Kilocode

---

## Quick Install

```bash
# 1. Install this marketplace
claude install https://github.com/lengockhoa/marketplace.git

# 2. Create GitHub token at: https://github.com/settings/tokens/new
#    Scopes needed: repo, read:org, read:user, user:email

# 3. Add token to shell profile (~/.zshrc or ~/.bashrc)
export GITHUB_TOKEN="ghp_your_token_here"

# 4. Reload shell
source ~/.zshrc

# 5. Restart Claude Code
```

---

## Detailed Setup

### 1. Install Marketplace

If you haven't already:
```bash
claude install https://github.com/lengockhoa/marketplace.git
```

This installs:
- `agents/librarian/AGENT.md` - Agent definition
- `.mcp.json` - GitHub MCP server configuration

### 2. Create GitHub Personal Access Token

To enable private repository access:

1. Go to: https://github.com/settings/tokens/new
2. Configure token:
   - **Name**: Claude Code Librarian Agent
   - **Expiration**: No expiration (or your preferred duration)
   - **Scopes** (select these):
     - ✅ `repo` (Full control of private repositories)
       - Includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
     - ✅ `read:org` (Read org and team membership)
     - ✅ `read:user` (Read user profile data)
     - ✅ `user:email` (Access user email addresses)

3. Click **Generate token**
4. Copy the token (starts with `ghp_...`)

### 3. Set Environment Variable

Add to your shell profile (`~/.zshrc`, `~/.bashrc`, or `~/.config/fish/config.fish`):

```bash
# For bash/zsh:
export GITHUB_TOKEN="ghp_your_token_here"

# For fish:
set -gx GITHUB_TOKEN "ghp_your_token_here"
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bashrc or source ~/.config/fish/config.fish
```

**Verify**:
```bash
echo $GITHUB_TOKEN  # Should show your token
```

### 4. Test GitHub API Access

```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
```

Should return your GitHub user info in JSON format.

### 5. Restart Claude Code

```bash
# In VSCode: Cmd+Shift+P → "Developer: Reload Window"
# In CLI: Just restart the session
```

---

## Usage Examples

### Example 1: Implementation Deep-Dive
```
How does React implement the useMemo hook internally?
Show me the actual code and explain the caching strategy.
```

Librarian will:
- Search React repository
- Locate `packages/react/src/ReactHooks.js`
- Show actual implementation with line numbers
- Explain caching mechanism with code references

### Example 2: Real-World Examples
```
Find 3-5 production examples of rate limiting middleware
in Express.js applications on GitHub.
```

Librarian will:
- Search GitHub for Express rate limiting implementations
- Analyze multiple repositories
- Show different approaches with pros/cons
- Provide code snippets with citations

### Example 3: Documentation Research
```
What are the best practices for Prisma transactions
according to official docs? Include code examples.
```

Librarian will:
- Fetch Prisma's transaction documentation
- Search Prisma repo for test examples
- Synthesize best practices with evidence
- Provide complete examples with links

### Example 4: Commit History Analysis
```
Analyze the last 30 commits in Next.js's app router
to understand recent API changes.
```

Librarian will:
- Clone/search Next.js repository
- Review commit messages and code changes
- Identify breaking changes and new features
- Explain rationale from commit descriptions

### Example 5: Comparative Analysis
```
Compare how Zustand, Redux Toolkit, and Jotai
handle state updates. Show actual implementation code.
```

Librarian will:
- Search all three repositories
- Locate core state update logic
- Present side-by-side comparison with code
- Explain design trade-offs

---

## How It Works

### Model Routing

Your `~/.claude/settings.json` should have:
```json
{
  "env": {
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "unic-code"
  }
}
```

The Librarian agent specifies `model: sonnet`, which maps to **unic-code** automatically.

### MCP Server

The `.mcp.json` file configures the GitHub MCP server that provides:
- `github_search_repositories`
- `github_search_code`
- `github_get_file_contents`
- `github_list_commits`
- `github_get_commit`
- `github_search_issues`
- `github_get_pull_request`

These tools are automatically available to the Librarian agent.

### Cross-Tool Compatibility

**Claude Code**: Reads agents from installed plugins
**OpenCode**: Shares same plugin system
**Kilocode**: Also compatible with Claude Code plugins

All three tools can invoke the Librarian agent after marketplace install.

---

## Triggering the Agent

### Automatic Triggers

The main agent will automatically invoke Librarian when you ask questions like:
- "How does X implement Y?"
- "Search GitHub for examples of Z"
- "Look up official docs for ABC"
- "Find real-world usage of XYZ"
- "Analyze commits in repository ABC"

### Manual Invocation

```bash
# Explicit call
@librarian <your research question>

# From code
task.invoke('librarian', {
  prompt: 'Research Prisma transaction best practices'
})
```

---

## Troubleshooting

### Issue: "GitHub API rate limit exceeded"

**Solution**: Ensure `GITHUB_TOKEN` is set. Authenticated requests have 5000/hour limit vs 60/hour for unauthenticated.

```bash
# Verify token is set
echo $GITHUB_TOKEN

# Test authentication
curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
```

### Issue: "Cannot access private repository"

**Solution**:
1. Verify token has `repo` scope
2. Check you have access to the repository on GitHub
3. Ensure token is correctly exported: `echo $GITHUB_TOKEN`

### Issue: "MCP server not starting"

**Solution**:
1. Check Node.js is installed: `node --version`
2. Manually install MCP server: `npx -y @modelcontextprotocol/server-github`
3. Check `.mcp.json` syntax is valid JSON
4. Restart Claude Code

### Issue: "Librarian agent not found"

**Solution**:
1. Verify marketplace is installed: `claude list`
2. Check agent file exists: `ls agents/librarian/AGENT.md`
3. Restart Claude Code to reload plugins

### Issue: "Uses wrong model (not unic-code)"

**Solution**:

Verify your `~/.claude/settings.json`:
```json
{
  "env": {
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "unic-code"
  }
}
```

---

## Advanced Configuration

### Multiple GitHub Accounts

Edit `.mcp.json` for different scopes:

```json
{
  "mcpServers": {
    "github-personal": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN_PERSONAL}"
      }
    },
    "github-work": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN_WORK}"
      }
    }
  }
}
```

### Model Override

To use a different model (e.g., haiku for faster/cheaper searches):

Edit `agents/librarian/AGENT.md`:
```yaml
model: haiku  # Maps to glm-4.7 in your config
```

### Rate Limiting

Add delay between requests in agent instructions or via env:
```bash
export GITHUB_API_DELAY_MS=1000  # 1 second between calls
```

---

## Privacy & Security

### What Librarian CAN Do:
✅ Read code from public repositories
✅ Read code from private repos you have access to
✅ Search GitHub code and issues
✅ Clone repositories for analysis
✅ Fetch documentation pages
✅ Analyze commit history

### What Librarian CANNOT Do:
❌ Modify any code (read-only)
❌ Execute code or run tests
❌ Create commits or PRs
❌ Modify GitHub issues/PRs
❌ Access repos without proper token permissions

### Privacy:
- Only accesses repos your GitHub token has permission for
- Does not store or share private code externally
- All analysis happens locally in your Claude Code session

---

## Requirements

- **Node.js**: For running MCP server (check: `node --version`)
- **GitHub Token**: Personal access token with appropriate scopes
- **Claude Code**: v1.0+ (or compatible: OpenCode, Kilocode)

---

## Support

- **Issues**: https://github.com/lengockhoa/marketplace/issues
- **Documentation**: This file and `agents/librarian/README.md`
- **Marketplace**: https://github.com/lengockhoa/marketplace

---

## Quick Start Checklist

- [ ] Install marketplace: `claude install https://github.com/lengockhoa/marketplace.git`
- [ ] Create GitHub token at: https://github.com/settings/tokens/new
- [ ] Add `export GITHUB_TOKEN="ghp_..."` to `~/.zshrc`
- [ ] Reload shell: `source ~/.zshrc`
- [ ] Verify: `echo $GITHUB_TOKEN`
- [ ] Test API: `curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user`
- [ ] Restart Claude Code
- [ ] Test: Ask "How does React implement useState?"

---

**You're all set!**

Librarian agent is now available with full GitHub private repository access via unic-code model.

Try it:
```
@librarian How does Next.js implement server-side rendering?
Show me the actual code.
```
