# Skill Creation Process

Follow these steps in order, skipping only when there is a clear reason why they are not applicable.

## Step 1: Understanding the Skill with Concrete Examples

Skip this step only when the skill's usage patterns are already clearly understood. It remains valuable even when working with an existing skill.

To create an effective skill, clearly understand concrete examples of how the skill will be used. This understanding can come from either direct user examples or generated examples that are validated with user feedback.

For example, when building an image-editor skill, relevant questions include:

- "What functionality should the image-editor skill support? Editing, rotating, anything else?"
- "Can you give some examples of how this skill would be used?"
- "I can imagine users asking for things like 'Remove the red-eye from this image' or 'Rotate this image'. Are there other ways you imagine this skill being used?"
- "What would a user say that should trigger this skill?"

To avoid overwhelming users, avoid asking too many questions in a single message. Start with the most important questions and follow up as needed for better effectiveness.

Conclude this step when there is a clear sense of the functionality the skill should support.

## Step 2: Planning the Reusable Skill Contents

To turn concrete examples into an effective skill, analyze each example by:

1. Considering how to execute on the example from scratch
2. Identifying what scripts, references, and assets would be helpful when executing these workflows repeatedly

**Example - pdf-editor skill:** For queries like "Help me rotate this PDF," rotating a PDF requires re-writing the same code each time. A `scripts/rotate-pdf.ts` script would be helpful to store in the skill.

**Example - frontend-webapp-builder skill:** For queries like "Build me a todo app" or "Build me a dashboard to track my steps," writing a frontend webapp requires the same boilerplate each time. An `assets/hello-world/` template would be helpful.

**Example - big-query skill:** For queries like "How many users have logged in today?", querying BigQuery requires re-discovering table schemas each time. A `references/schema.md` file documenting the schemas would be helpful.

## Step 3: Initializing the Skill

Skip this step if iterating on an existing skill.

Always run the init script to generate a new skill:

```bash
bun run scripts/init-skill.ts <skill-name> --path <output-directory>
```

The script:
- Creates the skill directory at the specified path
- Generates a SKILL.md template with proper frontmatter and TODO placeholders
- Creates example resource directories: `scripts/`, `references/`, and `assets/`
- Adds example files that can be customized or deleted

## Step 4: Edit the Skill

Remember that the skill is being created for another instance of Claude to use. Focus on including information that would be beneficial and non-obvious.

### Start with Reusable Skill Contents

Begin implementation with the reusable resources identified in Step 2: `scripts/`, `references/`, and `assets/` files. This may require user input (e.g., brand assets, documentation).

Delete any example files not needed for the skill.

### Update SKILL.md

**Writing Style:** Use imperative/infinitive form (verb-first instructions), not second person. Use objective, instructional language (e.g., "To accomplish X, do Y" rather than "You should do X").

Answer these questions in SKILL.md:

1. What is the purpose of the skill, in a few sentences?
2. When should the skill be used?
3. How should Claude use the skill? Reference all reusable contents.

## Step 5: Validating and Packaging

Validate the skill:

```bash
bun run scripts/validate-skill.ts <path/to/skill-folder>
```

The validation checks:
- YAML frontmatter format and required fields
- Skill naming conventions (kebab-case, max 64 chars)
- Description quality (no angle brackets, no TODO placeholders)

Package for distribution:

```bash
bun run scripts/package-skill.ts <path/to/skill-folder>
```

Optional output directory:

```bash
bun run scripts/package-skill.ts <path/to/skill-folder> ./dist
```

## Step 6: Iterate

After testing, users may request improvements. Often this happens right after using the skill with fresh context.

**Iteration workflow:**
1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again
