---
description: Create a new GitHub PR with a well-formatted description
allowed-tools: Bash(git status), Bash(git branch), Bash(git log), Bash(git diff), Bash(git push), Bash(git pull), Bash(git rev-parse), Bash(gh pr create), Bash(gh pr view:*), Bash(gh pr edit), Bash(echo:*)
model: claude-haiku-4-5-20251001
---

# Create Pull Request Context

<current_branch>
!`git branch --show-current`
</current_branch>

<branch_status>
!`git status --short`
</branch_status>

<commits_on_branch>
!`git log main..HEAD --oneline`
</commits_on_branch>

<commit_details>
!`git log main..HEAD --pretty=format:"### %s%n%n%b%n---"`
</commit_details>

<full_diff_stat>
!`git diff main..HEAD --stat`
</full_diff_stat>

<files_changed>
!`git diff main..HEAD --name-only`
</files_changed>

<existing_pr>
!`gh pr view --json number,title,state,url --jq '"PR #\(.number): \(.title) [\(.state)]\nURL: \(.url)"' 2>/dev/null || echo "No PR exists for this branch"`
</existing_pr>

## Instructions

Review the changes above and create PR using following conventions:

For PR title ALWAYS follow the following format:

```text
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

Scope: Use folder/feature name (e.g., `auth`, `api`, `ui`). Omit if change is broad.

For breaking changes, add \`\`!\`\` after type: `feat(api)!: remove deprecated endpoint`

### Pre-checks

1. **Check for uncommitted changes** - if there are uncommitted changes, stop and ask the user to commit first.
2. **Verify not on main** - if on main branch, stop and inform the user.
3. **Check if PR already exists** - if a PR exists, show the URL and ask if user wants to update it.

### Create the PR

**Single commit branch** - use `--fill-first` to auto-fill from commit:
```bash
gh pr create --base main --fill-first
```

**Multi-commit branch** - craft a custom description using conventional format.
