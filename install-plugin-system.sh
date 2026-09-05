#!/usr/bin/env bash
#
# LeNK Marketplace — one-shot installer / updater / uninstaller for the
# `unic` umbrella Claude Code plugin (Claude Code CLI only — Claude Desktop
# installs via Settings → Plugins → Add → GitHub URL instead).
#
# Install:   curl -sL https://raw.githubusercontent.com/lengockhoa/marketplace/main/install-plugin-system.sh | bash
# Update:    same command (idempotent — detects an existing install and updates).
# Uninstall: curl -sL ... | bash -s -- --uninstall
# Dry-run:   curl -sL ... | bash -s -- --dry-run
# Pin ver:   curl -sL ... | bash -s -- --tag v1.4.1
#
# Safety:
#   - `set -euo pipefail` — fail fast, fail loud.
#   - `ln -sfn` — replace stale symlinks without `rm -rf` of the user's home.
#   - Never overwrites an existing user file; prints a warning and skips.
#   - `--uninstall` removes only symlinks we created, not arbitrary files.

set -euo pipefail

CLAUDE_DIR="${HOME}/.claude"
PLUGINS_DIR="${CLAUDE_DIR}/plugins"
AGENTS_DIR="${CLAUDE_DIR}/agents"
SKILLS_DIR="${CLAUDE_DIR}/skills"
COMMANDS_DIR="${CLAUDE_DIR}/commands"
MARKETPLACE_DIR="${PLUGINS_DIR}/lenk-marketplace"
REPO_URL="https://github.com/lengockhoa/marketplace.git"
TAG=""
DRY_RUN=false
UNINSTALL=false

log()  { printf "%b\n" "$*"; }
info() { log "  $*"; }
ok()   { log "  ✅ $*"; }
warn() { log "  ⚠️  $*"; }
err()  { log "  ❌ $*" >&2; }

# ---------------------------------------------------------------------------
# arg parsing
# ---------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --uninstall) UNINSTALL=true; shift ;;
    --dry-run)   DRY_RUN=true;   shift ;;
    --tag)       TAG="$2";       shift 2 ;;
    --repo)      REPO_URL="$2";  shift 2 ;;
    -h|--help)
      sed -n '2,15p' "$0"
      exit 0 ;;
    *) err "Unknown arg: $1"; exit 64 ;;
  esac
done

# ---------------------------------------------------------------------------
# uninstall path
# ---------------------------------------------------------------------------
if [[ "$UNINSTALL" == "true" ]]; then
  log "🧹 Uninstalling LeNK Marketplace..."
  if [[ -d "$MARKETPLACE_DIR" ]]; then
    # only remove symlinks we created (those whose target points back to MARKETPLACE_DIR)
    while IFS= read -r -d '' link; do
      target="$(readlink "$link" || true)"
      if [[ "$target" == "$MARKETPLACE_DIR"* ]]; then
        if [[ "$DRY_RUN" == "true" ]]; then info "would unlink $link"; else rm "$link"; fi
        ok "removed $link"
      fi
    done < <(find "$AGENTS_DIR" "$SKILLS_DIR" "$COMMANDS_DIR" -maxdepth 1 -type l -print0 2>/dev/null || true)
    if [[ "$DRY_RUN" == "true" ]]; then info "would rm -rf $MARKETPLACE_DIR"; else rm -rf "$MARKETPLACE_DIR"; fi
    ok "removed $MARKETPLACE_DIR"
  else
    warn "marketplace dir not found, skipping"
  fi
  log "🎉 Uninstall complete."
  exit 0
fi

# ---------------------------------------------------------------------------
# install / update path
# ---------------------------------------------------------------------------
mkdir -p "$PLUGINS_DIR" "$AGENTS_DIR" "$SKILLS_DIR" "$COMMANDS_DIR"

if [[ -d "$MARKETPLACE_DIR/.git" ]]; then
  log "🔄 Updating LeNK Marketplace..."
  if [[ "$DRY_RUN" == "true" ]]; then info "would git -C $MARKETPLACE_DIR pull"; else
    git -C "$MARKETPLACE_DIR" pull --quiet
  fi
else
  log "🚀 Installing LeNK Marketplace..."
  if [[ "$DRY_RUN" == "true" ]]; then info "would git clone $REPO_URL $MARKETPLACE_DIR"; else
    git clone --quiet "$REPO_URL" "$MARKETPLACE_DIR"
  fi
fi

# Pin to a specific tag if asked
if [[ -n "$TAG" && "$DRY_RUN" != "true" ]]; then
  info "checking out tag $TAG"
  git -C "$MARKETPLACE_DIR" checkout --quiet "tags/$TAG"
fi

# ---------------------------------------------------------------------------
# safe symlink helper
# ---------------------------------------------------------------------------
safe_symlink() {
  local target="$1" link_path="$2"
  if [[ -e "$link_path" && ! -L "$link_path" ]]; then
    warn "skipping $link_path (exists and is not a symlink)"
    return 0
  fi
  if [[ "$DRY_RUN" == "true" ]]; then
    info "would ln -sfn $target $link_path"
  else
    ln -sfn "$target" "$link_path"
  fi
}

# ---------------------------------------------------------------------------
# discover & install
# ---------------------------------------------------------------------------
log "📦 Skills:"
if [[ -d "$MARKETPLACE_DIR/plugins/unic/skills" ]]; then
  for skill_dir in "$MARKETPLACE_DIR/plugins/unic/skills/"*/; do
    [[ -d "$skill_dir" ]] || continue
    name="$(basename "$skill_dir")"
    safe_symlink "$skill_dir" "$SKILLS_DIR/$name"
    ok "$name"
  done
else
  warn "no plugins/unic/skills/ directory in marketplace"
fi

log "📦 Commands:"
if [[ -d "$MARKETPLACE_DIR/plugins/unic/commands" ]]; then
  for cmd_file in "$MARKETPLACE_DIR/plugins/unic/commands/"*.md; do
    [[ -f "$cmd_file" ]] || continue
    name="$(basename "$cmd_file")"
    safe_symlink "$cmd_file" "$COMMANDS_DIR/$name"
    ok "$name"
  done
else
  warn "no plugins/unic/commands/ directory in marketplace"
fi

# agents/ folder removed in v1.2.0 — installed via skills instead
if [[ -d "$MARKETPLACE_DIR/agents" ]]; then
  log "📦 Agents (legacy folder detected):"
  for agent_dir in "$MARKETPLACE_DIR/agents/"*/; do
    [[ -d "$agent_dir" ]] || continue
    name="$(basename "$agent_dir")"
    safe_symlink "$agent_dir" "$AGENTS_DIR/$name"
    ok "$name"
  done
fi

log ""
log "🎉 Done! Restart Claude Code to apply changes."
log "   Uninstall anytime: curl -sL .../install-plugin-system.sh | bash -s -- --uninstall"
