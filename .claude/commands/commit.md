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

Review the changes above and commit using conventional commit format:

```text
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

Scope: Use folder/feature name (e.g., `auth`, `api`, `ui`). Omit if change is broad.

For breaking changes, add \`\`!\`\` after type: `feat(api)!: remove deprecated endpoint`

If changes are unrelated, split into logical commits. Otherwise, one commit is fine.

Never mention AI / Claude in the commit message.

Prefer one line commit message if feasible. If not, use multiple lines to describe the changes. but keep it under 50 words.

### Staging

- If changes are already staged, commit only what's staged
- If nothing is staged, review unstaged changes carefully before staging
- Avoid `git add -A` if sensitive files (.env, credentials) might be included

```bash
git commit -m "type(scope): description"
```
