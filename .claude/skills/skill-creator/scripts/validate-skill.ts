#!/usr/bin/env bun
/**
 * Skill Validator - Validates skill structure and metadata
 *
 * Usage:
 *   bun run validate-skill.ts <skill-directory>
 *
 * Example:
 *   bun run validate-skill.ts .claude/skills/my-skill
 */

import { existsSync, readFileSync } from "fs";
import { basename, join } from "path";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateSkill(skillDir: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check directory exists
  if (!existsSync(skillDir)) {
    return { valid: false, errors: [`Directory not found: ${skillDir}`], warnings };
  }

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

  // Validate required fields
  if (!nameMatch) {
    errors.push("Missing required field: name");
  }
  if (!descMatch) {
    errors.push("Missing required field: description");
  }

  if (nameMatch) {
    const name = nameMatch[1].trim();
    const dirName = basename(skillDir);

    // Validate name format (kebab-case)
    const kebabPattern = /^[a-z][a-z0-9-]*[a-z0-9]$|^[a-z]$/;
    if (!kebabPattern.test(name)) {
      errors.push(
        `Name "${name}" must be kebab-case (lowercase letters, digits, hyphens only, cannot start/end with hyphen)`
      );
    }

    // Check for consecutive hyphens
    if (name.includes("--")) {
      errors.push(`Name "${name}" cannot contain consecutive hyphens`);
    }

    // Check max length
    if (name.length > 64) {
      errors.push(`Name "${name}" exceeds maximum length of 64 characters`);
    }

    // Warn if name doesn't match directory
    if (name !== dirName) {
      warnings.push(`Name "${name}" does not match directory name "${dirName}"`);
    }
  }

  if (descMatch) {
    const description = descMatch[1].trim();

    // Check for angle brackets (likely HTML/template artifacts)
    if (/<[^>]+>/.test(description)) {
      errors.push("Description should not contain angle brackets");
    }

    // Check max length
    if (description.length > 1024) {
      errors.push(`Description exceeds maximum length of 1024 characters`);
    }

    // Warn if description looks incomplete
    if (description.includes("[TODO") || description.includes("TODO:")) {
      warnings.push("Description contains TODO placeholder");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Usage: bun run validate-skill.ts <skill-directory>");
    console.log("\nExample:");
    console.log("  bun run validate-skill.ts .claude/skills/my-skill");
    process.exit(1);
  }

  const skillDir = args[0];
  console.log(`🔍 Validating skill: ${skillDir}\n`);

  const result = validateSkill(skillDir);

  if (result.errors.length > 0) {
    console.log("❌ Errors:");
    result.errors.forEach((err) => console.log(`   • ${err}`));
  }

  if (result.warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    result.warnings.forEach((warn) => console.log(`   • ${warn}`));
  }

  if (result.valid) {
    console.log("✅ Skill validation passed");
    process.exit(0);
  } else {
    console.log("\n❌ Skill validation failed");
    process.exit(1);
  }
}

main();
