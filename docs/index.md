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
| 6 | [MCP Servers](./6-mcp.md) | Connect to external tools and services |
| 7 | Skills | *Coming soon* |
| 8 | Subagents & parallel agents| *Coming soon* |
| 9 | SDD | *Coming soon* |

---

## Prerequisites

### Option 1: Using Flox (Recommended)
- Git installed
- [Flox](https://flox.dev/docs/install-flox/install/) installed

Flox will automatically install:
- Node.js
- Bun
- Claude Code
- GitHub CLI (gh)

### Option 2: Standard Setup (Mac)

Install the required tools:

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install node bun gh

# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Authenticate Claude Code
claude auth login
```

Recommended: VS Code or Cursor

### Windows Users

**To use the Flox path:** Install [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) first (one-time setup).

After WSL2 is installed, open your WSL2 terminal and follow the Flox installation steps.

**Alternative:** Skip Flox and use the Manual Setup option below with PowerShell or Git Bash. You'll need to install Node.js, Bun, and Claude Code manually.

---

## Quick Start

### Pre-Workshop Checklist

Before the workshop, make sure you have:

- [ ] **Git** installed and configured
- [ ] **Code editor** ready (VS Code or Cursor recommended)
- [ ] **TMDB API Key** - [Get it here](https://www.themoviedb.org/settings/api) (free)
- [ ] **Claude Code account** - Sign up at [claude.ai/code](https://claude.ai/code) if you haven't already
- [ ] **GitHub account** - For pushing code and creating PRs 

Choose your setup path below based on your preference:

---

### Option 1: Using Flox (Recommended - Zero Config)

**Best for:** First-time setup, ensuring everything works consistently, or if you're missing any tools.

**What Flox installs for you:**
- ✅ Node.js (JavaScript runtime)
- ✅ Bun (package manager & test runner)
- ✅ Claude Code CLI
- ✅ GitHub CLI (gh)
- ✅ All project dependencies

**Setup steps:**

```bash
# 1. Install Flox (one-time, if you don't have it)
curl -fsSL https://install.flox.dev | bash

# 2. Clone the workshop repo
git clone https://github.com/revity-group/revity-agentic-dev-framework-app.git
cd revity-agentic-dev-framework-app

# 3. Activate Flox environment (installs everything automatically)
flox activate

# 4. Authenticate Claude Code (one-time setup)
claude auth login

# 5. Set up your TMDB API key
cp .env.example .env.local
# Open .env.local in your editor and paste your TMDB_API_KEY

# 6. Start the app
bun dev
```

**Verify it works:** Visit [http://localhost:3000](http://localhost:3000) - you should see the Movie Watchlist app.

---

### Option 2: Manual Setup (I Have the Tools)

**Best for:** You already have Node.js, Bun, and Claude Code installed and want to use your existing setup.

**Prerequisites you need:**
- Node.js 18+ or Bun
- Claude Code CLI (`claude --version` should work)
- GitHub CLI (optional but helpful for PR creation)

**Setup steps:**

```bash
# 1. Clone the workshop repo
git clone https://github.com/revity-group/revity-agentic-dev-framework-app.git
cd revity-agentic-dev-framework-app

# 2. Install project dependencies
bun install

# 3. Set up your TMDB API key
cp .env.example .env.local
# Open .env.local in your editor and paste your TMDB_API_KEY

# 4. Start the app
bun dev
```

**Verify it works:** Visit [http://localhost:3000](http://localhost:3000) - you should see the Movie Watchlist app.

**Missing tools?** See the [Prerequisites](#prerequisites) section for installation instructions.

---

### Troubleshooting

**App won't start or shows errors?**

Try these in order:
1. Make sure you added your TMDB_API_KEY to `.env.local`
2. Run `bun install` again
3. Check if something else is using port 3000 (close it or try a different port)

**Claude Code issues?**

- Run `claude auth login` and follow the prompts
- Check it's installed: `claude --version`

**Still not working?**

No worries! Drop a message in the workshop Slack or GitHub Issues. We're here to help and will do a setup check at the start of the workshop.

---

## Resources

TBD
