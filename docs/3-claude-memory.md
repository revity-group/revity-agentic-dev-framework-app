---
layout: default
title: 3. Claude Memory
nav_order: 5
---

# Section 3: CLAUDE.md

Give Claude persistent memory about your project and high level standards.

---

## What is CLAUDE.md?

Markdown files Claude loads at startup. They give Claude memory about your project's conventions, architecture, and patterns



Files are loaded hierarchically with enterprise taking highest precedence, followed by user `~/.claude/CLAUDE.md`, then project `./CLAUDE.md` or `./.claude/CLAUDE.md`.

**How it works:** When working in a directory, Claude reads CLAUDE.md files from that directory up to the project root. Nested CLAUDE.md files in other directories are only loaded when Claude reads files from those specific areas, keeping context efficient.

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

Check if Claude:

- [ ] Uses information from CLAUDE.md to make better decisions
- [ ] Follows the documented conventions (e.g., hooks in `hooks/` directory)
- [ ] Uses ShadCN Skeleton components for loading states (as specified in CLAUDE.md)

This demonstrates how CLAUDE.md gives you some control over Claude's architectural decisions by providing persistent memory about your project's conventions.

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

Check if Claude:

- [ ] Follows the testing conventions from CLAUDE.md
- [ ] Places test files according to the documented pattern
- [ ] Uses the AAA pattern (Arrange, Act, Assert)
- [ ] Mocks external dependencies appropriately

**Key Insight**: CLAUDE.md gives you some control over Claude's behavior by providing persistent memory about your standards and conventions. While you can't guarantee exact outputs, you can significantly influence the architectural decisions Claude makes without having to repeat yourself every time.

---

## File Referencing in CLAUDE.md

**Before continuing:** If you created tests for useMovies in the previous section, discard them now. We'll recreate them after setting up file referencing to demonstrate the difference.

As your conventions grow, CLAUDE.md can become large and hard to maintain. You can modularize it by extracting detailed conventions into separate files and referencing them.

### Why Use File References?

- **Modularity**: Keep CLAUDE.md concise, with detailed rules in focused files
- **Maintainability**: Update specific conventions without editing the main file
- **Organization**: Group related conventions (testing, API patterns, UI rules, etc.)

Let's expand our testing conventions and extract them to a separate file.

### Step 1: Create Detailed Testing Conventions

Create a new file at `.claude/conventions/unit-test-rules.md`:

```markdown
# Unit Test Rules

## Test Naming Convention

Use the pattern: `"should [action] when [condition]"`

**Good:**
- `"should fetch movies successfully when API returns valid data"`
- `"should handle error when API request fails"`

**Avoid:**
- `"test fetch"` (not descriptive)
- `"it works"` (unclear what is being tested)

## Mock Data Organization

- Prefix all mock data with `mock` (e.g., `mockMovies`, `mockResponse`)
- Define mock data at the top of the describe block for reusability
- Keep mock data realistic and representative of actual API responses

## Test Structure

- **Always use `beforeEach`** for test cleanup and mock resets
- **Group related tests** with nested `describe` blocks
- **One focus per test**: Each test should verify one specific behavior

## Assertions

- Use `toEqual()` for objects and arrays (deep equality)
- Use `toBe()` for primitives and referential equality
- Use `toHaveLength()` for array length checks
- Prefer specific matchers over generic ones

## Async Testing

- Always use `async/await` with `waitFor` for async operations
- Never use arbitrary timeouts - let `waitFor` handle timing
- Test both loading and loaded states explicitly
```

#### Step 2: Update CLAUDE.md to Reference the File

Update the `### Testing` section in your `CLAUDE.md`:

**Before:**
```markdown
### Testing
# your testing section in CLAUDE.md
```

**After:**
```markdown
### Testing

- **Framework**: Vitest
- **Pattern**: Follow AAA pattern (Arrange, Act, Assert) for all unit tests
- **Naming**: Test files must be named `*.test.ts` or `*.test.tsx`
- **Location**: Place test files next to the code they test

For detailed testing conventions and best practices, see @./.claude/conventions/unit-test-rules.md
```

#### Step 3: Retry the Same Prompt

Now that we've set up file referencing, let's use the **exact same prompt** from earlier to see how Claude's behavior improves:

```text
Add unit tests for the useMovies hook
```

This demonstrates how the same prompt produces better results when Claude has access to detailed conventions via file referencing.

### What Claude Should Do

With the file-referenced conventions, Claude should now create a **much more comprehensive test file** at `hooks/useMovies.test.ts` that:

1. **Includes the file header comment** (as specified in the referenced conventions)
2. **Organizes tests into nested describe blocks**:
   - Initialization tests
   - Success cases
   - Error handling
   - Edge cases
3. **Follows the referenced conventions**:
   - Test names: "should [action] when [condition]"
   - Mock data with `mock` prefix at the top of describe blocks
   - Use `beforeEach` for cleanup
   - Use appropriate matchers (`toEqual`, `toBe`, `toHaveLength`)
   - Use `async/await` with `waitFor`

### Observe

Check if Claude:

- [ ] Reads and applies conventions from `.claude/conventions/unit-test-rules.md`
- [ ] Adds the file header comment at the top of the test file
- [ ] Organizes tests using nested `describe` blocks (Initialization, Success cases, Error handling, Edge cases)
- [ ] Uses the exact test naming pattern: "should [action] when [condition]"
- [ ] Organizes mock data with `mock` prefix at the top of describe blocks
- [ ] Uses `beforeEach` for test cleanup
- [ ] Chooses appropriate assertion matchers (`toEqual`, `toBe`, `toHaveLength`)

**Key Insight**: File referencing via @ imports provides several benefits:

1. **Modularity & Organization**: Break large CLAUDE.md into focused, topic-specific files (testing rules, API patterns, etc.)
2. **Maintainability**: Update specific conventions without editing the main file
3. **Team Flexibility**: Import files from user home directories (`@~/.claude/my-project-instructions.md`) for personal preferences not checked into the repo
4. **Recursive Imports**: Files can import other files (max depth 5), enabling nested organization

Note: Files imported via @ syntax are loaded at launch, giving Claude comprehensive access to all conventions. This is different from nested CLAUDE.md files in subtrees, which are only loaded when Claude reads files in those specific directories.

Here is an example of how you can influence Claude's behavior to be customised to your personal preferences:

- Add `@~/.claude/info.md` to your CLAUDE.md file and then create a new file called `info.md` in your personal .claude directory and add something personal to you. In my case I will tell claude about my cat and who are my favorite artists.
- Then open a new claude instance and try asking claude about you. It's kinda cool!.
---

## Catch Up

```bash
git checkout workshop/section-3-claude-md
```

---

[← Back to Baseline](./2-baseline.md) | [Next: Slash Commands →](./4-commands.md)
