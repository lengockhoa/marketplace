#!/bin/bash

# LeNK Marketplace Installer
# Installs the /plugin command system and initializes directory structure

CLAUDE_DIR="$HOME/.claude"
COMMANDS_DIR="$CLAUDE_DIR/commands"
PLUGINS_DIR="$CLAUDE_DIR/plugins"

echo "🚀 Initializing LeNK Marketplace Plugin System..."

# Create directories
mkdir -p "$COMMANDS_DIR"
mkdir -p "$PLUGINS_DIR"

# Download the /plugin command
# Using raw github content link
curl -sL "https://raw.githubusercontent.com/lengockhoa/marketplace/main/commands/plugin.md" -o "$COMMANDS_DIR/plugin.md"

if [ $? -eq 0 ]; then
    echo "✅ Success! Added /plugin command to $COMMANDS_DIR/plugin.md"
    echo "💡 Restart Claude Code and type '/plugin help' to get started."
else
    echo "❌ Error: Failed to download /plugin command."
    exit 1
fi
