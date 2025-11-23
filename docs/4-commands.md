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

Let's feel the pain first. Make a small change to any file, then stage it:

```bash
git add .
```

Now ask Claude to write a commit message:

```text
Look at my staged changes and write a conventional commit message.

Use this format:
type(scope): subject

Types: feat, fix, docs, style, refactor, test, chore

Keep the subject under 50 characters, imperative mood.
```

### While You Work, Notice

- [ ] How long was that prompt to type?
- [ ] If you commit 10 times a day, how often do you type this?
- [ ] Does everyone on your team use the same commit format?

---

## Create Your First Command

Now let's save that prompt as a reusable command.

### Step 1: Create the directory

```bash
mkdir -p .claude/commands
```

### Step 2: Create the command file

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

---

## Test It

### 1. Stage some changes

```bash
git add .
```

### 2. Run your new command

```text
/commit
```

### 3. Notice the difference

| Without Command | With `/commit` |
|-----------------|----------------|
| Type full paragraph every time | Type 7 characters |
| Everyone's prompt is different | Same workflow for whole team |
| Easy to forget format details | Format is baked in |

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
