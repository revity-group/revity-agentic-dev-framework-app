# Movie Watchlist App

A modern Next.js application for browsing movies, managing watchlists, and writing reviews. Built to demonstrate agentic development workflows at Revity.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- TMDB API
- Bun

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Get your TMDB API key at https://www.themoviedb.org/settings/api
4. Create `.env.local` and add your key:
   ```
   TMDB_API_KEY=your_api_key_here
   ```
5. Run the dev server:
   ```bash
   bun dev
   ```
6. Open http://localhost:3000

## Current Features

- ✅ Browse movies (Popular, Top Rated, Now Playing, Upcoming)
- ✅ Add movies to watchlist
- ✅ Write movie reviews with ratings
- ✅ File-based storage (JSON)
- ✅ Modern ESLint v9 + Prettier setup

## Development

- `bun dev` - Start development server
- `bun lint` - Run ESLint
- `bun lint:fix` - Auto-fix ESLint issues
- `bun format` - Format code with Prettier
- `bun build` - Build for production

---

Built for Revity's agentic development workshop.
