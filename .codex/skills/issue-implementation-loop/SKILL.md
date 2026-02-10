---
name: issue-implementation-loop
description: Implement a GitHub issue end-to-end in this repository, from reading the issue to delivering code changes and verification. Use when asked to work from an issue number, issue URL, or issue-defined requirements and report the results.
---

# Issue Implementation Loop

## Overview
Execute a consistent, end-to-end workflow for implementing GitHub issues in this repo with minimal, verified changes.

## Workflow
1. Read the issue details using GitHub tooling or MCP if available. Capture the exact requirements and constraints.
2. Summarize acceptance criteria before making edits. Call out assumptions and any missing details.
3. Locate relevant code with `rg` and inspect only the necessary files.
4. Implement the smallest complete change that satisfies the issue. Follow existing patterns and UI conventions.
5. Verify changes:
   - Run `bun lint`.
   - Run `bun build` when feasible; if not feasible, state why.
6. Report what changed, what was verified, and any remaining risks or follow-ups.

## Constraints
- Keep changes scoped to the issue. Avoid unrelated refactors.
- Preserve existing architecture, naming, and styling conventions.
- Prefer clear, minimal diffs over broad rewrites.

## Reporting Checklist
- Acceptance criteria summary.
- Files changed and brief rationale.
- Verification results (including failures or skipped steps).
- Remaining risks or TODOs.
