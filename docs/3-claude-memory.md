---
layout: default
title: 3. CLAUDE.md
nav_order: 5
---

# Section 3: CLAUDE.md

Give Claude persistent memory about your project and high level standards.

---

## What is CLAUDE.md?

Markdown files Claude loads at startup. They give Claude memory about your project's conventions, architecture, and patterns



Files merge hierarchically from enterprise → user (~/.claude/CLAUDE.md) → project (./CLAUDE.md). When you reference @components/Button.tsx, Claude also reads CLAUDE.md from that directory and its parents.

---

## Example structure for a Next.js app:

```
📁 revity-workshop-app
├── 📄 CLAUDE.md              # Project-wide conventions, tech stack, build commands
│
├── 📁 app
│   ├── 📄 CLAUDE.md          # Routing patterns, page structure, data fetching
│   ├── 📄 page.tsx
│   ├── 📄 layout.tsx
│   └── 📁 api
│       └── 📄 CLAUDE.md      # API conventions, error handling, response formats
│
├── 📁 components
│   ├── 📄 CLAUDE.md          # Component patterns, naming conventions, prop types
│   ├── 📄 MovieCard.tsx
│   └── 📁 ui
│       └── 📄 button.tsx
│
└── 📁 hooks
    ├── 📄 CLAUDE.md          # Hook patterns, naming conventions, return types
    └── 📄 useInfiniteScroll.ts
```

---

## Create Your CLAUDE.md

For this workshop, we'll create a single root-level `CLAUDE.md` to demonstrate the concept.

### The Task

in claude code session. Type slash command `/init` and then type the following:

```text
Create a summary of Project-wide conventions, tech stack, build commands. Make sure to include that we want to follow the same pattern and not introduce new patterns if not necessary. Also we use ShadCN for UI components. Make sure to always use ShadCN first and for loading states use the Skeleton component from ShadCN and not generic loading spinners. Also do not pollute app/ files with business logic, extract it to components/ or hooks/ if needed. You should always put API hooks in hooks/ directory because this allows reusability and maintainability and is a good practice recommended by react.

For testing, we use Vitest and follow the AAA pattern (Arrange, Act, Assert) for all unit tests. Test files should be named *.test.ts or *.test.tsx and placed next to the code they test. Always use descriptive test names and mock external dependencies.

Also make sure you add a full up to date repository structure to the CLAUDE.md file for full visibility of the project and each high level directory purpose, and keep the visualization to high level, no need to add each single file.
```

**Note:** As your codebase evolves, you can use `#to memorize` to incrementally add new standards to CLAUDE.md. However, these additions should be reviewed and cleaned up to maintain clarity and consistency.

---

Now let's use the same prompt we used before and try again

```text
Add infinite scrolling to the movie list.

Requirements:
- When the user scrolls near the bottom of the page, load more movies
- Show a loading indicator while fetching
- Handle the "no more movies" state
- Handle errors gracefully
- Then create a new Branch and commit the changes.
```

---

## Observe

- [ ] Claude code Should now ideally only read what is necessary for the implementation and not the whole project because it already has the reference from its memory.
- [ ] It should also be able to use the conventions we have defined and it should be able to pick up on putting reusable hooks into the preferred structure.
- [ ] It should have now known that for loading components, it should be using the modern skeleton UI rather than the traditional spinner UI.

---

## Testing with CLAUDE.md Memory

Now let's test if Claude uses the testing standards from CLAUDE.md:

```text
Add unit tests for the useMovies hook
```

### What Claude Should Do

With CLAUDE.md memory, Claude should:

1. **Install and configure Vitest** (if not already set up)
   - Add vitest dependencies
   - Create vitest config
   - Update package.json scripts

2. **Create test file** at `hooks/useMovies.test.ts` (next to the code)

3. **Follow AAA pattern** in the test structure:
   ```typescript
   describe('useMovies', () => {
     it('should fetch movies on mount', () => {
       // Arrange: Set up mocks and test data

       // Act: Execute the hook

       // Assert: Verify expected behavior
     })
   })
   ```

4. **Mock external dependencies** (fetch API, intersection observer)

5. **Use descriptive test names** that explain the behavior

### Observe

- [ ] Claude installs vitest and wires up configuration automatically
- [ ] Test file is created as `hooks/useMovies.test.ts` (correct naming)
- [ ] Test file is placed next to the code it tests
- [ ] Tests follow the AAA pattern with clear comments
- [ ] External dependencies (fetch, IntersectionObserver) are mocked
- [ ] Test names are descriptive and explain expected behavior

This demonstrates how CLAUDE.md guides Claude to make the right architectural decisions without being explicitly told each time.

---

## Catch Up

```bash
git checkout workshop/section-3-claude-md
```

---

[← Back to Baseline](./2-baseline.md) | [Next: Slash Commands →](./4-commands.md)
