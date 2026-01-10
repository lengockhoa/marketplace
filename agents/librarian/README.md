# Librarian Agent

A specialized codebase research and documentation expert for Claude Code.

## What It Does

The Librarian agent excels at:
- **GitHub Code Search**: Search across public and private repositories
- **Implementation Research**: Find real-world code examples and patterns
- **Documentation Lookup**: Research official docs and best practices
- **Commit Analysis**: Understand code evolution through history
- **Comparative Studies**: Compare implementations across projects

## Key Features

### 🔍 Deep Code Research
Search and analyze actual implementation code from GitHub repositories, not just documentation or generic examples.

### 📚 Evidence-Based Answers
Every response includes specific citations: file paths, line numbers, commit SHAs, and links to sources.

### 🔐 Private Repo Access
With proper GitHub token configuration, access your organization's private repositories.

### 🎯 Comprehensive Output
Unlike general agents, Librarian provides deep-dive analysis with complete context and code examples.

## Usage Examples

### Example 1: Implementation Details
```
@librarian How does Next.js implement server actions?
Show me the actual implementation code.
```

### Example 2: Real-World Examples
```
Find production examples of WebSocket connection pooling
in Node.js applications.
```

### Example 3: Best Practices
```
Research Prisma transaction best practices from official
docs and real code examples.
```

### Example 4: Evolution Analysis
```
Analyze recent commits in React's hooks implementation
to understand what changed and why.
```

## Installation

1. **Install this marketplace**:
   ```bash
   claude install https://github.com/lengockhoa/marketplace.git
   ```

2. **Create GitHub Personal Access Token**:
   - Go to: https://github.com/settings/tokens/new
   - Scopes: `repo`, `read:org`, `read:user`, `user:email`
   - Copy the token (starts with `ghp_`)

3. **Set environment variable**:
   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   export GITHUB_TOKEN="ghp_your_token_here"

   # Then reload
   source ~/.zshrc
   ```

4. **Restart Claude Code**

## Configuration

The agent uses these files (installed via marketplace):
- `agents/librarian/AGENT.md` - Agent definition
- `.mcp.json` - GitHub MCP server config (in marketplace root)

Model mapping (from your `~/.claude/settings.json`):
- Agent specifies: `model: sonnet`
- Maps to: `unic-code` (your configured default)

## Requirements

- Node.js (for MCP server)
- GitHub Personal Access Token
- Claude Code, OpenCode, or Kilocode

## Troubleshooting

See full setup guide in marketplace repo:
```bash
cat SETUP_LIBRARIAN.md
```

Or check GitHub token:
```bash
echo $GITHUB_TOKEN
curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
```

## Advanced Usage

### Explicit Invocation
```
@librarian <research question>
```

### From Code
```typescript
await task.invoke('librarian', {
  prompt: 'Research how Vue 3 implements reactivity'
})
```

### Custom Searches
```
@librarian Search facebook/react for useMemo implementation.
Include the caching logic and explain how dependencies work.
```

## Privacy & Security

- **Read-only**: Never modifies code or creates commits
- **Token scoped**: Only accesses repos your token permits
- **Local execution**: All analysis happens in your session
- **No data sharing**: Private code stays private

## Model Used

**unic-code** (via sonnet mapping)
- Fast, efficient for research tasks
- Good balance of cost and quality
- Handles large codebases well

## Tips for Best Results

1. **Be specific**: "How does X implement Y in file Z.js"
2. **Request evidence**: "Show actual code, not descriptions"
3. **Specify scope**: "Search only React repository"
4. **Ask for citations**: "Include file paths and line numbers"

## What Librarian Does NOT Do

- ❌ Modify your code
- ❌ Execute or test code
- ❌ Create commits or PRs
- ❌ General conversation (use main agent)

## Learn More

- Full documentation: [`SETUP_LIBRARIAN.md`](../../SETUP_LIBRARIAN.md)
- Agent definition: [`agents/librarian/AGENT.md`](AGENT.md)
- MCP config: [`.mcp.json`](../../.mcp.json)
- Marketplace: https://github.com/lengockhoa/marketplace

---

**Powered by**: Claude Code + GitHub MCP + unic-code model
**Author**: LeNK
**Version**: 1.0.0
