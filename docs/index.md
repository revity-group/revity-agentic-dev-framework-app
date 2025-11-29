---
layout: home
title: Home
nav_order: 1
---

# Revity Agentic Development Workshop

Welcome to the hands-on workshop for Agentic Development Setup with Claude Code.

---

## Workshop Overview

In this workshop, you'll transform Claude Code from a simple AI assistant into a powerful, automated development partner. You'll learn by doing.

---

## Sections

| # | Section | What You'll Learn |
|---|---------|-------------------|
| 0 | [Introduction](./0-intro.md) | LLMs, Agents, MCP, and AI in SDLC |
| 1 | [Setup & Shortcuts](./1-setup.md) | Environment setup, IDE integration & surgical selection |
| 2 | [Baseline Task](./2-baseline.md) | Observe Claude's behavior without guidance |
| 3 | [CLAUDE.md](./3-claude-memory.md) | Project memory and conventions |
| 4 | [Slash Commands](./4-commands.md) | Reusable workflows and team standards |
| 5 | [Hooks](./5-hooks.md) | Automate quality checks and validation |
| 6 | [MCP Servers](./6-mcp.md) | Connect to external tools and services |
| 7 | [SDD](./7-sdd.md) | Spec-Driven Development workflow |
| 8 | Skills | Custom skills and capabilities *(Coming soon)* |
| 9 | Subagents & parallel agents | Advanced agent orchestration *(Coming soon)* |
| 10 | Plugins | Package & share configs across projects *(Coming soon)* |

---

## Quick Start

### What You'll Need (Checklist)

- [ ] **Git** installed and working
- [ ] **Code editor** (VS Code or Cursor recommended)
- [ ] **TMDB API Key** - [Get one here](https://www.themoviedb.org/settings/api) (free)
- [ ] **Claude Code** installed (we'll share account details soon)
- [ ] **GitHub account**

### Setup Instructions

**Choose your path based on your current setup:**

#### Option 1: Using Flox (Recommended - Zero Config)

**Best if:** You want everything installed automatically, or you're missing any of the tools above.

**What Flox does:** Installs Node.js, Bun, Claude Code, GitHub CLI, and all dependencies automatically irrespective of yor environment.

```bash
# 1. Install Flox if you don't have it: https://flox.dev/docs/install-flox/install/

# 2. Clone the workshop repo
git clone https://github.com/revity-group/revity-agentic-dev-framework-app.git
cd revity-agentic-dev-framework-app

# 3. Activate environment (installs everything)
flox activate

# 4. Open Claude Code
claude

# 5. Set up your TMDB API key
cp .env.example .env.local
# Open .env.local and add your TMDB_API_KEY

# 6. Start the app
bun dev
```

**Windows users:** Install [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) first, then follow these steps in your WSL2 terminal. Or skip to Option 2 for manual setup without WSL2.

---

#### Option 2: Manual Setup (I Have the Tools)

**Best if:** You already have Node.js, Bun,Github CLI and Claude Code installed.

**Missing tools?** Install with: `brew install node bun` and `brew install --cask claude-code`

```bash
# 1. Clone the repo
git clone https://github.com/revity-group/revity-agentic-dev-framework-app.git
cd revity-agentic-dev-framework-app

# 2. Install dependencies
bun install

# 3. Set up your TMDB API key
cp .env.example .env.local
# Open .env.local and add your TMDB_API_KEY

# 4. Start the app
bun dev
```

---

### Verify Your Setup

Open [http://localhost:3000](http://localhost:3000) - you should see the Movie Watchlist app.

**If something doesn't work:**
- Make sure you added your TMDB_API_KEY to `.env.local`
- Try `bun install` again
- Check that port 3000 isn't already in use
- Drop a message in `#tmp-agentic-dev-workshop1` on Slack - we're here to help!

---

## Resources

TBD
