#!/usr/bin/env node
// Validate marketplace manifests:
//   - All JSON files parse cleanly.
//   - Every skill under skills/<unic-name>/ has a SKILL.md + .claude-plugin/plugin.json.
//   - Every slash command under slash-commands/ has YAML frontmatter.
//   - registry.json <-> filesystem match (path fields resolve).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const fail = (msg) => { console.error(`✗ ${msg}`); process.exitCode = 1; };
const pass = (msg) => console.log(`✓ ${msg}`);

const jsonFiles = [
  ".claude-plugin/marketplace.json",
  ".claude-plugin/plugin.json",
  "registry.json",
  "package.json",
];
for (const f of jsonFiles) {
  try {
    JSON.parse(readFileSync(join(ROOT, f), "utf8"));
    pass(`${f} parses`);
  } catch (e) {
    fail(`${f} parse error: ${e.message}`);
  }
}

// Check skill folders
const skillsDir = join(ROOT, "skills");
const skillFolders = readdirSync(skillsDir).filter((d) =>
  statSync(join(skillsDir, d)).isDirectory()
);
for (const f of skillFolders) {
  const skillMd = join(skillsDir, f, "SKILL.md");
  const pluginJson = join(skillsDir, f, ".claude-plugin/plugin.json");
  try {
    readFileSync(skillMd);
    pass(`skills/${f}/SKILL.md present`);
  } catch {
    fail(`skills/${f}/SKILL.md missing`);
  }
  try {
    JSON.parse(readFileSync(pluginJson, "utf8"));
    pass(`skills/${f}/.claude-plugin/plugin.json parses`);
  } catch {
    fail(`skills/${f}/.claude-plugin/plugin.json missing or invalid`);
  }
}

// Check slash commands have YAML frontmatter
const cmdDir = join(ROOT, "slash-commands");
const cmdFiles = readdirSync(cmdDir).filter((f) => f.endsWith(".md"));
for (const f of cmdFiles) {
  const content = readFileSync(join(cmdDir, f), "utf8");
  if (!content.startsWith("---")) {
    fail(`slash-commands/${f} missing YAML frontmatter`);
  } else {
    pass(`slash-commands/${f} has frontmatter`);
  }
}

// Cross-check registry paths
const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));
for (const pkg of registry.packages) {
  for (const p of pkg.plugins) {
    try {
      statSync(join(ROOT, p.path));
      pass(`registry path resolves: ${p.id} → ${p.path}`);
    } catch {
      fail(`registry path missing: ${p.id} → ${p.path}`);
    }
  }
}

if (process.exitCode) {
  console.error("\n✗ Manifest validation failed.");
  process.exit(1);
}
console.log("\n✓ All manifests valid.");
