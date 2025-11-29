@~/.claude/info.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Movie Watchlist App built as a hands-on project for Revity's agentic development workshop. It allows users to browse movies from TMDB, add them to a watchlist, and write reviews with ratings.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN (New York style)
- **Icons**: Lucide React
- **API**: TMDB (The Movie Database)
- **Data Storage**: JSON files in `/data` directory
- **Testing**: Vitest with AAA pattern (Arrange, Act, Assert)

## Development Commands

```bash
# Development
bun dev              # Start development server on localhost:3000
bun build            # Build production bundle

# Code Quality
bun lint             # Run ESLint
bun lint:fix         # Auto-fix ESLint issues
bun format           # Format code with Prettier
bun format:check     # Check formatting without making changes

# Testing
# Test files should be named *.test.ts or *.test.tsx
# Place test files next to the code they test
# Use descriptive test names and mock external dependencies
```

## Repository Structure

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API routes (Next.js backend)
│   │   ├── movies/        # TMDB movie fetching endpoints
│   │   ├── reviews/       # Review CRUD operations
│   │   └── watchlist/     # Watchlist CRUD operations
│   ├── globals.css        # Global styles and Tailwind directives
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page (main UI)
├── components/            # React components
│   ├── ui/               # ShadCN UI primitives (auto-generated)
│   ├── MovieCard.tsx     # Movie display card with actions
│   └── ReviewForm.tsx    # Review submission form
├── hooks/                 # Custom React hooks (API hooks go here)
├── lib/                   # Utility functions
│   └── utils.ts          # Tailwind class merging (cn helper)
├── types/                 # TypeScript type definitions
│   └── movie.ts          # Movie, MovieReview, WatchlistItem interfaces
├── data/                  # JSON file storage (gitignored)
│   ├── reviews.json      # User reviews
│   └── watchlist.json    # User watchlist items
├── docs/                  # Workshop documentation (GitHub Pages)
└── .flox/                 # Flox environment configuration
```

## Project Conventions

### Code Organization

- **Keep app/ files clean**: Do not pollute `app/` directory files with business logic. Extract complex logic to `components/` or `hooks/`.
- **API hooks in hooks/**: Always place API-related hooks in the `hooks/` directory for reusability and maintainability. This is a recommended React best practice.
- **Follow existing patterns**: Always follow the same patterns already established in the codebase. Do not introduce new patterns unless absolutely necessary.

### UI Components

- **ShadCN first**: Always use ShadCN UI components for all UI elements. They are already configured in `components/ui/`.
- **Loading states**: Use the `Skeleton` component from ShadCN for loading states. Do not create generic loading spinners.
- **Component style**: The project uses ShadCN's "New York" style variant as configured in `components.json`.

### TypeScript

- **Path aliases**: Use `@/` prefix for imports (configured in `tsconfig.json`):
  - `@/components` → `/components`
  - `@/hooks` → `/hooks`
  - `@/lib` → `/lib`
  - `@/types` → `/types`
- **Strict mode**: The project uses TypeScript strict mode. All code must be properly typed.

### Testing

- **Framework**: Vitest
- **Pattern**: Follow AAA pattern (Arrange, Act, Assert) for all unit tests
- **Naming**: Test files must be named `*.test.ts` or `*.test.tsx`
- **Location**: Place test files next to the code they test

For detailed testing conventions and best practices, see @./.claude/conventions/unit-test-rules.md

### Styling

- **Tailwind CSS**: Use Tailwind utility classes for styling
- **Class merging**: Use the `cn()` utility from `lib/utils.ts` to merge Tailwind classes
- **Dark mode**: The app supports dark mode using Tailwind's dark mode classes

## Architecture Patterns

### API Routes

All API routes follow Next.js 15 App Router conventions and are located in `app/api/`:

- **movies**: Proxies TMDB API requests (popular, top_rated, now_playing, upcoming categories)
- **reviews**: Manages movie reviews stored in `data/reviews.json`
- **watchlist**: Manages watchlist items stored in `data/watchlist.json`

API routes use file-based JSON storage with helper functions:
- `ensureDataDir()`: Creates data directory if it doesn't exist
- `get*()`: Reads and parses JSON data
- `save*()`: Writes JSON data with formatting

### Data Flow

1. Client components fetch data from Next.js API routes (`/api/*`)
2. API routes either proxy TMDB API or read/write local JSON files
3. State is managed in client components using React hooks
4. TMDB API responses are cached for 1 hour using `next: { revalidate: 3600 }`

### Component Patterns

- **Client Components**: Marked with `'use client'` directive (most components)
- **Props interfaces**: Defined inline above component definitions
- **State management**: Local React state (useState) for UI state
- **Error handling**: Try-catch blocks with console.error and user-friendly alerts

## Environment Variables

```bash
TMDB_API_KEY=your_api_key_here  # Required: Get from themoviedb.org/settings/api
```

Environment variables are loaded from `.env.local` (gitignored). Use `.env.example` as a template.

## Development Workflow

1. **Flox environment**: This project uses Flox for consistent development environments. Running `flox activate` automatically sets up Node.js, Bun, and dependencies.
2. **TMDB API key**: Required for movie data. Add to `.env.local` before running the app.
3. **Data persistence**: User data (reviews, watchlist) is stored in JSON files in the `data/` directory (gitignored).

## Workshop Context

This app is part of Revity's Claude Code workshop. The workshop focuses on:
- Understanding Claude Code's agentic capabilities
- Using Claude memory (CLAUDE.md)
- Creating custom slash commands
- Implementing hooks for workflow automation

Workshop documentation is available in the `docs/` directory and published at GitHub Pages.
