---
description: Create a GitHub PR with minimal, practical description
allowed-tools: Bash
model: haiku
argument-hint: [ticket-number or "no-ticket"]
---

# Create Pull Request Command

You are creating a GitHub Pull Request for the current branch.

## Arguments

- `$1` (optional): Ticket number (e.g., "REV-123") or "no-ticket"
  - If not provided, prompt user once: "Ticket number (or 'no-ticket'):"
  - Format: Convert to uppercase (e.g., JIRA-123, REV-456)

## Context

### Current Branch
<current_branch>
!`git branch --show-current`
</current_branch>

### Working Tree Status
<branch_status>
!`git status --short`
</branch_status>

### Commits on This Branch
<commits_on_branch>
!`git log main..HEAD --oneline`
</commits_on_branch>

### Detailed Commit Messages
<commit_details>
!`git log main..HEAD --pretty=format:"%s%n%b" --reverse`
</commit_details>

### Files Changed
<files_changed>
!`git diff main..HEAD --name-status`
</files_changed>

### Existing PR Check
<existing_pr>
!`gh pr view --json number,title,state,url --jq '"PR #\(.number): \(.title) [\(.state)]\nURL: \(.url)"' 2>/dev/null || echo "No PR exists for this branch"`
</existing_pr>

## Instructions

### Step 1: Pre-flight Checks

1. **Verify not on main** - If on `main` or `master`, STOP and inform user
2. **Check uncommitted changes** - If `git status` shows changes, STOP and tell user to run `/commit` first
3. **Check existing PR** - If PR exists, show URL and ask if user wants to update it with `gh pr edit`
4. **Check sync** - If behind remote, suggest `git pull`

If any check fails, STOP. Do not proceed.

### Step 2: Push Branch

```bash
git push -u origin $(git branch --show-current)
```

### Step 3: Analyze Changes

Review ALL commits (not just latest) to understand:
- Overall purpose of this PR
- Specific changes made
- Any breaking changes or important notes

### Step 4: Create PR

Build title in conventional commit format with ticket number:

```
<type>(<scope>): <description> [TICKET]
```

**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore

**Title requirements:**
- Under 80 characters total
- Imperative mood ("add" not "added")
- Ticket in square brackets at end
- Examples:
  - `feat(watchlist): add rating system [REV-456]`
  - `fix(api): handle null TMDB response [JIRA-789]`
  - `docs: update installation guide [no-ticket]`

**Create the PR with minimal body:**

```bash
gh pr create --base main --title "type(scope): description [TICKET]" --body "$(cat <<'EOF'
## Summary

Brief 1-2 sentence overview of what changed and why.

## Changes

- Specific change 1 (with file/module names)
- Specific change 2
- Specific change 3
EOF
)"
```

**For draft PR, add `--draft` flag:**

```bash
gh pr create --base main --draft --title "..." --body "..."
```

### Step 5: Display Result

Show the PR URL:

```bash
gh pr view --json url --jq '.url'
```

## PR Body Format

**Keep it minimal and practical:**

```markdown
## Summary

What changed and why (1-2 sentences max).

## Changes

- List specific modifications with file/module context
- Group related changes together
- Be concise but clear
```

**That's it.** No test plans, no screenshots, no breaking changes sections. Add those manually if truly needed.

### Example PR

**Title:**
```
feat(watchlist): add movie rating system [REV-456]
```

**Body:**
```markdown
## Summary

Adds 5-star rating system to watchlist for rating watched movies.

## Changes

- Add StarRating component to MovieCard.tsx
- Create useRatings hook for rating CRUD
- Add ratings.json storage in data/
- Update MovieReview interface with rating field
```

## Constraints

- NEVER push to main/master
- NEVER proceed if pre-flight checks fail
- ALWAYS analyze ALL commits, not just the latest
- ALWAYS include ticket number in title (or [no-ticket])
- Ticket MUST be in square brackets at END of title
- Keep PR descriptions SIMPLE and MINIMAL

## Error Handling

If command fails:
- Show error clearly
- Explain what went wrong
- Suggest fix
- STOP - do not continue

## Usage

```bash
/pr              # Prompts for ticket number
/pr REV-123      # With ticket number
/pr no-ticket    # No associated ticket
```
