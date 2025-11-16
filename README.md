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

## Backlog (Agentic Development Tasks)

These features are planned for implementation using agentic development:

### High Priority
- [ ] **Infinite Scroll / Pagination** - Load more movies when scrolling
- [ ] **Search Functionality** - Search movies by title
- [ ] **Movie Details Page** - Full movie info with cast and trailers

### Medium Priority
- [ ] **User Authentication** - NextAuth.js integration
- [ ] **Database Migration** - Move from JSON to PostgreSQL/Prisma
- [ ] **Filter & Sort** - Filter by genre, sort by rating/date
- [ ] **TanStack Query Integration** - Better data fetching and caching

### Nice to Have
- [ ] **Recommendations** - AI-powered movie suggestions
- [ ] **Social Features** - Share watchlists
- [ ] **Analytics Dashboard** - Visualize watching habits
- [ ] **Testing** - Unit and integration tests
- [ ] **Deployment** - Vercel deployment with CI/CD

---

Built for Revity's agentic development workshop.
