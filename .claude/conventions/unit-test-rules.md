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

- **Always include top file header comment**:

  ```typescript
  /**
   * Unit tests for [component/hook name]
   * Following conventions from .claude/conventions/unit-test-rules.md
   */
  ```

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
