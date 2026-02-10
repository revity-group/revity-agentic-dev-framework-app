# 5. Skills

## Checkout Checkpoint (Section 5)

```bash
git switch --detach codex/05-skills
```

Goal: package instructions, resources, and optional scripts into reusable skill modules.

Reference: [OpenAI Codex Skills docs](https://developers.openai.com/codex/skills).

## Why Skills

- Capture repeatable patterns once.
- Share operating knowledge across teams and projects.
- Reduce onboarding time and prompt drift.

## Best Skill for This Repo

Use an `issue-implementation-loop` skill.

Why this is a strong fit:
- This workshop repeatedly starts from GitHub issues and asks for scoped code changes.
- Flox already provides the right tools: `gh`, `git`, `ripgrep`, `bun`, `codex`.
- The workflow is consistent: understand issue -> locate code -> implement -> run checks -> summarize.

## Where to Put It

- Repo-wide skill: `.agents/skills/issue-implementation-loop/SKILL.md`
- This keeps it available to everyone working in the repository.

## Skill Components

- `SKILL.md`: primary instructions and workflow.
- Optional `scripts/`: executable helpers for repeatable steps.
- Optional `assets/` or templates: reusable artifacts.
- Optional `references/`: focused supporting material.

## Skill Template (Recommended)

Create `.agents/skills/issue-implementation-loop/SKILL.md`:

```md
---
name: issue-implementation-loop
description: Implement a GitHub issue end-to-end in this repository. Use when asked to work from an issue number, issue URL, or issue-defined requirements and deliver code changes with verification.
---

# Issue Implementation Loop

1. Read the issue details using GitHub tooling or MCP if available.
2. Summarize acceptance criteria before editing code.
3. Find relevant files with `rg` and inspect only the necessary modules.
4. Implement the smallest complete change that satisfies the issue.
5. Run verification commands:
- `bun lint`
- `bun build` (if feasible)
6. Report what changed, what was verified, and any remaining risks.

Constraints:
- Keep changes scoped to the issue.
- Follow existing project patterns and UI conventions.
- Avoid unrelated refactors.
```

## Optional MCP Dependency Metadata

If your team uses GitHub MCP, add `agents/openai.yaml` in the same skill folder:

```yaml
dependencies:
  tools:
    - type: "mcp"
      value: "github"
      description: "GitHub MCP server"
```

## How to Create It Quickly

1. In Codex, run `$skill-creator`.
2. Ask it to scaffold `issue-implementation-loop` in `.agents/skills`.
3. Paste/adapt the template above.
4. Test trigger prompts like:
- `Implement GitHub issue #11.`
- `Work on https://github.com/revity-group/revity-agentic-dev-framework-app/issues/11`

## Workshop Exercise

1. Add the skill to `.agents/skills/issue-implementation-loop/SKILL.md`.
2. Run `Implement GitHub issue #11.` without mentioning the skill explicitly.
3. Verify Codex auto-selects the skill from its description.
4. Compare result quality and consistency versus a session without the skill.

[Back: MCP](./4-mcp.md) | [Back to Docs Home](./index.md)
