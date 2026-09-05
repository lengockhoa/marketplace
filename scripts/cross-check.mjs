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
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, basename, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const marketplace = JSON.parse(readFileSync(join(ROOT, ".claude-plugin/marketplace.json"), "utf8"));
const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));

let failed = false;
const fail = (m) => { console.error(`✗ ${m}`); failed = true; };
const ok = (m) => console.log(`✓ ${m}`);

// 1. marketplace plugin source paths
for (const plugin of marketplace.plugins) {
  const srcAbs = join(ROOT, plugin.source);
  if (!existsSync(srcAbs)) {
    fail(`marketplace.json plugin source missing: ${plugin.name} → ${plugin.source}`);
  } else {
    ok(`marketplace.json plugin source exists: ${plugin.name} → ${plugin.source}`);
    // verify plugin.json exists at source root
    const pluginJsonAbs = join(srcAbs, ".claude-plugin/plugin.json");
    if (!existsSync(pluginJsonAbs)) {
      fail(`marketplace.json plugin.json missing: ${plugin.name} → ${plugin.source}/.claude-plugin/plugin.json`);
    } else {
      ok(`marketplace.json plugin.json present: ${plugin.name}`);
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

// 3. skills parity (derive from filesystem at plugins/unic/skills/)
const fsSkills = (() => {
  try {
    const dir = join(ROOT, "plugins/unic/skills");
    return new Set(readdirSync(dir).filter((d) =>
      statSync(join(dir, d)).isDirectory()
    ));
  } catch { return new Set(); }
})();
const regSkills = new Set();
for (const pkg of registry.packages) {
  for (const p of pkg.plugins.filter((x) => x.category === "Skills")) regSkills.add(p.id);
}
const onlyInFsS = [...fsSkills].filter((s) => !regSkills.has(s));
const onlyInRegS = [...regSkills].filter((s) => !fsSkills.has(s));
if (onlyInFsS.length) fail(`skills on disk but not in registry.json: ${onlyInFsS.join(", ")}`);
if (onlyInRegS.length) fail(`skills in registry.json but not on disk: ${onlyInRegS.join(", ")}`);
if (!onlyInFsS.length && !onlyInRegS.length) {
  ok(`plugins/unic/skills ↔ registry.json in sync (${fsSkills.size} skills)`);
}

// 4. commands parity (derive from filesystem at plugins/unic/commands/)
const fsCmds = (() => {
  try {
    const dir = join(ROOT, "plugins/unic/commands");
    return new Set(
      readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => basename(f, ".md"))
    );
  } catch { return new Set(); }
})();
const regCmds = new Set();
for (const pkg of registry.packages) {
  for (const p of pkg.plugins.filter((x) => x.category === "Slash Commands")) regCmds.add(p.id);
}
const onlyInFsC = [...fsCmds].filter((s) => !regCmds.has(s));
const onlyInRegC = [...regCmds].filter((s) => !fsCmds.has(s));
if (onlyInFsC.length) fail(`commands on disk but not in registry.json: ${onlyInFsC.join(", ")}`);
if (onlyInRegC.length) fail(`commands in registry.json but not on disk: ${onlyInRegC.join(", ")}`);
if (!onlyInFsC.length && !onlyInRegC.length) {
  ok(`plugins/unic/commands ↔ registry.json in sync (${fsCmds.size} commands)`);
}

if (failed) { console.error("\n✗ Cross-check failed."); process.exit(1); }
console.log("\n✓ Cross-check passed.");
