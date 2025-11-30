---
description: Create a conventional commit message and commit staged changes
allowed-tools: Bash(git diff), Bash(git log), Bash(git add), Bash(git commit), Bash(git status)
model: claude-haiku-4-5-20251001
---

# Conventional Commit Context

Read @.claude/conventions/commit-commands.md file and use the commands to get the context.

## Instructions

Read @.claude/conventions/commit-rules.md file and commit using the conventions.

### Staging

- If changes are already staged, commit only what's staged
- If nothing is staged, review unstaged changes carefully before staging
- Avoid `git add -A` if sensitive files (.env, credentials) might be included

```bash
git commit -m "type(scope): description"
```
