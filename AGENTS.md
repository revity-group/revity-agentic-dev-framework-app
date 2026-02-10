# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router entry. Routes live in `app/`, API handlers in `app/api/`, and global styles in `app/globals.css`.
- `components/`: Feature-level React components (e.g., `MovieCard.tsx`).
- `components/ui/`: Reusable UI primitives (shadcn-style).
- `lib/`: Shared utilities (see `lib/utils.ts`).
- `types/`: Shared TypeScript types (e.g., `types/movie.ts`).
- `docs/`: Workshop documentation and guides.
- Config lives at the repo root: `next.config.ts`, `tailwind.config.ts`, `eslint.config.js`, `prettier.config.js`, `postcss.config.mjs`, `components.json`.

## Build, Test, and Development Commands
Use Bun for package management (see `bun.lock`).
- `bun install`: Install dependencies.
- `bun dev`: Run the local dev server at `http://localhost:3000`.
- `bun build`: Create a production build.
- `bun start`: Serve the production build.
- `bun lint` / `bun lint:fix`: Run ESLint (with optional auto-fix).
- `bun format` / `bun format:check`: Format or verify formatting via Prettier.

## Coding Style & Naming Conventions
- TypeScript + React (Next.js App Router). Prefer `.tsx` for components.
- Formatting is enforced by Prettier: 2-space indentation, single quotes, no semicolons, trailing commas (ES5), 80 char line width.
- ESLint is configured for TS and React; unused args should be prefixed with `_`.
- Component files use PascalCase (e.g., `MovieCard.tsx`). Route segments in `app/` follow Next.js conventions (lowercase folders).
- Tailwind CSS is used for styling; class ordering is handled by `prettier-plugin-tailwindcss`.

## Testing Guidelines
- No automated test runner is configured and no test files exist currently.
- If you introduce tests, add a script to `package.json`, document how to run them here, and follow a clear naming scheme such as `*.test.tsx` or `__tests__/`.

## Commit & Pull Request Guidelines
- Recent commits use short, lowercase, present-tense summaries (e.g., `update docs`, `finalised setup`). Keep messages concise; no conventional prefix is required.
- PRs should include: a short summary, linked issue (if any), and screenshots for UI changes.
- Avoid committing secrets. Use `.env.local` for local config; see `.env.example` for required keys.

## Configuration & Secrets
- The app requires `TMDB_API_KEY`. Copy `.env.example` to `.env.local` and fill in the key.
- Do not commit `.env.local` or any API keys.
