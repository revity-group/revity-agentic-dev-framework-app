# Repository Guidelines

Concise playbook for agents working in this repo. Keep edits small, typed, and aligned with existing patterns.

## Project Snapshot
- Next.js 15 (App Router) with TypeScript strict mode and Bun runtime.
- Styling via Tailwind CSS; UI primitives from ShadCN (New York theme); icons from Lucide.
- Data lives in JSON under `data/` (gitignored) accessed by API routes in `app/api/*`.
- Path aliases use `@/` (see `tsconfig.json`) to import from `components`, `hooks`, `lib`, and `types`.

## Structure
- `app/`: routes, layouts, and API handlers (`app/api/movies`, `reviews`, `watchlist`).
- `components/`: shared UI; prefer ShadCN components under `components/ui/`.
- `hooks/`: reusable client hooks, especially API/data hooks.
- `lib/utils.ts`: `cn()` Tailwind class helper.
- `types/`: shared interfaces (e.g., movie, review, watchlist).
- `docs/`: workshop material; keep updated when workflows change.

## Build, Test, and Dev Commands
- `bun dev` – run locally at `localhost:3000`.
- `bun build` / `bun start` – production bundle and serve.
- `bun lint` / `bun lint:fix` – ESLint checks and autofix.
- `bun format` / `bun format:check` – Prettier with Tailwind plugin.
- `bun test`, `bun test:run` – Vitest unit tests; `bun test:e2e` for Playwright.

## Coding Style & Naming
- TypeScript with explicit types; avoid `any`.
- Use Tailwind utilities; merge classes with `cn()`.
- Components/hooks in `PascalCase`; files in `kebab-case` or `PascalCase` matching exports.
- Prefer ShadCN primitives over custom elements; use `Skeleton` for loading.
- Keep business logic out of `app/` pages; extract to `components/` or `hooks/`.

## Testing Guidelines
- Framework: Vitest (+ Testing Library for React).
- Tests live beside source as `*.test.ts` or `*.test.tsx`; follow Arrange–Act–Assert.
- Mock external APIs; avoid hitting TMDB in tests.
- Run `bun test` or `bun test:run` before pushing; e2e via `bun test:e2e` when flows change.

## Commit & PR Guidelines
- Use conventional commits (`type(scope): subject`, imperative, <50 chars). No AI mentions.
- Keep PRs scoped; include summary, screenshots for UI changes, and links to issues.
- Ensure lint/format/tests pass; note data/schema changes and environment requirements (`TMDB_API_KEY` in `.env.local`).

## Agent Tips
- Respect gitignored `data/`; avoid committing generated JSON.
- If adding conventions, mirror tone and structure from `CLAUDE.md`.
