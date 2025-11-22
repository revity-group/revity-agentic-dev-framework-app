---
layout: default
title: 3. CLAUDE.md
nav_order: 4
---

# Section 3: CLAUDE.md

Give Claude persistent memory about your project.

---

## What is CLAUDE.md?

A markdown file that Claude reads automatically at the start of every conversation. It contains project context, conventions, and instructions that you don't want to repeat.

**Locations:**
- `./CLAUDE.md` - Project-level (checked into repo)
- `~/.claude/CLAUDE.md` - User-level (personal preferences)

---

## Create Your CLAUDE.md

Create a file called `CLAUDE.md` in your project root:

```text
# Movie Watchlist App

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- TMDB API
- Bun

## Project Structure
- `src/app/` - Next.js app router pages
- `src/components/` - React components
- `src/lib/` - Utilities and API clients
- `src/types/` - TypeScript types

## Conventions
- Use functional components with hooks
- Prefer named exports
- Use Tailwind for styling (no CSS modules)
- API calls go through `src/lib/tmdb.ts`

## Commands
- `bun dev` - Start development server
- `bun lint` - Run ESLint
- `bun build` - Build for production
```

---

## Try It

1. Create the `CLAUDE.md` file with the content above
2. Start a new Claude Code session
3. Ask: "What tech stack does this project use?"

Claude should answer from memory without exploring the codebase.

---

[← Back to Baseline](./2-baseline.md) | [Next: Slash Commands →](./4-commands.md)
