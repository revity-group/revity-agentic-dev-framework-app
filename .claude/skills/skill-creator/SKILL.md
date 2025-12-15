---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
license: Complete terms in LICENSE.txt
---

# Skill Creator

Create skills that extend Claude's capabilities with specialized knowledge, workflows, and tools.

## Quick Start

```bash
bun run scripts/init-skill.ts <skill-name> --path <output-directory>
```

## Skill Anatomy

```
skill-name/
├── SKILL.md           # Required - metadata + instructions
├── scripts/           # Optional - executable code (TypeScript/Bun preferred)
├── references/        # Optional - docs loaded into context as needed
└── assets/            # Optional - templates, images for output
```

### SKILL.md Requirements

| Field | Required | Notes |
|-------|----------|-------|
| `name` | Yes | kebab-case, max 64 chars |
| `description` | Yes | What it does + when to use it, max 1024 chars |
| `allowed-tools` | No | Comma-separated tool restrictions |

## Progressive Disclosure

Skills use three-level loading to manage context efficiently:

1. **Metadata** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed (unlimited)

## Full Creation Process

See `references/creation-process.md` for the complete 6-step workflow:
1. Understanding the skill with concrete examples
2. Planning reusable contents
3. Initializing the skill
4. Editing SKILL.md and resources
5. Validating and packaging
6. Iterating based on usage

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/init-skill.ts` | Initialize new skill with template |
| `scripts/validate-skill.ts` | Validate skill meets requirements |
| `scripts/package-skill.ts` | Package skill as distributable zip |

## Writing Style

Use imperative/infinitive form (verb-first), not second person:
- Good: "To accomplish X, do Y"
- Avoid: "You should do X"
