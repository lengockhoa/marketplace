#!/bin/bash

# Auto-inject CLAUDE.md template into session context
# This runs on SessionStart via hooks/hooks.json

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$0")")}"
TEMPLATE_FILE="${PLUGIN_ROOT}/templates/CLAUDE.md.template"

if [ -f "$TEMPLATE_FILE" ]; then
    echo "<!-- LeNK Marketplace: Team Instructions -->"
    cat "$TEMPLATE_FILE"
    echo ""
fi

exit 0
