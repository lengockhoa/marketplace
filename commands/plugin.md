# /plugin

Manage plugins and skills from the LeNK Marketplace.

## Usage
- `/plugin browse`: See available plugins in the marketplace.
- `/plugin add <name>`: Install a plugin by name.
- `/plugin list`: Show installed plugins.
- `/plugin update`: Update all installed plugins.

## Instructions
When the user runs `/plugin`, interface with the registry at `https://raw.githubusercontent.com/lengockhoa/marketplace/main/registry.json`.
- To `add`: Download the plugin files to `~/.claude/plugins/<name>/`.
- To `list`: Scan `~/.claude/plugins/`.
