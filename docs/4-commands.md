---
layout: default
title: 4. Slash Commands
nav_order: 6
---

# Section 4: Slash Commands

Turn repetitive prompts into reusable one-word commands.

---

## What Are Slash Commands?

Slash commands are shortcuts for prompts you use often. Instead of typing the same instructions repeatedly, you save them once and invoke them with `/command-name`.
ad
**Think of them like:**
- Shell aliases for your AI workflow
- Saved prompts that your whole team can share
- Standardized workflows that run the same way every time

## Where Do Commands Live?

| Location | Scope | Use Case |
|----------|-------|----------|
| `.claude/commands/` | Project (shared via git) | Team workflows |
| `~/.claude/commands/` | Personal (all projects) | Your preferences |

---

## Experience the Problem

Let's feel the pain. Make a few small changes to a few diff files

### Attempt 1: The lazy prompt

```text
commit my changes
```

**Notice:** Does it follow your team's commit format? Conventional commits?

### Attempt 2: Be more specific

```text
Write a commit message for my staged changes
```

**Notice:** Better, but does Claude know your conventions? `feat` vs `feature`?

### Attempt 3: The full prompt (every. single. time.)

```text
Look at my staged changes and write a conventional commit message.

Use this format:
type(scope): subject

Types: feat, fix, docs, style, refactor, test, chore

Keep the subject under 50 characters, imperative mood.
```

**Notice:** This works - but you just typed a paragraph for a one-line commit message.

### The Real Pain

- [ ] You typed a paragraph just to get a one-line commit message
- [ ] Tomorrow you'll forget the exact format and type something slightly different
- [ ] Your teammate uses a different prompt and gets different results
- [ ] None of this is in version control

---

## Create Your First Command

Now let's save that prompt as a reusable command.

### Step 1: Create the directory

```bash
mkdir -p .claude/commands
```

### Step 2: Create a basic command file

Create `.claude/commands/commit.md`:

```markdown
---
description: Generate a commit message for staged changes
---

Look at my staged changes and write a conventional commit message.

Use this format:
type(scope): subject

Types: feat, fix, docs, style, refactor, test, chore

Keep the subject under 50 characters, imperative mood.
```

### Step 3: Test the basic version

```text
/commit
```

It works, but Claude doesn't actually *see* your changes or know your conventions.

---

## Level Up: Dynamic Commands

Commands become powerful when they inject **real data**:

| Syntax | What It Does | Example |
|--------|--------------|---------|
| `!command` | Inject shell output | `!git diff --staged` |
| `$ARGUMENTS` | Capture user input | `/deploy $ARGUMENTS` |

### Step 4: Upgrade your command

Replace `.claude/commands/commit.md` with:

```markdown
---
description: Smart commit - analyze changes and create logical commits
---

Analyze my git state and help me create clean, logical commits.

## Conventions

- Format: `type(scope): subject`
- Types: feat, fix, docs, style, refactor, test, chore
- Subject under 50 characters, imperative mood

## Current State

**Staged changes:**
!git diff --staged --stat

**Unstaged changes:**
!git diff --stat

**Untracked files:**
!git ls-files --others --exclude-standard

## Your Task

1. Review what's staged vs unstaged
2. Decide: should these be one commit or split into multiple logical commits?
3. If splitting makes sense, tell me what to stage/unstage
4. Write the commit message(s) following the conventions above
5. Execute the commit(s)
```

---

## Test the Smart Version

### 1. Make some changes to different files

```bash
# Edit a component, a doc, and maybe a config file
```

### 2. Run the upgraded command

```text
/commit
```

### 3. Notice what's different now

| Basic Command | Smart Command |
|---------------|---------------|
| Claude guesses at your changes | Claude **sees** actual git state |
| Generic commit format | **Your team's** conventions injected |
| One commit only | Suggests **logical splits** when needed |
| You run git commands | Claude **executes** commits for you |

---

## Try It Yourself

Create a `/review` command that reviews your uncommitted changes.

### The Task

Create `.claude/commands/review.md`:

```markdown
---
description: Review uncommitted changes before committing
---

Review my uncommitted changes and check for:
- Bugs or logic errors
- Missing error handling
- Code style issues
- Anything I might have forgotten

Be concise. Only mention real issues.
```

Test it:

```text
/review
```

---

## Built-in Commands Worth Knowing

| Command | What It Does |
|---------|--------------|
| `/init` | Create CLAUDE.md for your project |
| `/help` | See all available commands (including yours!) |
| `/compact` | Reduce context size without losing everything |
| `/cost` | See token usage |
| `/doctor` | Diagnose issues with your setup |

---

## Command Features (Reference)

| Feature | Syntax | Example |
|---------|--------|---------|
| Arguments | `$ARGUMENTS` | `/fix-issue 123` → `$ARGUMENTS = "123"` |
| Positional | `$1`, `$2` | `/deploy prod v1.2` → `$1="prod"` |
| Shell output | `!command` | `!git status` injects output |
| File content | `@file` | `@package.json` injects file |

---

## Advanced: Structured Commands (Optional)

After you're comfortable with basic commands, you can add structure for validation and consistent output:

| Scenario | Basic Output | Structured Output |
|----------|--------------|-------------------|
| Success | "Here's your commit message: feat(ui): add button..." | `STATUS=OK MESSAGE="feat(ui): add button"` |
| No staged changes | "I notice you haven't staged anything..." | `STATUS=FAIL ERROR="no staged changes"` |

Ask your workshop facilitator about `/create-command` if you want to explore this pattern.

---

## Catch Up

```bash
git checkout workshop/section-4-commands
```

---

[← Back to CLAUDE.md](./3-claude-memory.md) | [Next: Hooks →](./5-hooks.md)
