# Context Handoff Template

Use this template when forking a terminal with conversation context.

## Template

```
## Context from Previous Session

### What We Were Working On
[Brief description of the task/feature being worked on]

### Key Decisions Made
- [Decision 1]
- [Decision 2]
- [Decision 3]

### Work Completed
- [Completed item 1]
- [Completed item 2]

### Current State
[Description of where things stand - what files were modified, what's working, what's not]

### Relevant Files
- `path/to/file1.ts` - [what it does/what was changed]
- `path/to/file2.ts` - [what it does/what was changed]

---

## Your Task

[Specific task for the forked agent to complete]

## Expected Output

[What the forked agent should produce - file paths, behavior, etc.]
```

## Usage Instructions

1. Summarize the current conversation context using the template above
2. Include the summary at the start of the task for the forked agent
3. Be specific about files, decisions, and current state
4. Clearly define the task and expected output

## Example

```
## Context from Previous Session

### What We Were Working On
Adding dark mode support to the movie watchlist app

### Key Decisions Made
- Using Tailwind's dark mode with class strategy
- Storing preference in localStorage
- Adding toggle button to the header

### Work Completed
- Created ThemeContext in hooks/useTheme.ts
- Added dark mode CSS variables to globals.css

### Current State
Theme context is working but toggle button not yet implemented.
Need to add the button to the header component.

### Relevant Files
- `hooks/useTheme.ts` - Theme context provider
- `app/globals.css` - Dark mode CSS variables

---

## Your Task

Implement the dark mode toggle button in the header component.

## Expected Output

Modified `components/Header.tsx` with a working toggle button that switches between light and dark mode.
```
