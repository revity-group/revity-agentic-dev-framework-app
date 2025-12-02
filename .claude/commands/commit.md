---
description: Create a conventional commit message and commit staged changes
allowed-tools: Bash(git diff), Bash(git log), Bash(git add), Bash(git commit), Bash(git status)
model: haiku
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

NEVER EVER mention AI / Claude in the commit message. No need to announce code is co authored by AI.

ALWAYS use one line commit message and be clear.

ONLY USE EMOJIS TO DESCRIBE THE COMMIT MESSAGE.

### Staging

- If changes are already staged, commit only what's staged
- If nothing is staged, review unstaged changes carefully before staging
- Avoid `git add -A` if sensitive files (.env, credentials) might be included

```bash
git commit -m "type(scope): description"
```
