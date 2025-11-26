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
| 0 | [Introduction](./0-intro.md) | LLMs, Agents, MCP, Agents in SDLC |
| 1 | [Setup & Shortcuts](./1-setup.md) | Install Claude Code, essential shortcuts |
| 2 | [Baseline Task](./2-baseline.md) | Implement infinite scroll (no setup) |
| 3 | [CLAUDE.md](./3-claude-memory.md) | Project memory and conventions |
| 4 | [Slash Commands](./4-commands.md) | Pre-loaded workflows for common tasks |
| 5 | [Hooks](./5-hooks.md) | Notifications & frictionless permissions |
| 6 | MCP Servers | *Coming soon* |
| 7 | Skills | *Coming soon* |
| 8 | Subagents  & Worktrees| *Coming soon* |
| 9 | SDD | *Coming soon* |

---

## Prerequisites

- Git installed
- [Flox](https://flox.dev) installed
- VS Code (recommended)

That's it! Flox handles everything else (Node.js, Bun, Claude Code, dependencies).

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/revity-workshop-app.git
cd revity-workshop-app

# Activate Flox environment (installs EVERYTHING automatically)
flox activate

# Set up environment
cp .env.example .env.local
# Add your TMDB_API_KEY to .env.local by opening the TMDB web page and creating an API key

# Run the app (or it may start automatically!)
bun dev
```

### What Flox Installs Automatically

Running `flox activate` installs and configures:
- **Node.js** - JavaScript runtime
- **Bun** - Package manager and runtime
- **Claude Code** - AI coding assistant
- **npm packages** - Runs `bun install` via activation hook

Zero manual setup! Your entire team gets identical environments.

---

## Resources

TBD
