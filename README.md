# Claude Code Agentic Workflow Workshop

A hands-on workshop for mastering Claude Code's agentic capabilities.

## Workshop Guide

**Full workshop instructions:** [revity-group.github.io/revity-agentic-dev-framework-app](https://revity-group.github.io/revity-agentic-dev-framework-app/)

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/revity-group/revity-agentic-dev-framework-app.git
cd revity-agentic-dev-framework-app

# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Add your TMDB_API_KEY to .env.local

# Run the app
bun dev
```

Get your TMDB API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

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
