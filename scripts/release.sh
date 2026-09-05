#!/usr/bin/env bash
#
# Create a GitHub Release for the current tag using `gh`.
# Usage:
#   scripts/release.sh v1.2.1           # use existing tag
#   scripts/release.sh v1.3.0 --notes "..."   # custom release notes
#
# Prereq: `gh auth login` already done; `gh release` permission granted.

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <tag> [--notes <text>|--notes-file <path>] [--draft] [--prerelease]"
  exit 64
fi

TAG="$1"; shift

NOTES_ARG=""
DRAFT=""
PRERELEASE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --notes)       NOTES_ARG=(--notes "$2"); shift 2 ;;
    --notes-file)  NOTES_ARG=(--notes-file "$2"); shift 2 ;;
    --draft)       DRAFT="--draft"; shift ;;
    --prerelease)  PRERELEASE="--prerelease"; shift ;;
    *) echo "Unknown arg: $1"; exit 64 ;;
  esac
done

# If no notes provided, generate from the commits since the previous tag.
if [[ -z "${NOTES_ARG:-}" ]]; then
  PREV_TAG="$(git tag --sort=-v:refname | grep -v "^${TAG}$" | head -n 1 || true)"
  if [[ -n "$PREV_TAG" ]]; then
    RANGE="${PREV_TAG}..${TAG}"
  else
    RANGE="$(git rev-list --max-parents=0 HEAD | tail -n 1)..${TAG}"
  fi
  NOTES_FILE="$(mktemp -t release-notes-XXXXXX.md)"
  {
    echo "## Changes in ${TAG}"
    echo
    git log --no-merges --pretty=format:"- %s (%h by %an)" "$RANGE"
    echo
    echo
    echo "## Install / update"
    echo '```bash'
    echo 'curl -sL https://raw.githubusercontent.com/lengockhoa/marketplace/main/install-plugin-system.sh | bash'
    echo '```'
  } > "$NOTES_FILE"
  NOTES_ARG=(--notes-file "$NOTES_FILE")
  trap 'rm -f "$NOTES_FILE"' EXIT
fi

echo "→ Creating GitHub Release for $TAG"
gh release create "$TAG" \
  --title "$TAG" \
  --target "$(git rev-list -n 1 "$TAG")" \
  $DRAFT $PRERELEASE \
  "${NOTES_ARG[@]}"

echo "✓ Released $TAG → https://github.com/lengockhoa/marketplace/releases/tag/$TAG"
