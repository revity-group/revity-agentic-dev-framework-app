# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
bun dev          # Start development server
bun build        # Build for production
bun lint         # Run ESLint
bun lint:fix     # Auto-fix ESLint issues
bun format       # Format code with Prettier
bun format:check # Check formatting without changes
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN (new-york style)
- **Package Manager**: Bun
- **External API**: TMDB (The Movie Database)

## Architecture & Conventions

### Project Structure

```
app/              # Next.js App Router pages and API routes
├── api/          # API route handlers (movies, reviews, watchlist)
├── layout.tsx    # Root layout
├── page.tsx      # Home page (keep slim, delegate to components)
└── globals.css   # Global styles and Tailwind directives

components/       # React components
├── ui/           # ShadCN UI primitives (button, card, skeleton, etc.)
└── *.tsx         # Feature components (MovieCard, ReviewForm, etc.)

hooks/            # Custom React hooks (place API hooks here)
lib/              # Utility functions (cn() for class merging)
types/            # TypeScript type definitions
data/             # Local JSON data storage (reviews, watchlist)
```

### Key Patterns

1. **Follow existing patterns** - Do not introduce new patterns unless absolutely necessary. Match the style and structure of existing code.

2. **ShadCN for UI** - Always use ShadCN components first. Add new components via `bunx shadcn@latest add <component>`.

3. **Loading states** - Use the `Skeleton` component from ShadCN (`@/components/ui/skeleton`) for loading states. Do not use generic loading spinners.

4. **Keep app/ files slim** - Do not put business logic in `app/` page files. Extract logic to:
   - `components/` for UI components
   - `hooks/` for custom hooks and data fetching

5. **API hooks location** - All API-related hooks must go in `hooks/` directory.

6. **Path aliases** - Use `@/` prefix for imports (configured in tsconfig.json):
   - `@/components` → components/
   - `@/components/ui` → components/ui/
   - `@/lib` → lib/
   - `@/hooks` → hooks/
   - `@/types` → types/

### API Routes

API routes are in `app/api/` and follow Next.js App Router conventions:
- `app/api/movies/route.ts` - Fetch movies from TMDB
- `app/api/movies/search/route.ts` - Search movies
- `app/api/reviews/route.ts` - Movie reviews CRUD
- `app/api/watchlist/route.ts` - Watchlist management

### Environment Variables

Required in `.env.local`:
```
TMDB_API_KEY=your_api_key_here
```
