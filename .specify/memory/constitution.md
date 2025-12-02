<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Modified Principles: N/A (Initial creation)
Added Sections:
  - Core Principles (5 principles)
  - Development Workflow
  - Quality Standards
  - Governance
Templates Status:
  ✅ plan-template.md - Reviewed (Constitution Check section compatible)
  ✅ spec-template.md - Reviewed (Requirements align with principles)
  ✅ tasks-template.md - Reviewed (Test-last approach compatible)
Follow-up TODOs: None
-->

# Movie Watchlist Workshop App Constitution

## Core Principles

### I. Component-First Architecture

Every feature must be built using modular, reusable React components. Components must be self-contained with clear props interfaces and single responsibilities. Shared components live in `/components`, feature-specific components co-locate with their features in `/app`. No monolithic page components.

**Rationale**: Maintains code reusability, testability, and allows independent development of UI elements. Workshop participants can easily understand and extend individual components.

### II. Type Safety

TypeScript MUST be used for all code. No `any` types except when interfacing with untyped third-party libraries (must be documented). All API responses, props, and state must have explicit type definitions in `/types`. Enable strict mode.

**Rationale**: Catches errors at compile time, provides self-documenting code, and improves developer experience with autocomplete. Essential for teaching best practices in workshop context.

### III. API-First Design

All external data fetching must go through dedicated API route handlers in `/app/api`. No direct external API calls from client components. API routes must handle errors gracefully and return consistent response formats.

**Rationale**: Centralizes error handling, enables middleware injection, protects API keys, and provides a clear contract between frontend and backend layers.

### IV. Progressive Enhancement

Features should work with JavaScript disabled where possible. Use Next.js Server Components as default. Client components (`'use client'`) only when interactivity is required (forms, dialogs, real-time updates). Minimize client-side JavaScript bundle.

**Rationale**: Improves performance, SEO, and accessibility. Demonstrates modern Next.js App Router patterns essential for workshop learning outcomes.

### V. Testing-Last with Unit Focus

Testing is performed AFTER implementation is complete and working. Focus exclusively on unit tests for business logic, utilities, and pure functions. Tests live in `__tests__` directories co-located with source. Use Vitest or Jest. NO integration tests, NO end-to-end tests, NO TDD.

**Rationale**: Aligns with workshop time constraints and learning objectives. Unit tests provide maximum value for critical logic without the overhead of integration/e2e test infrastructure.

## Development Workflow

### Code Organization

- Server Components: Default for all pages and layouts
- Client Components: Mark with `'use client'` directive, use sparingly
- Shared utilities: `/lib` directory
- Type definitions: `/types` directory
- Styling: Tailwind CSS utility classes, component-scoped when needed

### Dependency Management

- Use Bun for package management (`bun install`, `bun add`)
- Lock dependencies in `bun.lock`
- Keep dependencies minimal - justify each addition
- Prefer built-in Next.js features over third-party libraries

### Environment Configuration

- API keys and secrets in `.env.local` (never committed)
- Provide `.env.example` with placeholder values
- Document all required environment variables in README
- Fail fast with clear errors if environment variables missing

## Quality Standards

### Code Style

- ESLint MUST pass (`bun lint`) before any commit
- Prettier MUST be run (`bun format`) before any commit
- No console.log in production code (use proper logging if needed)
- Meaningful variable and function names (no abbreviations except standard ones: `id`, `url`, `api`)

### Performance

- Images MUST use Next.js `<Image>` component with proper sizing
- API responses MUST be cached when data is static/slow-changing
- Loading states MUST be provided for async operations
- Error boundaries MUST catch and display errors gracefully

### Accessibility

- Semantic HTML elements MUST be used
- All interactive elements MUST be keyboard accessible
- Images MUST have alt text
- Color contrast MUST meet WCAG AA standards

### Documentation

- README MUST contain setup instructions and feature overview
- Complex functions MUST have JSDoc comments explaining purpose and parameters
- API routes MUST document expected request/response formats
- NO over-documentation of self-evident code

## Governance

### Amendment Process

Constitution changes require:

1. Proposed change with rationale documented
2. Review for impact on existing templates and workflows
3. Version bump following semantic versioning (MAJOR.MINOR.PATCH)
4. Update to all dependent template files

### Compliance

- All pull requests MUST reference constitution principles if deviating
- Complexity MUST be justified in plan.md Complexity Tracking table
- Templates MUST align with constitution principles
- Workshop facilitators are responsible for constitution enforcement

### Versioning Policy

- MAJOR: Breaking changes to core principles (e.g., switching from Type Safety to vanilla JS)
- MINOR: New principles added or existing principles significantly expanded
- PATCH: Clarifications, wording improvements, formatting fixes

**Version**: 1.0.0 | **Ratified**: 2025-12-02 | **Last Amended**: 2025-12-02
