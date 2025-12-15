#!/usr/bin/env bun
/**
 * Skill Initializer - Creates a new skill from template
 *
 * Usage:
 *   bun run init-skill.ts <skill-name> --path <output-directory>
 *
 * Examples:
 *   bun run init-skill.ts my-new-skill --path .claude/skills
 *   bun run init-skill.ts api-helper --path ~/.claude/skills
 */

import { existsSync, mkdirSync, writeFileSync, chmodSync } from "fs";
import { join } from "path";

// Templates
const SKILL_TEMPLATE = `---
name: {{skill_name}}
description: "[TODO: Complete and informative explanation of what the skill does and when to use it. Include WHEN to use this skill - specific scenarios, file types, or tasks that trigger it.]"
---

# {{skill_title}}

## Overview

[TODO: 1-2 sentences explaining what this skill enables]

## Structuring This Skill

[TODO: Choose the structure that best fits this skill's purpose. Common patterns:

**1. Workflow-Based** (best for sequential processes)
- Works well when there are clear step-by-step procedures
- Structure: ## Overview → ## Workflow → ## Step 1 → ## Step 2...

**2. Task-Based** (best for tool collections)
- Works well when the skill offers different operations/capabilities
- Structure: ## Overview → ## Quick Start → ## Task 1 → ## Task 2...

**3. Reference/Guidelines** (best for standards or specifications)
- Works well for brand guidelines, coding standards, or requirements
- Structure: ## Overview → ## Guidelines → ## Specifications...

**4. Capabilities-Based** (best for integrated systems)
- Works well when the skill provides multiple interrelated features
- Structure: ## Overview → ## Core Capabilities → ### 1. Feature → ### 2. Feature...

Delete this "Structuring This Skill" section when done - it's just guidance.]

## [TODO: Replace with the first main section]

[TODO: Add content here. Examples:
- Code samples for technical skills
- Decision trees for complex workflows
- Concrete examples with realistic user requests
- References to scripts/templates/references as needed]

## Resources

This skill includes example resource directories:

### scripts/
Executable code (TypeScript/Bun preferred, Python/Bash supported) for automation tasks.

**Example:** \`scripts/example.ts\` - Run with \`bun run scripts/example.ts\`

### references/
Documentation loaded into context as needed.

**Example:** \`references/api-reference.md\` - Detailed API docs, schemas, guides

### assets/
Files used in output (not loaded into context).

**Example:** Templates, images, fonts, boilerplate code

---

**Delete any unneeded directories.** Not every skill requires all three.
`;

const EXAMPLE_SCRIPT = `#!/usr/bin/env bun
/**
 * Example helper script for {{skill_name}}
 * Run with: bun run scripts/example.ts
 */

async function main() {
  console.log("Example script for {{skill_name}}");
  // TODO: Add actual script logic here
  // Examples: data processing, file conversion, API calls, etc.
}

main().catch(console.error);
`;

const EXAMPLE_REFERENCE = `# Reference Documentation for {{skill_title}}

This is a placeholder for detailed reference documentation.
Replace with actual content or delete if not needed.

## When Reference Docs Are Useful

- Comprehensive API documentation
- Detailed workflow guides
- Complex multi-step processes
- Information too lengthy for main SKILL.md
- Content only needed for specific use cases

## Structure Suggestions

### API Reference Example
- Overview
- Authentication
- Endpoints with examples
- Error codes

### Workflow Guide Example
- Prerequisites
- Step-by-step instructions
- Common patterns
- Troubleshooting
`;

const EXAMPLE_ASSET = `# Example Asset File

This placeholder represents where asset files would be stored.
Replace with actual asset files or delete if not needed.

Asset files are NOT loaded into context, but used in output.

## Common Asset Types

- Templates: .pptx, .docx, boilerplate directories
- Images: .png, .jpg, .svg
- Fonts: .ttf, .otf, .woff2
- Boilerplate: Project directories, starter files
- Data: .csv, .json, .yaml

Note: This is a text placeholder. Actual assets can be any file type.
`;

function toTitleCase(skillName: string): string {
  return skillName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function applyTemplate(template: string, skillName: string): string {
  const skillTitle = toTitleCase(skillName);
  return template.replace(/\{\{skill_name\}\}/g, skillName).replace(/\{\{skill_title\}\}/g, skillTitle);
}

function initSkill(skillName: string, outputPath: string): boolean {
  const skillDir = join(outputPath, skillName);

  // Check if directory already exists
  if (existsSync(skillDir)) {
    console.log(`❌ Error: Skill directory already exists: ${skillDir}`);
    return false;
  }

  try {
    // Create skill directory
    mkdirSync(skillDir, { recursive: true });
    console.log(`✅ Created skill directory: ${skillDir}`);

    // Create SKILL.md
    const skillMdPath = join(skillDir, "SKILL.md");
    writeFileSync(skillMdPath, applyTemplate(SKILL_TEMPLATE, skillName));
    console.log("✅ Created SKILL.md");

    // Create scripts/ with example.ts
    const scriptsDir = join(skillDir, "scripts");
    mkdirSync(scriptsDir);
    const exampleScript = join(scriptsDir, "example.ts");
    writeFileSync(exampleScript, applyTemplate(EXAMPLE_SCRIPT, skillName));
    chmodSync(exampleScript, 0o755);
    console.log("✅ Created scripts/example.ts");

    // Create references/ with api-reference.md
    const referencesDir = join(skillDir, "references");
    mkdirSync(referencesDir);
    writeFileSync(join(referencesDir, "api-reference.md"), applyTemplate(EXAMPLE_REFERENCE, skillName));
    console.log("✅ Created references/api-reference.md");

    // Create assets/ with example-asset.txt
    const assetsDir = join(skillDir, "assets");
    mkdirSync(assetsDir);
    writeFileSync(join(assetsDir, "example-asset.txt"), EXAMPLE_ASSET);
    console.log("✅ Created assets/example-asset.txt");

    console.log(`\n✅ Skill '${skillName}' initialized successfully at ${skillDir}`);
    console.log("\nNext steps:");
    console.log("1. Edit SKILL.md to complete the TODO items");
    console.log("2. Customize or delete example files in scripts/, references/, assets/");
    console.log("3. Run validate-skill.ts to check the skill structure");

    return true;
  } catch (error) {
    console.log(`❌ Error creating skill: ${error}`);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const pathIndex = args.indexOf("--path");
  if (args.length < 1 || pathIndex === -1 || pathIndex + 1 >= args.length) {
    console.log("Usage: bun run init-skill.ts <skill-name> --path <output-directory>");
    console.log("\nSkill name requirements:");
    console.log("  - kebab-case (e.g., 'data-analyzer', 'api-helper')");
    console.log("  - Lowercase letters, digits, and hyphens only");
    console.log("  - Max 64 characters");
    console.log("\nExamples:");
    console.log("  bun run init-skill.ts my-new-skill --path .claude/skills");
    console.log("  bun run init-skill.ts api-helper --path ~/.claude/skills");
    process.exit(1);
  }

  const skillName = args[0];
  const outputPath = args[pathIndex + 1];

  console.log(`🚀 Initializing skill: ${skillName}`);
  console.log(`   Location: ${outputPath}\n`);

  const success = initSkill(skillName, outputPath);
  process.exit(success ? 0 : 1);
}

main();
