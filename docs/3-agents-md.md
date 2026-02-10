# 3. AGENTS.md (Project Guidance)

## Checkout Checkpoint (Section 3)

```bash
git switch --detach codex/03-agents-md
```

Goal: show how explicit guidance changes Codex responses and behaviour.

## Why `AGENTS.md`

Codex reads `AGENTS.md` files before doing any work, so guidance is always in context.
Layer global defaults with project or subdirectory instructions for consistent decisions.

## How Codex Finds `AGENTS.md`

- Global: in `~/.codex` (or `CODEX_HOME`), reads `AGENTS.override.md` if present; otherwise `AGENTS.md`.
- Project: from repo root to your current directory, checks `AGENTS.override.md`, then `AGENTS.md`, then any `project_doc_fallback_filenames` entries. At most one file per directory.
- Merge: concatenates instructions from root to current directory; later files override earlier ones. Stops when total size hits `project_doc_max_bytes` (32 KiB default) and skips empty files.

Reference: [OpenAI AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md).

## Optional: `AGENTS.override.md` Setup

Use this when you want local behavior without changing shared project guidance.

- Personal defaults: create `~/.codex/AGENTS.override.md`.
- Project-local override: create `AGENTS.override.md` in the repo (or a subdirectory) to override `AGENTS.md` for that path.
- Team-safe default: keep shared guidance in committed `AGENTS.md`; treat `AGENTS.override.md` as local/temporary unless your team explicitly decides to version it.

Example global override:

```md
# ~/.codex/AGENTS.override.md

## Personal Defaults
- Keep responses concise.
- Run relevant tests before finalizing code changes.
```

Example project-local override for workshop experiments:

```md
# ./AGENTS.override.md

## Workshop Override
- Keep changes focused to files mentioned in the prompt.
- Prefer reusable hooks/components over page-level business logic.
```

## What to Include in `AGENTS.md`

- Project structure and directory responsibilities.
- Tech stack and standard tooling.
- Coding conventions (naming, file placement, error handling, UI standards).
- Testing conventions.
- Commit and PR expectations.

## Minimal `AGENTS.md` Template

```md
# AGENTS.md

## Project Overview
- Next.js app with TypeScript and Tailwind CSS.

## Structure
- `app/`: routing and composition only
- `components/`: presentational and reusable UI
- `hooks/`: reusable state/data logic
- `lib/`: pure utilities

## Conventions
- Prefer reusable hooks/components over page-level business logic.
- Use established UI components and loading patterns.
- Keep changes scoped to the task; avoid unrelated refactors.

## Testing
- Add/update tests for changed behavior.
- Keep tests close to code where practical.

## Git
- Use focused commits with descriptive messages.
```

## Exercise

1. If you have not done it yet, run `/init` in Codex to scaffold an `AGENTS.md` placeholder.
2. Copy/adapt the guidance content into `AGENTS.md` for this repository.
3. Re-run the same baseline prompt from step 1.
4. Compare output quality, structure, and consistency.

[Back: Slash commands](./2-slash-commands.md) | [Next: MCP](./4-mcp.md)
