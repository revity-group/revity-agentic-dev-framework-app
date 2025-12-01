@~/.claude/info.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
bun dev          # Start development server (localhost:3000)
bun build        # Build for production
bun lint         # Run ESLint
bun lint:fix     # Auto-fix ESLint issues
bun format       # Format code with Prettier
bun format:check # Check formatting without fixing
```

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS** with CSS variables for theming
- **ShadCN UI** for components (Radix primitives)
- **Bun** as package manager and runtime
- **TMDB API** for movie data

## Architecture

### Directory Structure

```
app/                    # Next.js App Router pages and API routes
├── api/               # API route handlers (movies, watchlist, reviews)
├── page.tsx           # Main page (client component)
└── layout.tsx         # Root layout

components/            # React components
├── ui/               # ShadCN UI primitives (Button, Card, Dialog, etc.)
└── *.tsx             # Feature components (MovieCard, ReviewForm)

hooks/                 # Custom React hooks (API hooks go here)
lib/                   # Utility functions (cn() for classnames)
types/                 # TypeScript type definitions
docs/                  # Workshop documentation
```

### Code Organization Principles

1. **Keep `app/` files thin** - Extract business logic to `components/` or `hooks/`. Route files should only handle routing concerns.

2. **API hooks in `hooks/`** - All data fetching hooks must live in `hooks/` for reusability and maintainability.

3. **Follow existing patterns** - Do not introduce new architectural patterns. Match the conventions already in place.

4. **ShadCN first** - Always use ShadCN components from `components/ui/` before creating custom UI.

5. **Skeleton for loading** - Use the `Skeleton` component from ShadCN for loading states, not generic spinners.

### Testing

- **Framework**: Vitest
- **Pattern**: Follow AAA pattern (Arrange, Act, Assert) for all unit tests
- **Naming**: Test files must be named `*.test.ts` or `*.test.tsx`
- **Location**: Place test files next to the code they test

For detailed testing conventions and best practices, see @./.claude/conventions/unit-test-rules.md

## API Routes

All API routes use Next.js Route Handlers in `app/api/`:

- `GET /api/movies?category={popular|top_rated|now_playing|upcoming}` - Fetch movies from TMDB
- `GET /api/movies/search?query={string}` - Search movies
- `GET|POST /api/watchlist` - Manage watchlist (in-memory storage)
- `GET|POST /api/reviews` - Manage reviews (in-memory storage)

## Environment Variables

Required in `.env.local`:
```
TMDB_API_KEY=your_api_key_here
```
