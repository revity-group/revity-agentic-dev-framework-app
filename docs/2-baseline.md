---
layout: default
title: 2. Baseline Task
nav_order: 3
---

# Section 2: Baseline Task

Implement infinite scrolling to the movie list.

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
```

---

## While You Work, Notice

- [ ] Does Claude know your project structure?
- [ ] Does it follow your coding conventions?
- [ ] Does it know which API endpoints exist?
- [ ] Does it run linting/formatting after edits?
- [ ] Does it commit with your preferred message style?

---

## Discussion

- What context did you have to provide manually?
- What assumptions did Claude make about your project?
- How much cleanup was needed?

---

## Food for Thought

Things Claude could have known about your project:

**UI & Components**
- Use Shadcn UI components from `src/components/ui/`
- For loading states, use `<Skeleton />` not a custom spinner
- For cards, use `<Card>` with `<CardHeader>`, `<CardContent>`
- Prefer Shadcn over raw Tailwind HTML

**Project Structure**
- Custom hooks go in `src/hooks/`
- API utilities live in `src/lib/`
- Components use named exports

**Code Style**
- Functional components with hooks
- TypeScript strict mode
- Prettier formatting on save

**Git Workflow**
- Conventional commits (`feat:`, `fix:`, `docs:`)
- Run lint before committing
- Meaningful commit messages

**API Patterns**
- Use existing `tmdb.ts` client for API calls
- Handle pagination with TMDB's `page` parameter
- Error states show user-friendly messages

---

[← Back to Setup](./1-setup.md) | [Next →](./3-claude-md.md)
