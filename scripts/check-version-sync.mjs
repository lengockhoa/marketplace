#!/usr/bin/env node
/**
 * Ensure the 3 version fields agree:
 *   - .claude-plugin/plugin.json
 *   - .claude-plugin/marketplace.json
 *   - registry.json (packages[*].version)
 *   - package.json
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const sources = [
  [".claude-plugin/plugin.json", (j) => j.version],
  [".claude-plugin/marketplace.json", (j) => j.plugins?.[0]?.version],
  ["registry.json", (j) => j.packages?.[0]?.version],
  ["package.json", (j) => j.version],
];

const versions = new Map();
for (const [path, get] of sources) {
  const j = JSON.parse(readFileSync(join(ROOT, path), "utf8"));
  const v = get(j);
  if (!v) { console.error(`✗ ${path}: no version field`); process.exit(1); }
  versions.set(path, v);
  console.log(`  ${path.padEnd(36)} ${v}`);
}

const distinct = new Set(versions.values());
if (distinct.size > 1) {
  console.error("\n✗ Version mismatch:");
  for (const [p, v] of versions) console.error(`    ${p}: ${v}`);
  process.exit(1);
}
console.log(`\n✓ All versions in sync: ${[...distinct][0]}`);
