---
description: Create a conventional commit message and commit staged changes
allowed-tools: Bash(git diff), Bash(git log), Bash(git add), Bash(git commit), Bash(git status)
model: claude-haiku-4-5-20251001
---

# Conventional Commit Context

- shows working tree state (staged, unstaged, untracked files)
<git_status>
!`git status`
</git_status>

- shows the actual staged changes (what will be committed)
<staged_diff>
!`git diff --cached`
</staged_diff>

- shows the actual unstaged changes (what is not staged for commit)
<unstaged_diff>
!`git diff`
</unstaged_diff>

- shows the recent commits (last 5 commits,to match style/conventions)
<recent_commits>
!`git log --oneline -5`
</recent_commits>

## Instructions

Read @.claude/conventions/commit-rules.md file and commit using the conventions.

### Staging

- If changes are already staged, commit only what's staged
- If nothing is staged, review unstaged changes carefully before staging
- Avoid `git add -A` if sensitive files (.env, credentials) might be included

```bash
git commit -m "type(scope): description"
```
