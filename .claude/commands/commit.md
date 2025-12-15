---
description: Create a conventional commit message and commit staged changes
allowed-tools: Bash
model: haiku
---

# Conventional Commit Command

You are creating a conventional commit for the current git repository.

## Context

The following git information is loaded automatically:

### Working Tree State
<git_status>
!`git status`
</git_status>

### Staged Changes (What Will Be Committed)
<staged_diff>
!`git diff --cached`
</staged_diff>

### Unstaged Changes (Not Yet Staged)
<unstaged_diff>
!`git diff`
</unstaged_diff>

### Recent Commit History (For Style Reference)
<recent_commits>
!`git log --oneline -5`
</recent_commits>

## Instructions

Follow these steps in order:

### Step 1: Analyze Changes

Review the staged and unstaged changes above. Determine:
- What is already staged for commit
- What is unstaged but might need to be included
- Whether changes are logically related or should be split into multiple commits

### Step 2: Check for Sensitive Files

Before staging anything, verify there are no sensitive files:
- `.env`, `.env.local`, `.env.production`
- `credentials.json`, `secrets.yaml`
- Private keys or certificates
- Any files containing API keys or passwords

If sensitive files are present, DO NOT stage them. Warn the user.

### Step 3: Stage Files (If Needed)

- If changes are already staged, proceed to commit
- If nothing is staged, carefully stage relevant files with `git add <file>`
- NEVER use `git add -A` or `git add .` without explicit user request

### Step 4: Create Commit Message

Draft a commit message following conventional commit format:

```
<type>(<scope>): <description>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, missing semicolons, etc
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Performance improvement
- `test` - Adding or updating tests
- `build` - Build system or dependencies
- `ci` - CI configuration
- `chore` - Routine tasks, maintenance

**Scope:**
- Use folder/feature name (e.g., `auth`, `api`, `ui`)
- Omit if change is broad or affects multiple areas

**Description:**
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Keep under 72 characters

**Breaking Changes:**
- Add `!` after type/scope: `feat(api)!: remove deprecated endpoint`

### Step 5: Commit

Execute the commit:

```bash
git commit -m "type(scope): description"
```

### Step 6: Verify

After committing, run `git status` to confirm the commit succeeded and show the clean working tree.

## Constraints

- NEVER mention AI, Claude, or automated tools in commit messages
- NEVER include co-authorship attribution unless explicitly requested by user
- ALWAYS use single-line commit messages (no multi-line bodies unless user requests)
- If changes are unrelated, ask user if they want to split into multiple commits
- If no changes are staged and nothing to commit, inform the user clearly

## Examples

**Good commit messages:**
- `feat(auth): add OAuth2 login flow`
- `fix(api): handle null response from TMDB endpoint`
- `docs: update installation instructions`
- `refactor(ui): extract MovieCard component logic`
- `test(hooks): add tests for useMovies hook`

**Bad commit messages (avoid these):**
- `Updated files` (not descriptive)
- `Fix bug` (which bug? where?)
- `Added feature with Claude Code` (no AI attribution)
- `WIP` (commit should be complete)
