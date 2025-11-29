# Unit Test Rules

## File Header

Every test file must include a comment header:

```typescript
/**
 * Unit tests for [component/hook name]
 * Following conventions from .claude/conventions/unit-test-rules.md
 */
```

## Test Organization

Organize tests in the following order within each describe block:

1. **Initialization tests** - Tests for initial state and setup
2. **Success cases** - Tests for expected successful behavior
3. **Error handling** - Tests for error conditions and failures
4. **Edge cases** - Tests for boundary conditions and special cases

Use nested `describe` blocks with these exact labels when applicable.

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
