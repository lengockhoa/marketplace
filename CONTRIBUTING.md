# Contributing to LeNK Marketplace

Thanks for contributing! This document covers the day-to-day workflow for
adding or changing skills, agents, and slash commands.

## Quick start

1. **Fork & clone** the repo.
2. **Create a branch**: `git checkout -b feat/my-new-skill`.
3. **Make your change** (see structure below).
4. **Validate locally**:
   ```bash
   npm run validate        # JSON + skill lint + cross-check
   npm run lint:skills     # skill frontmatter lint
   ```
5. **Commit** with a [Conventional Commits](https://www.conventionalcommits.org/) message:
   ```
   feat(skills): add unic-graphql skill
   fix(unic-vue): handle SSR in useSession
   docs: clarify unic-sql RETURNS TABLE rule
   ```
6. **Open a pull request** against `main`.

## Repository layout

```
.
├── .claude-plugin/
│   ├── plugin.json           # umbrella 'unic' plugin manifest
│   └── marketplace.json      # marketplace listing (single entry)
├── .github/workflows/
│   ├── ci.yml                # JSON + shellcheck + markdownlint + cross-check
│   └── release.yml           # auto GitHub Release on tag push
├── skills/
│   └── unic-<name>/
│       ├── SKILL.md          # skill definition (frontmatter + workflow)
│       └── .claude-plugin/
│           └── plugin.json   # per-skill manifest (parity with marketplace)
├── slash-commands/
│   └── <name>.md             # slash command (YAML frontmatter required)
├── scripts/                  # node + bash helpers
├── install-plugin-system.sh  # one-shot installer (supports --uninstall/--dry-run/--tag)
├── registry.json             # local registry of all skills + commands
└── package.json              # tooling metadata only (npm scripts)
```

## Adding a new skill

1. `mkdir -p skills/unic-<name>/.claude-plugin`
2. Write `skills/unic-<name>/SKILL.md` (use `templates/SKILL.template.md` if present):
   ```yaml
   ---
   name: unic-<name>            # MUST match folder name
   description: <one-liner, max 500 chars>
   triggers:                    # keywords Claude Code uses to auto-suggest
     - <keyword-1>
     - <keyword-2>
   category: <skill|agent>
   ---

   # Title

   <one-paragraph role statement>

   ## When to use
   ## Workflow
   ## ALWAYS / NEVER
   ## Examples
   ```
3. Write `skills/unic-<name>/.claude-plugin/plugin.json`:
   ```json
   {
     "name": "unic-<name>",
     "version": "1.0.0",
     "description": "...",
     "author": { "name": "..." },
     "license": "MIT",
     "keywords": ["..."],
     "homepage": "https://github.com/lengockhoa/marketplace/tree/main/skills/unic-<name>",
     "repository": { "type": "git", "url": "https://github.com/lengockhoa/marketplace.git" }
   }
   ```
4. Register the skill in **two** places:
   - `.claude-plugin/marketplace.json` → `plugins[0].components.skills` (add `{ "name": ..., "path": ... }`)
   - `registry.json` → `packages[0].plugins` (add a `category: "Skills"` entry)
5. Run `npm run validate` — both manifests must agree.
6. Bump the umbrella version: `npm run version -- 1.x.y`.
7. Commit, push, open PR.

## Adding a new slash command

1. Write `slash-commands/<name>.md` with YAML frontmatter:
   ```yaml
   ---
   description: <one-liner>
   argument-hint: <hint>
   allowed-tools: Read, Edit, Write, Bash
   ---
   ```
2. Register it in `.claude-plugin/marketplace.json` (`components.commands`) and `registry.json` (`category: "Slash Commands"`).
3. Run `npm run validate`.

## Versioning

| Change | Bump |
|--------|------|
| Bug fix, copy fix, doc fix | patch (1.2.0 → 1.2.1) |
| New skill, agent, or command | minor (1.2.0 → 1.3.0) |
| Rename, restructure, remove a component | major (1.2.0 → 2.0.0) |

Bump all 4 files at once with `npm run version -- 1.x.y`.

## Releases

Tag a release with `git tag -a v1.x.y -m "..."` and push the tag — the
`release.yml` workflow creates a GitHub Release automatically. To create
one from the command line:

```bash
./scripts/release.sh v1.x.y
```

## Code of conduct

Be kind. We follow the Contributor Covenant (see `CODE_OF_CONDUCT.md` if present).
