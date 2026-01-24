#!/bin/bash

# LeNK Marketplace - One-Shot Installer & Updater
# Install: curl -sL https://raw.githubusercontent.com/lengockhoa/marketplace/main/install-plugin-system.sh | bash
# Update:  Same command (detects existing install and updates)

set -e

CLAUDE_DIR="$HOME/.claude"
PLUGINS_DIR="$CLAUDE_DIR/plugins"
AGENTS_DIR="$CLAUDE_DIR/agents"
SKILLS_DIR="$CLAUDE_DIR/skills"
COMMANDS_DIR="$CLAUDE_DIR/commands"
MARKETPLACE_DIR="$PLUGINS_DIR/lenk-marketplace"
REPO_URL="https://github.com/lengockhoa/marketplace.git"

# Create directories
mkdir -p "$PLUGINS_DIR" "$AGENTS_DIR" "$SKILLS_DIR" "$COMMANDS_DIR"

# Clone or update marketplace
if [ -d "$MARKETPLACE_DIR" ]; then
    echo "🔄 Updating LeNK Marketplace..."
    cd "$MARKETPLACE_DIR"
    git pull --quiet
else
    echo "🚀 Installing LeNK Marketplace..."
    git clone --quiet "$REPO_URL" "$MARKETPLACE_DIR"
fi

# Install /plugin command
if [ -f "$MARKETPLACE_DIR/commands/plugin.md" ]; then
    cp "$MARKETPLACE_DIR/commands/plugin.md" "$COMMANDS_DIR/plugin.md"
    echo "✅ /plugin command"
fi

# Auto-discover and install ALL agents
echo "📦 Agents:"
for agent_dir in "$MARKETPLACE_DIR/agents/"*/; do
    if [ -d "$agent_dir" ]; then
        agent_name=$(basename "$agent_dir")
        TARGET="$AGENTS_DIR/$agent_name"

        if [ ! -e "$TARGET" ]; then
            ln -s "$agent_dir" "$TARGET"
            echo "  ✅ $agent_name (installed)"
        else
            echo "  ✓  $agent_name"
        fi
    fi
done

# Auto-discover and install ALL skills
echo "📦 Skills:"
for skill_dir in "$MARKETPLACE_DIR/skills/"*/; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        TARGET="$SKILLS_DIR/$skill_name"

        if [ ! -e "$TARGET" ]; then
            ln -s "$skill_dir" "$TARGET"
            echo "  ✅ $skill_name (installed)"
        else
            echo "  ✓  $skill_name"
        fi
    fi
done

# Auto-discover and install ALL slash commands
echo "📦 Commands:"
for cmd_file in "$MARKETPLACE_DIR/slash-commands/"*.md; do
    if [ -f "$cmd_file" ]; then
        cmd_name=$(basename "$cmd_file")
        TARGET="$COMMANDS_DIR/$cmd_name"

        if [ ! -e "$TARGET" ]; then
            ln -s "$cmd_file" "$TARGET"
            echo "  ✅ $cmd_name (installed)"
        else
            echo "  ✓  $cmd_name"
        fi
    fi
done

echo ""
echo "🎉 Done! Restart Claude Code to apply changes."
