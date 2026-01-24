#!/bin/bash
# Auto-install all agents/skills from marketplace on SessionStart
# Dynamically discovers all components - no hardcoded lists

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$0")")}"
AGENTS_DIR="$HOME/.claude/agents"
SKILLS_DIR="$HOME/.claude/skills"

mkdir -p "$AGENTS_DIR" "$SKILLS_DIR"

# Auto-discover and symlink ALL agents
for agent_dir in "$PLUGIN_ROOT/agents/"*/; do
    if [ -d "$agent_dir" ]; then
        agent_name=$(basename "$agent_dir")
        TARGET="$AGENTS_DIR/$agent_name"

        if [ ! -e "$TARGET" ]; then
            ln -s "$agent_dir" "$TARGET"
        fi
    fi
done

# Auto-discover and symlink ALL skills
for skill_dir in "$PLUGIN_ROOT/skills/"*/; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        TARGET="$SKILLS_DIR/$skill_name"

        if [ ! -e "$TARGET" ]; then
            ln -s "$skill_dir" "$TARGET"
        fi
    fi
done
