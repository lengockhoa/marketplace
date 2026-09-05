#!/usr/bin/env node
/**
 * Cross-check that:
 *   - marketplace.json `skills[*]` and `commands[*]` paths exist on disk.
 *   - registry.json `plugins[*]` paths exist.
 *   - skills listed in marketplace.json == skills listed in registry.json (by id).
 *   - commands listed in marketplace.json == commands listed in registry.json (by id).
 *
 * Marketplace schema (Claude Code/Desktop spec):
 *   skills:   string[]   // paths to skill dirs (e.g. "./skills/unic-vue")
 *   commands: string[]   // paths to .md files (e.g. "./commands/review.md")
 */
import { readFileSync, existsSync } from "node:fs";
import { join, basename, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const marketplace = JSON.parse(readFileSync(join(ROOT, ".claude-plugin/marketplace.json"), "utf8"));
const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));

let failed = false;
const fail = (m) => { console.error(`✗ ${m}`); failed = true; };
const ok = (m) => console.log(`✓ ${m}`);

// 1. marketplace skill / command paths
for (const plugin of marketplace.plugins) {
  for (const s of plugin.skills || []) {
    const abs = join(ROOT, s);
    if (!existsSync(abs)) fail(`marketplace.json skill path missing: ${plugin.name} → ${s}`);
    else ok(`marketplace.json skill path exists: ${plugin.name} → ${s}`);
  }
  for (const c of plugin.commands || []) {
    const abs = join(ROOT, c);
    if (!existsSync(abs)) fail(`marketplace.json command path missing: ${plugin.name} → ${c}`);
    else ok(`marketplace.json command path exists: ${plugin.name} → ${c}`);
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
  for (const s of plugin.skills || []) {
    mktSkills.add(basename(s)); // "./skills/unic-vue" → "unic-vue"
  }
}
const regSkills = new Set();
for (const pkg of registry.packages) {
  for (const p of pkg.plugins.filter((x) => x.category === "Skills")) regSkills.add(p.id);
}
const onlyInMktS = [...mktSkills].filter((s) => !regSkills.has(s));
const onlyInRegS = [...regSkills].filter((s) => !mktSkills.has(s));
if (onlyInMktS.length) fail(`skills in marketplace.json but not registry.json: ${onlyInMktS.join(", ")}`);
if (onlyInRegS.length) fail(`skills in registry.json but not marketplace.json: ${onlyInRegS.join(", ")}`);
if (!onlyInMktS.length && !onlyInRegS.length) {
  ok("marketplace.json ↔ registry.json skills in sync");
}

// 4. commands parity
const mktCmds = new Set();
for (const plugin of marketplace.plugins) {
  for (const c of plugin.commands || []) {
    // "./commands/review.md" → "review"
    mktCmds.add(basename(c, extname(c)));
  }
}
const regCmds = new Set();
for (const pkg of registry.packages) {
  for (const p of pkg.plugins.filter((x) => x.category === "Slash Commands")) regCmds.add(p.id);
}
const onlyInMktC = [...mktCmds].filter((s) => !regCmds.has(s));
const onlyInRegC = [...regCmds].filter((s) => !mktCmds.has(s));
if (onlyInMktC.length) fail(`commands in marketplace.json but not registry.json: ${onlyInMktC.join(", ")}`);
if (onlyInRegC.length) fail(`commands in registry.json but not marketplace.json: ${onlyInRegC.join(", ")}`);
if (!onlyInMktC.length && !onlyInRegC.length) {
  ok("marketplace.json ↔ registry.json commands in sync");
}

if (failed) { console.error("\n✗ Cross-check failed."); process.exit(1); }
console.log("\n✓ Cross-check passed.");
