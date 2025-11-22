---
layout: default
title: 2. Baseline Task
nav_order: 3
---

# Section 2: Baseline Task (No Setup)

Implement infinite scrolling with zero Claude Code configuration. This is your "before" experience.

---

## Goal

Add infinite scrolling to the movie list. When users scroll near the bottom, automatically load more movies.

---

## Important: No Setup!

For this section, make sure you have:

- **NO** `.claude/` folder (delete it if it exists)
- **NO** `CLAUDE.md` file
- Just raw Claude Code with no configuration

```bash
# Remove any existing Claude config (if present)
rm -rf .claude
rm -f CLAUDE.md
```

---

## The Task

Open Claude Code and give it this prompt:

```
Add infinite scrolling to the movie list.

Requirements:
- When the user scrolls near the bottom of the page, load more movies
- Show a loading indicator while fetching
- Handle the "no more movies" state
- Handle errors gracefully
```

---

## Pain Points Checklist

As you work through this, note your experience:

| Question | Your Answer |
|----------|-------------|
| Did Claude ask about your tech stack? | Yes / No |
| Did Claude ask about styling approach? | Yes / No |
| Did it use the right patterns (App Router, etc.)? | Yes / No |
| How many lint errors after implementation? | _____ |
| How many times did you have to correct Claude? | _____ |
| Did it handle loading states well? | Yes / No |
| Did it handle edge cases? | Yes / No |
| **Time to complete** | _____ minutes |

**Keep this checklist!** You'll compare it with Section 9.

---

## What to Watch For

Notice these common issues (write them down!):

1. **Context questions**: Does Claude keep asking what framework you're using?
2. **Style mismatches**: Does it use CSS modules when you want Tailwind?
3. **Pattern inconsistencies**: Does it match your existing code patterns?
4. **Lint errors**: Run `bun lint` - how many errors?
5. **Manual corrections**: How often do you have to say "no, do it this way"?

---

## When You're Done

**Don't merge this work!** We want to keep `main` clean for Section 9.

```bash
# Create a branch to save your work
git checkout -b workshop/2-before
git add .
git commit -m "feat: add infinite scroll (before setup)"

# Go back to main
git checkout main
```

---

## Reflection

Take a moment to think:

- What was frustrating about this experience?
- What did Claude get wrong?
- What would have helped Claude do better?

The next sections will address these pain points.

---

[← Back to Setup](./1-setup.md) | [Back to Overview →](./index.md)
