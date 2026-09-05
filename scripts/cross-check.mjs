#!/usr/bin/env node
/**
 * Cross-check that:
 *   - marketplace.json `components.skills[*]` paths exist on disk.
 *   - registry.json `plugins[*]` paths exist.
 *   - skills listed in marketplace.json == skills listed in registry.json (by id).
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const marketplace = JSON.parse(readFileSync(join(ROOT, ".claude-plugin/marketplace.json"), "utf8"));
const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));

let failed = false;
const fail = (m) => { console.error(`✗ ${m}`); failed = true; };

// 1. marketplace components
for (const plugin of marketplace.plugins) {
  for (const group of Object.values(plugin.components || {})) {
    for (const item of group) {
      const abs = join(ROOT, item.path);
      if (!existsSync(abs)) {
        fail(`marketplace.json path missing: ${item.name} → ${item.path}`);
      }
    }
  }
}

// 2. registry paths
for (const pkg of registry.packages) {
  for (const p of pkg.plugins) {
    if (!existsSync(join(ROOT, p.path))) {
      fail(`registry.json path missing: ${p.id} → ${p.path}`);
    }
  }
}

// 3. skills parity
const mktSkills = new Set();
for (const plugin of marketplace.plugins) {
  for (const s of plugin.components?.skills || []) mktSkills.add(s.name);
}
const regSkills = new Set();
for (const pkg of registry.packages) {
  for (const p of pkg.plugins.filter((x) => x.category === "Skills")) regSkills.add(p.id);
}
const onlyInMkt = [...mktSkills].filter((s) => !regSkills.has(s));
const onlyInReg = [...regSkills].filter((s) => !mktSkills.has(s));
if (onlyInMkt.length) fail(`skills in marketplace.json but not registry.json: ${onlyInMkt.join(", ")}`);
if (onlyInReg.length) fail(`skills in registry.json but not marketplace.json: ${onlyInReg.join(", ")}`);
if (!onlyInMkt.length && !onlyInReg.length) {
  console.log("✓ marketplace.json ↔ registry.json skills in sync");
}

if (failed) { console.error("\n✗ Cross-check failed."); process.exit(1); }
console.log("\n✓ Cross-check passed.");
