#!/bin/bash

# Auto-inject CLAUDE.md template into session context
# This runs on SessionStart via hooks/hooks.json
#
# Templates available:
# - CLAUDE.md.template (default) - Base performance-optimized
# - CLAUDE-nuxt-postgres.md.template - Vue/Nuxt + PostgreSQL specific

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$0")")}"

# Check for project-specific template preference
# User can create .claude-template file with: nuxt-postgres
TEMPLATE_PREF=""
if [ -f ".claude-template" ]; then
    TEMPLATE_PREF=$(cat .claude-template | tr -d '[:space:]')
fi

# Select template based on preference
case "$TEMPLATE_PREF" in
    "nuxt-postgres"|"vue"|"nuxt")
        TEMPLATE_FILE="${PLUGIN_ROOT}/templates/CLAUDE-nuxt-postgres.md.template"
        ;;
    *)
        TEMPLATE_FILE="${PLUGIN_ROOT}/templates/CLAUDE.md.template"
        ;;
esac

if [ -f "$TEMPLATE_FILE" ]; then
    cat "$TEMPLATE_FILE"
fi

exit 0
