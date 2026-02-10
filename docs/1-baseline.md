# 1. Baseline (Setup + Integrations)

## Checkout Checkpoint (Section 1)

```bash
git switch --detach codex/01-baseline
```

This section covers:
- Codex CLI
- IDE integrations
- "Surgical" context selection (what Codex sees vs ignores)
- Baseline task to observe default Codex behavior

## Project Setup

```bash
git clone --branch codex --single-branch https://github.com/revity-group/revity-agentic-dev-framework-app.git
cd revity-agentic-dev-framework-app
```

If already cloned:

```bash
git fetch origin
git checkout codex
```

## Codex CLI

Install Flox (preferred): [flox.dev/docs/install-flox/install](https://flox.dev/docs/install-flox/install/)

```bash
flox activate
codex
```

The project Flox manifest installs `bun`, `gh`, and `codex`, and runs `bun install` on activation.  
Manual install docs: [OpenAI Codex CLI docs](https://platform.openai.com/docs/codex/cli)

## Alternative Configuration: Manual

- Git: [git-scm.com/downloads](https://git-scm.com/downloads)
- Bun: [bun.sh/docs/installation](https://bun.sh/docs/installation)
- GitHub CLI: [cli.github.com/manual/installation](https://cli.github.com/manual/installation)
- Codex CLI: [OpenAI Codex CLI docs](https://platform.openai.com/docs/codex/cli)

Then install dependencies:

```bash
bun install
```

## IDE Integrations

- Use VS Code or Cursor.
- Open the repository folder in your IDE.
- Keep one terminal for app runtime and one for Codex interaction.
- Connect your IDE/tooling bridge used in your environment so active files and selected code can be added to context.

## "Surgical" Context Selection (What Codex Sees vs Ignores)

- Share only the files relevant to the task.
- Prefer narrow snippets over entire files when possible.
- Add architectural context first (`README.md`, key config, directory map), then target implementation files.
- Explicitly state what should be ignored when needed (generated files, logs, unrelated modules).

## Run the App

```bash
cp .env.example .env.local
# Add TMDB_API_KEY to .env.local
bun dev
```

If you get blocked, ask a workshop facilitator in session chat or in person.

## Baseline Task

Goal: show how Codex behaves with minimal project guidance.

## Task Prompt

Use this prompt in Codex:

```text
Add infinite scrolling to the movie list.

Requirements:
- When the user scrolls near the bottom of the page, load more movies
- Show a loading indicator while fetching
- Handle the "no more movies" state
- Handle errors gracefully
```

## What to Observe

- How much codebase scanning happens before implementation.
- Whether architectural conventions are followed automatically.
- Whether loading/error UX stays consistent.
- Whether code is organized in reusable hooks/components vs a large page-level change.

## Common Failure Modes to Highlight

- Overly broad edits touching unrelated files.
- Business logic added directly in route/page files.
- Inconsistent UI patterns for loading and error states.
- Weak commit hygiene (generic commit messages or mixed-scope commits).

## Reset for Next Step

After the baseline demo, discard or shelve the changes so step 2 starts from a clean branch/state.

[Back: Docs Home](./index.md) | [Next: Slash commands](./2-slash-commands.md)
