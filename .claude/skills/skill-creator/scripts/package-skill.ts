#!/usr/bin/env bun
/**
 * Skill Packager - Creates distributable zip from skill folder
 *
 * Usage:
 *   bun run package-skill.ts <skill-directory> [output-directory]
 *
 * Examples:
 *   bun run package-skill.ts .claude/skills/my-skill
 *   bun run package-skill.ts .claude/skills/my-skill ./dist
 */

import { existsSync, readdirSync, statSync, readFileSync } from "fs";
import { basename, join, relative } from "path";
import { $ } from "bun";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateSkill(skillDir: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check SKILL.md exists
  const skillMdPath = join(skillDir, "SKILL.md");
  if (!existsSync(skillMdPath)) {
    return { valid: false, errors: ["SKILL.md not found"], warnings };
  }

  // Read and parse SKILL.md
  const content = readFileSync(skillMdPath, "utf-8");

  // Check for YAML frontmatter
  if (!content.startsWith("---")) {
    errors.push("SKILL.md must start with YAML frontmatter (---)");
    return { valid: false, errors, warnings };
  }

  const frontmatterEnd = content.indexOf("---", 3);
  if (frontmatterEnd === -1) {
    errors.push("YAML frontmatter must be closed with ---");
    return { valid: false, errors, warnings };
  }

  const frontmatter = content.slice(3, frontmatterEnd).trim();

  // Parse frontmatter fields
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

  if (!nameMatch) errors.push("Missing required field: name");
  if (!descMatch) errors.push("Missing required field: description");

  if (nameMatch) {
    const name = nameMatch[1].trim();
    const kebabPattern = /^[a-z][a-z0-9-]*[a-z0-9]$|^[a-z]$/;
    if (!kebabPattern.test(name)) {
      errors.push(`Name "${name}" must be kebab-case`);
    }
    if (name.includes("--")) {
      errors.push(`Name "${name}" cannot contain consecutive hyphens`);
    }
  }

  if (descMatch) {
    const description = descMatch[1].trim();
    if (/<[^>]+>/.test(description)) {
      errors.push("Description should not contain angle brackets");
    }
    if (description.includes("[TODO") || description.includes("TODO:")) {
      warnings.push("Description contains TODO placeholder");
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(relative(baseDir, fullPath));
    }
  }

  return files;
}

async function packageSkill(skillDir: string, outputDir: string): Promise<boolean> {
  // Validate first
  console.log("🔍 Validating skill...\n");
  const validation = validateSkill(skillDir);

  if (validation.errors.length > 0) {
    console.log("❌ Validation errors:");
    validation.errors.forEach((err) => console.log(`   • ${err}`));
    return false;
  }

  if (validation.warnings.length > 0) {
    console.log("⚠️  Warnings:");
    validation.warnings.forEach((warn) => console.log(`   • ${warn}`));
    console.log();
  }

  console.log("✅ Validation passed\n");

  // Get skill name from directory
  const skillName = basename(skillDir);
  const zipPath = join(outputDir, `${skillName}.zip`);

  // Get all files
  const files = getAllFiles(skillDir);
  console.log(`📦 Packaging ${files.length} files...`);

  try {
    // Use zip command (available on macOS/Linux)
    const absoluteSkillDir = join(process.cwd(), skillDir);
    const absoluteZipPath = join(process.cwd(), zipPath);

    // Remove existing zip if present
    if (existsSync(absoluteZipPath)) {
      await $`rm ${absoluteZipPath}`;
    }

    // Create zip from skill directory
    await $`cd ${absoluteSkillDir} && zip -r ${absoluteZipPath} .`;

    console.log(`\n✅ Created: ${zipPath}`);
    console.log("\nIncluded files:");
    files.forEach((file) => console.log(`   • ${file}`));

    return true;
  } catch (error) {
    console.log(`❌ Error creating zip: ${error}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Usage: bun run package-skill.ts <skill-directory> [output-directory]");
    console.log("\nExamples:");
    console.log("  bun run package-skill.ts .claude/skills/my-skill");
    console.log("  bun run package-skill.ts .claude/skills/my-skill ./dist");
    process.exit(1);
  }

  const skillDir = args[0];
  const outputDir = args[1] || ".";

  if (!existsSync(skillDir)) {
    console.log(`❌ Error: Directory not found: ${skillDir}`);
    process.exit(1);
  }

  console.log(`📦 Packaging skill: ${skillDir}`);
  console.log(`   Output: ${outputDir}\n`);

  const success = await packageSkill(skillDir, outputDir);
  process.exit(success ? 0 : 1);
}

main();
