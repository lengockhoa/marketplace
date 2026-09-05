#!/usr/bin/env node
/**
 * Lint skill SKILL.md files for the unic-* convention:
 *   - YAML frontmatter is required.
 *   - Required fields: name, description.
 *   - name field must match the folder name.
 *   - description <= 500 chars.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const skillsDir = join(ROOT, "skills");
let failed = false;

for (const folder of readdirSync(skillsDir)) {
  if (!statSync(join(skillsDir, folder)).isDirectory()) continue;
  const md = join(skillsDir, folder, "SKILL.md");
  let content;
  try { content = readFileSync(md, "utf8"); }
  catch { console.error(`✗ ${folder}/SKILL.md missing`); failed = true; continue; }

  if (!content.startsWith("---")) {
    console.error(`✗ ${folder}/SKILL.md missing YAML frontmatter`);
    failed = true; continue;
  }

  const fm = content.split("---")[1] || "";
  const name = (fm.match(/^name:\s*(.+)$/m) || [])[1]?.trim();
  const desc = (fm.match(/^description:\s*(.+)$/m) || [])[1]?.trim();

  if (!name) { console.error(`✗ ${folder}/SKILL.md: no \`name\` field`); failed = true; }
  else if (name !== folder) {
    console.error(`✗ ${folder}/SKILL.md: name="${name}" does not match folder name`);
    failed = true;
  }

  if (!desc) { console.error(`✗ ${folder}/SKILL.md: no \`description\` field`); failed = true; }
  else if (desc.length > 500) {
    console.error(`✗ ${folder}/SKILL.md: description too long (${desc.length} chars, max 500)`);
    failed = true;
  }

  console.log(`✓ ${folder}/SKILL.md (name="${name}", ${desc?.length || 0} chars)`);
}

if (failed) { console.error("\n✗ Skill lint failed."); process.exit(1); }
console.log("\n✓ All skills lint clean.");
