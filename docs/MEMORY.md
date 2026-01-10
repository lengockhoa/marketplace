# Project Memory

This file tracks decisions, completed tasks, and learnings for the Claude Code Marketplace project.

## Recent Work (2026-01-10)

### Task: Librarian Agent Implementation
Created a specialized GitHub research agent inspired by Ampcode's Librarian, customized for this marketplace.

**Files Created:**
- `agents/librarian/AGENT.md` - Main agent definition using unic-code model
- `agents/librarian/README.md` - User-facing documentation
- `SETUP_LIBRARIAN.md` - Detailed setup guide with GitHub token instructions
- `LIBRARIAN_QUICKREF.md` - Quick reference card for common usage
- `LIBRARIAN_IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `.mcp.json` - MCP server configuration (GitHub + Memory)
- `mcp-servers/README.md` - MCP templates documentation
- `docs/MCP_STRUCTURE.md` - MCP architecture explanation

**Updated Files:**
- `README.md` - Added Librarian to agents list
- `mcp-servers/configs/essentials.json` - Standardized with env var syntax

**Key Decisions Made:**

1. **Model Choice**: Use `unic-code` via sonnet mapping
   - Rationale: User preference, cost-effective, good for research tasks
   - Implementation: Agent specifies `model: sonnet` in frontmatter

2. **MCP Configuration Structure**:
   - **Root `.mcp.json`**: Core servers (GitHub + Memory) as templates
   - **`mcp-servers/configs/`**: Optional/reference configurations
   - **NOT auto-installed**: Users manually copy to their `~/.claude/.mcp.json`
   - **Why**: MCP configs require env vars and user-specific setup

3. **Environment Variable Syntax**: Use `${GITHUB_TOKEN}` not hardcoded values
   - Rationale: Portability across different user setups
   - Security: Never commit actual tokens

4. **GitHub Private Repos Support**: Full access via Personal Access Token
   - Required scopes: `repo`, `read:org`, `read:user`, `user:email`
   - User sets: `export GITHUB_TOKEN="ghp_..."`

5. **Distribution Strategy**:
   - Agents/Skills/Commands: Installed via marketplace
   - MCP configs: Templates users manually integrate
   - Documentation: Comprehensive guides for both

### Task: CLAUDE.md Creation
Created repository guidance for future Claude instances.

**Files Created:**
- `CLAUDE.md` - Main guidance file with architecture overview

**Key Sections:**
- Project Instructions (docs/MEMORY.md, docs/PROJECT.md, file creation rules)
- Component types and structure (Agents, Skills, Commands, MCP)
- Adding new components (step-by-step guides)
- Model configuration mapping
- Testing and distribution guidelines

**Decisions:**
- Focus on "big picture" architecture, not file listings
- Include YAML frontmatter templates for each component type
- Explain special cases (like Librarian's GitHub setup)
- Document file naming conventions

### Task: MCP Configuration Consolidation (Updated)
Removed root `.mcp.json` - marketplace only provides templates, not configs.

**Files Removed:**
- `.mcp.json` - Not needed in marketplace repository

**Files Updated:**
- `mcp-servers/README.md` - Now references only `configs/essentials.json`
- `README.md` - Removed `.mcp.json` from structure, only lists `mcp-servers/configs/`
- `CLAUDE.md` - Updated MCP section to reference configs folder only

**Key Decision:**
- **Marketplace provides TEMPLATES only**: Users manually integrate into their own `~/.claude/.mcp.json`
- **No root config file**: Having `.mcp.json` in marketplace was confusing - it's not the user's config
- **Single source**: `mcp-servers/configs/essentials.json` is the template users reference

**Rationale:**
- This is a marketplace for distribution, not a user's project config
- Users have their own `~/.claude/.mcp.json` that they manage
- Marketplace provides template files users can reference and copy from
- Clearer separation: marketplace = templates, user's setup = actual configs

**Changes Made:**

1. **Root `.mcp.json`** (consolidated):
   - Added Memory MCP server
   - Enhanced GitHub server with better description
   - Added JSON schema reference
   - Uses portable `${GITHUB_TOKEN}` syntax

2. **`mcp-servers/configs/essentials.json`** (updated):
   - Changed from duplicate config to reference template
   - Added `$comment` explaining it's a template
   - Standardized to match root `.mcp.json` format
   - Uses `${GITHUB_TOKEN}` not placeholder

3. **`mcp-servers/README.md`** (complete rewrite):
   - Clarified: MCP configs are **templates**, not auto-installed
   - Added user setup instructions (3-step process)
   - Added maintainer guidelines for adding new servers
   - Emphasized manual integration requirement
   - Linked to SETUP_LIBRARIAN.md

4. **`README.md`** (structure section updated):
   - Changed: `mcp-servers/` description to clarify template nature
   - Split: `.mcp.json` (core) from `mcp-servers/configs/` (optional)
   - Clearer: Users understand MCP setup is separate step

**Rationale:**
- **Marketplace is NOT user's config**: Templates, not direct config files
- **User control**: Users decide which MCP servers to install
- **Flexibility**: Different users have different MCP needs
- **Security**: Users set their own tokens in their environment

**User Experience:**
1. Install marketplace → agents/skills/commands available
2. Want Librarian → manually copy `.mcp.json` + set `GITHUB_TOKEN`
3. Want other MCP servers → reference `mcp-servers/configs/` templates

### Task: Documentation Organization
Created `docs/` folder and organized documentation files.

**Files Created:**
- `docs/MEMORY.md` - This file
- `docs/MCP_STRUCTURE.md` - MCP architecture explanation

**Decisions:**
- All new documentation goes in `docs/` folder (per CLAUDE.md)
- Root-level docs for user-facing (SETUP_*, README.md)
- `docs/` for maintainer/architectural documentation

## Architecture Learnings

### Component Discovery System
Claude Code discovers components through:
1. `.claude-plugin/plugin.json` - Plugin metadata
2. `.claude-plugin/marketplace.json` - Marketplace listing
3. Component file structure:
   - `agents/*/AGENT.md` - YAML frontmatter + system prompt
   - `skills/*/SKILL.md` - YAML frontmatter + skill content
   - `slash-commands/*.md` - YAML frontmatter + command instructions

### Model Mapping Flexibility
Users can customize model tiers in their `~/.claude/settings.json`:
```json
{
  "env": {
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "unic-code",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "unic-smart",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.7"
  }
}
```

Components remain portable by specifying tier (`sonnet`/`opus`/`haiku`) not model names.

### MCP Integration Pattern
For agents requiring external tools:
1. Define MCP server in root `.mcp.json` (template)
2. Document setup in `SETUP_<AGENT>.md`
3. Use env var syntax: `${TOKEN_NAME}`
4. Explain in agent's README: "Requires MCP setup"
5. Provide clear user instructions for manual integration

## Future Considerations

### Potential Enhancements
- Add more MCP server templates (Slack, Jira, etc.)
- Create more specialized agents (e.g., Database Expert, API Designer)
- Add skill for specific frameworks (React, Next.js, etc.)
- Consider slash command for MCP setup automation

### Technical Debt
- None currently

### Questions to Resolve
- Should we provide a setup script for MCP config copying?
  - Pro: Easier for users
  - Con: Less control, might overwrite existing configs
  - Decision: Keep manual for now, document clearly

## Links to Related Documentation

- [SETUP_LIBRARIAN.md](../SETUP_LIBRARIAN.md) - Librarian agent setup
- [LIBRARIAN_QUICKREF.md](../LIBRARIAN_QUICKREF.md) - Quick reference
- [MCP_STRUCTURE.md](MCP_STRUCTURE.md) - MCP architecture
- [CLAUDE.md](../CLAUDE.md) - Repository guidance
- [README.md](../README.md) - User-facing overview
