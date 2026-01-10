# Librarian Agent - Quick Reference Card

## What is Librarian?

A specialized research agent that searches GitHub repositories and documentation to provide evidence-based answers with actual code examples.

**Model**: unic-code (fast, cost-effective)
**Primary Use**: External codebase research, not your project code

---

## Installation (3 Steps)

### 1. Install Marketplace
```bash
claude install https://github.com/lengockhoa/marketplace.git
```

### 2. Set GitHub Token
```bash
# Create token: https://github.com/settings/tokens/new
# Scopes: repo, read:org, read:user, user:email

# Add to ~/.zshrc or ~/.bashrc:
export GITHUB_TOKEN="ghp_your_token_here"

# Reload:
source ~/.zshrc
```

### 3. Restart Claude Code
```bash
# VSCode: Cmd+Shift+P → "Developer: Reload Window"
```

---

## Quick Usage

### Auto-Trigger (Main Agent Delegates)
Just ask naturally:
```
How does React implement useState?
```
```
Find examples of rate limiting in Express
```
```
What are Prisma transaction best practices?
```

### Explicit Call
```
@librarian <research question>
```

---

## Common Use Cases

### 1. Implementation Deep-Dive
**Question**: "How does X implement Y?"
```
@librarian How does Next.js implement server-side rendering?
Show me the actual code from their repository.
```

### 2. Real-World Examples
**Question**: "Find production examples of Z"
```
Find 5 real-world examples of WebSocket connection pooling
in Node.js applications. Show different approaches.
```

### 3. Best Practices
**Question**: "What are best practices for X?"
```
Research Prisma's official documentation for transaction
best practices. Include code examples and edge cases.
```

### 4. Comparative Analysis
**Question**: "Compare X vs Y"
```
Compare how Redux Toolkit and Zustand handle async state.
Show actual implementation code from both libraries.
```

### 5. Evolution/History
**Question**: "Why did X change?"
```
Analyze last 30 commits in Vue's reactivity system.
Explain what changed and the rationale from commit messages.
```

---

## What You Get

### ✅ Always Includes:
- Actual code snippets (not descriptions)
- File paths with line numbers
- Commit SHAs (when relevant)
- Links to original sources
- Evidence-based explanations

### ❌ Does NOT:
- Modify your code
- Execute/test code
- Create commits/PRs
- General chat (use main agent)

---

## Tips for Best Results

1. **Be Specific**
   - ❌ "How does React work?"
   - ✅ "How does React implement the useState hook? Show the caching mechanism."

2. **Request Evidence**
   - ❌ "Explain error handling"
   - ✅ "Find error handling patterns in Express. Show actual code with file paths."

3. **Specify Scope**
   - ❌ "Search for examples"
   - ✅ "Search only the facebook/react repository for useMemo implementation"

4. **Ask for Citations**
   - ❌ "What's best practice?"
   - ✅ "What's best practice according to official docs? Include links and examples."

---

## Example Conversation

**You**: Find how Prisma handles transactions

**Librarian**:
```
Based on Prisma's repository and documentation:

## Sequential Transactions
File: `packages/client/src/runtime/RequestHandler.ts:234-267`
```typescript
async $transaction<P extends PrismaPromise<any>[]>(
  arg: [...P],
  options?: { isolationLevel?: IsolationLevel }
): Promise<UnwrapTuple<P>> {
  return this._request({
    action: 'executeRaw',
    // ... implementation details
  })
}
```

## Interactive Transactions
From: [Prisma Transactions Guide](https://prisma.io/docs/concepts/components/prisma-client/transactions)

File: `packages/client/tests/functional/transaction-interactive.ts:45-62`
```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { name: 'Alice' } })
  const posts = await tx.post.findMany({ where: { authorId: user.id } })
  return { user, posts }
})
```

**Key Patterns**:
1. Sequential: Use Promise.all() for independent queries
2. Interactive: Full control with callback, auto rollback on error
3. Isolation levels supported (commit SHA: abc123f)

**Best Practices** (from docs + tests):
- Prefer interactive for complex logic
- Keep transactions short
- Handle errors explicitly
- Use read-only when possible

Sources:
- [Transactions Guide](https://prisma.io/docs/.../transactions)
- prisma/prisma repo: packages/client/src/runtime/RequestHandler.ts:234
```

---

## Troubleshooting

### "Rate limit exceeded"
```bash
# Check token is set
echo $GITHUB_TOKEN

# Should show 5000/hour if authenticated
curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/rate_limit
```

### "Cannot access private repo"
- Verify token has `repo` scope
- Check you have access on GitHub
- Regenerate token if needed

### "Agent not found"
```bash
# Check installation
ls agents/librarian/AGENT.md

# Restart Claude Code
```

---

## Advanced Usage

### Multiple Repos Search
```
@librarian Compare authentication patterns across
express, fastify, and koa repositories. Show middleware implementations.
```

### Specific Commit Range
```
@librarian In Next.js repo, analyze commits from v13.0 to v13.4
related to app router. What changed and why?
```

### Private Org Repos
```
@librarian Search our internal repos (org/auth-service, org/api-gateway)
for JWT validation patterns. Compare approaches.
```

### Documentation Deep-Dive
```
@librarian Deep-dive into TypeScript handbook on conditional types.
Find official examples and show real usage from DefinitelyTyped repo.
```

---

## Model & Performance

**Model**: unic-code (mapped from `sonnet`)
- Fast research responses (~10-30s typical)
- Cost-effective for deep-dives
- Handles large codebases well

**Token Usage**:
- Agent prompt: ~3K tokens
- Typical response: 2K-5K tokens
- Cost: ~$0.01-0.05 per research query (estimate)

---

## Files Installed

```
.
├── agents/
│   └── librarian/
│       ├── AGENT.md         # Main agent definition
│       └── README.md        # Agent documentation
├── .mcp.json                # GitHub MCP server config
├── SETUP_LIBRARIAN.md       # Full setup guide
└── LIBRARIAN_QUICKREF.md    # This file
```

---

## Learn More

- **Full Setup**: [SETUP_LIBRARIAN.md](SETUP_LIBRARIAN.md)
- **Agent Details**: [agents/librarian/README.md](agents/librarian/README.md)
- **Marketplace**: https://github.com/lengockhoa/marketplace

---

## Quick Test

After setup, try:
```
@librarian How does React's useState hook work internally?
Show me the actual implementation code with file paths.
```

You should get:
- File path to React's source
- Actual `useState` implementation code
- Explanation of how it works
- Links to React repository

If that works, you're all set! 🎉

---

**Happy researching!** 🔍
