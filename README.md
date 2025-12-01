# Claude Code Agentic Workflow Workshop

## Pre-Workshop Setup (Please Complete Before Tomorrow!)

Hey everyone! We're excited to have you join the workshop. To make the most of our time together, **please complete this setup today** so we can dive straight into the fun stuff tomorrow.

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

**What Flox does:** Installs Node.js, Bun, Claude Code, GitHub CLI, and all dependencies automatically.

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

**Best if:** You already have Node.js, Bun, and Claude Code installed.

**Missing tools?** Install with:
- Node.js: `brew install node`
- Bun: `brew tap oven-sh/bun && brew install bun`
- Claude Code: `brew install --cask claude-code`

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

### Full Workshop Guide

Complete setup instructions and troubleshooting: [revity-group.github.io/revity-agentic-dev-framework-app](https://revity-group.github.io/revity-agentic-dev-framework-app/)

---

## About This Project

This is a **Movie Watchlist App** used as a hands-on project for the workshop. Features:

- Browse movies (Popular, Top Rated, Now Playing, Upcoming)
- Add movies to watchlist
- Write movie reviews with ratings

### Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- TMDB API
- Bun

---

## Development Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun lint` | Run ESLint |
| `bun lint:fix` | Auto-fix ESLint issues |
| `bun format` | Format code with Prettier |
| `bun build` | Build for production |

---

Built for Revity's agentic development workshop.
