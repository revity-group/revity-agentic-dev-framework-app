# Revity Workshop App - Gemini Context

## Project Overview

This is a **Movie Watchlist App** designed as a hands-on project for Revity's agentic development workshop. It enables users to browse movies via the TMDB API, manage a local watchlist, and write reviews.

The project demonstrates a modern Next.js architecture with agentic workflow integrations.

## Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Runtime/Package Manager:** Bun
*   **Language:** TypeScript (Strict Mode)
*   **Styling:** Tailwind CSS
*   **UI Library:** ShadCN UI (New York style)
*   **Icons:** Lucide React
*   **Testing:** Vitest (Unit), Playwright (E2E)
*   **External API:** TMDB (The Movie Database)
*   **Local Storage:** JSON files in `data/` (reviews and watchlist)

## Key Files & Structure

*   `app/` - Next.js App Router structure.
    *   `api/` - Backend API routes acting as proxies to TMDB and handlers for local JSON data.
    *   `page.tsx` - Main entry point/dashboard.
*   `components/` - React components.
    *   `ui/` - ShadCN UI primitives.
    *   `MovieCard.tsx`, `ReviewForm.tsx` - Feature-specific components.
*   `hooks/` - Custom React hooks. API-related logic should strictly reside here.
*   `types/` - TypeScript definitions (e.g., `movie.ts`).
*   `data/` - Git-ignored directory for persistence (`reviews.json`, `watchlist.json`).
*   `.claude/` - Workshop-specific agent configurations and rules.
*   `docs/` - Workshop documentation (Jekyll/GitHub Pages).

## Development Conventions

### Coding Style
*   **Imports:** Use `@/` path aliases (e.g., `@/components`, `@/lib`).
*   **UI:** exclusively use ShadCN components found in `components/ui/`. Use `Skeleton` for loading states.
*   **Logic:** Keep `app/` files clean. Move complex logic to `components/` or `hooks/`.
*   **Styles:** Use Tailwind utility classes. Merge classes using `cn()` from `lib/utils.ts`.

### Testing
*   **Framework:** Vitest.
*   **Pattern:** AAA (Arrange, Act, Assert).
*   **Naming:** `*.test.ts` or `*.test.tsx`.
*   **Location:** Co-located with the source file.

## Build & Run Commands

| Command | Description |
| :--- | :--- |
| `bun dev` | Starts the development server on `localhost:3000`. |
| `bun build` | Builds the application for production. |
| `bun lint` | Runs ESLint. |
| `bun lint:fix` | Fixes linting errors automatically. |
| `bun format` | Formats code using Prettier. |
| `bun test` | Runs unit tests with Vitest. |
| `bun run test:e2e` | Runs E2E tests with Playwright. |

## Environment Setup
*   **TMDB_API_KEY:** Required in `.env.local` (copy from `.env.example`).
*   **Flox:** Project uses Flox for environment management (`flox activate`).
