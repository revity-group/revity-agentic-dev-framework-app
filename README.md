# Agentic Workflow Workshop

## Pre-Workshop Setup (Please Complete Before the Session)

To make the most of workshop time, **please complete this setup before the session**.

If you have questions at any point, ask a workshop facilitator. We can help during remote sessions or face-to-face.

## Workshop Flow

1. Baseline (setup + integrations)
   - Codex CLI
   - IDE integrations
   - "Surgical" context selection (what Codex sees vs ignores)
   - Demonstrate how Codex behaves without guidance
   - Highlight common failure modes and limitations
2. Slash commands
   - Faster session control for model, permissions, and context
   - Use `/init` to scaffold an `AGENTS.md` placeholder
3. AGENTS.md (project guidance)
   - Project structure, tech stack, conventions
   - How explicit guidance shapes Codex responses and behaviour
4. MCP (Model Context Protocol)
   - Expanding Codex capabilities via external tools/services
   - Practical examples
5. Skills
   - Packaging instructions, resources, and optional scripts
   - Sharing skills across teams and projects

## Workshop Checkpoints

Use section tags to jump to a specific workshop point:

1. `codex/01-baseline`
2. `codex/02-slash-commands`
3. `codex/03-agents-md`
4. `codex/04-mcp`
5. `codex/05-skills`

Checkout command:

```bash
git switch --detach codex/<tag-name>
```

If tags are missing locally:

```bash
git fetch --tags
```

### What You'll Need (Checklist)

- [ ] **Git** installed and working
- [ ] **Code editor** (VS Code, JetBrains, Coursor, Windsurf, Zed)
- [ ] **TMDB API Key** - [Get one here](https://www.themoviedb.org/settings/api) (free)
- [ ] **Codex CLI** installed (if using manual setup)
- [ ] **GitHub account**

### Setup Instructions

**Preferred option: Use Flox (recommended default).** It installs and wires the workshop dependencies automatically.
Why Flox is better than manual setup: one command, reproducible versions across participants, and fewer environment-specific issues during the workshop.

#### 1. Project Setup (Required)

```bash
# Clone the workshop repo (codex branch)
git clone --branch codex --single-branch https://github.com/revity-group/revity-agentic-dev-framework-app.git
cd revity-agentic-dev-framework-app

# Check out the initial workshop tag on the codex branch
git switch --detach codex/01-baseline
```

Already cloned the repo? Run:

```bash
git fetch origin
git checkout codex
git switch --detach codex/01-baseline
```

#### 2. Configuration (Choose One)

##### Option A: Flox Setup (Preferred)

**Best if:** You want the fastest setup with the least manual steps.

Install Flox: [flox.dev/docs/install-flox/install](https://flox.dev/docs/install-flox/install/)

```bash
# Install and activate project dependencies from Flox manifest
flox activate
```

Flox config for this project installs `git`, `bun`, `gh`, `ripgrep`, and `codex`, and runs `bun install` on activation.

Note: Flox prioritizes reproducible environments over newest package versions, so tools may be a few releases behind upstream. If a workshop feature is missing (for example, newer skills behavior in Codex CLI), verify with `codex --version` and use the latest manual install if needed.

**Windows users:** Install [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) first, then run Flox in your WSL2 terminal.

##### Option B: Manual Setup (Alternative)

Use this only if you prefer not to use Flox.

- Git: [git-scm.com/downloads](https://git-scm.com/downloads)
- Bun: [bun.sh/docs/installation](https://bun.sh/docs/installation)
- Codex CLI: [OpenAI Codex CLI docs](https://platform.openai.com/docs/codex/cli)
- GitHub CLI (optional): [cli.github.com/manual/installation](https://cli.github.com/manual/installation)
- ripgrep (optional): [github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep)

```bash
# Install project dependencies manually
bun install
```

#### 3. Run the App (Required)

```bash
# Set up your TMDB API key
cp .env.example .env.local
# Open .env.local and add your TMDB_API_KEY

# (Optional) Open Codex
codex

# Start the app
bun dev
```

---

### Verify Your Setup

Open [http://localhost:3000](http://localhost:3000) - you should see the Movie Watchlist app.

**If something doesn't work:**
- Make sure you added your TMDB_API_KEY to `.env.local`
- Try `bun install` again
- Check that port 3000 isn't already in use
- Ask a workshop facilitator in session chat or in person to get unblocked.

### Full Workshop Guide

Local workshop docs and navigation: [docs/index.md](./docs/index.md)

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
