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

Let's feel the pain. Make a few small changes to a few diff files:

```bash
git add .
```

### Attempt 1: The lazy prompt

```text
commit my changes
```

**What happens:** Claude writes something... but probably not in your team's format. Maybe it's too verbose. Maybe it doesn't follow conventional commits. You end up editing it anyway.

### Attempt 2: Be more specific

```text
Write a commit message for my staged changes
```

**What happens:** Better, but still generic. Claude doesn't know you use conventional commits, or that your team prefers `feat` over `feature`.

### Attempt 3: The full prompt (every. single. time.)

```text
Look at my staged changes and write a conventional commit message.

Use this format:
type(scope): subject

Types: feat, fix, docs, style, refactor, test, chore

Keep the subject under 50 characters, imperative mood.
```

**What happens:** Finally works! But you just typed a bunch of words. And you'll type them again. And again. 10+ times a day.

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
| `@file` | Inject file contents | `@.claude/conventions/git.md` |
| `!command` | Inject shell output | `!git diff --staged --stat` |
| `$ARGUMENTS` | Capture user input | `/deploy $ARGUMENTS` |

### Step 4: Upgrade your command

Replace `.claude/commands/commit.md` with:

```markdown
---
description: Smart commit - analyze changes and create logical commits
---

Analyze my git state and help me create clean, logical commits.

## Conventions

@.claude/conventions/git.md

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
4. Once we agree, write the commit message(s) following the conventions above
5. Execute the commit(s)
```

---

## Catch Up

```bash
git checkout workshop/section-4-commands
```

---

[← Back to CLAUDE.md](./3-claude-memory.md) | [Next: Hooks →](./5-hooks.md)
