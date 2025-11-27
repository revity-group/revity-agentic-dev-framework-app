---
layout: default
title: 2. Baseline Task
nav_order: 4
---

# Section 2: Baseline Task

Currently our application does not have pagination so we don't get all the movies loaded as we scroll. We need to add this functionality.

Use your barebone claude code setup to achieve this.

---

## The Task

Open Claude Code and give it this prompt:

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

## While You Work, Notice

- [ ] Does Claude know your project structure , or does it have to scan multiple files to understand the project?
- Bare in mind that everytime you start a new session, Claude will have to scan the entire codebase to understand the project.
- [ ] In this codebase we want to follow conventions and best practices as follows:
  - [ ] No raw HTML elements, only use shadcn components
  - [ ] Do not pollute app/ files with business logic, extract it to components/ or hooks/
  - [ ] Do not use raw spinners for component loading states, use modern Skeleton UI component
- [ ] Do we have to explicitly mention to Claude that we want to follow above conventions?

---

[← Back to Setup](./1-setup.md) | [Next: CLAUDE.md →](./3-claude-memory.md)
