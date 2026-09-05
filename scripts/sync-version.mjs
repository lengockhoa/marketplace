#!/usr/bin/env node
/**
 * Run via `npm run version -- 1.2.2`. Updates 4 version fields at once.
 * Used by the maintainer instead of editing each file by hand.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const newVersion = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(newVersion || "")) {
  console.error("Usage: node scripts/sync-version.mjs <semver>");
  process.exit(1);
}

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const targets = [
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  "registry.json",
  "package.json",
];

for (const path of targets) {
  const abs = join(ROOT, path);
  const j = JSON.parse(readFileSync(abs, "utf8"));
  if (j.plugins && Array.isArray(j.plugins) && j.plugins[0]) {
    j.plugins[0].version = newVersion;
  } else if (j.packages && Array.isArray(j.packages) && j.packages[0]) {
    j.packages[0].version = newVersion;
  } else {
    j.version = newVersion;
  }
  writeFileSync(abs, JSON.stringify(j, null, 2) + "\n");
  console.log(`✓ ${path} → ${newVersion}`);
}
