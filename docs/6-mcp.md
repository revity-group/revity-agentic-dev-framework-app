---
layout: default
title: 6. MCP Servers
nav_order: 8
---

# Section 6: MCP Servers

Extend Claude's capabilities by connecting to external tools and services through the Model Context Protocol.

---

## What is MCP?

MCP (Model Context Protocol) is an open standard that lets Claude connect to external data sources and tools. Think of MCP servers as plugins that give Claude new capabilities - access to browsers, databases, APIs, and specialized tools.

### Architecture Layers

MCP is built on three core layers:

| Layer | Purpose |
|-------|---------|
| **Protocol** | JSON-RPC 2.0 messages for standardized communication |
| **Transport** | How messages move (stdio for local, HTTP/SSE for remote) |
| **Features** | What servers expose: Tools, Resources, Prompts, Sampling |

For this workshop, we care most about the **Tools** feature - this is how Claude gains new abilities like controlling a browser.

📖 [Read more about MCP Architecture](https://modelcontextprotocol.io/docs/learn/architecture#layers)

---

## The Problem: Manual Testing Pain

In Section 3, we built infinite scrolling for the movie list. How do we know it actually works?

**Current workflow:**
1. Start the dev server
2. Open browser manually
3. Scroll down, watch for new movies loading
4. Check console for errors
5. Test edge cases (fast scroll, slow network, etc.)
6. Repeat after every change

**The gap with AI-assisted testing:**

You could ask Claude to write Playwright tests directly from code. It works, but Claude would be *guessing* behavior based on implementation - not observing what actually happens.

Questions Claude can't answer from code alone:
- Does the loading indicator actually appear?
- How long until new movies load?
- What happens on rapid scrolling?
- Are there console errors we missed?

**What if Claude could experience the app like a user?**

With Playwright MCP, Claude can:
1. **Run the app** and interact with it in a real browser
2. **Observe actual behavior** - scroll, wait, see what loads
3. **Identify edge cases** from real interaction
4. **Write tests grounded in reality**, not assumptions

It's the difference between reading a recipe and tasting the dish.

---

## Step 1: Install Playwright MCP

We'll use the official Playwright MCP server from Microsoft.

### Add to Claude Code Settings

Run the following command to add the Playwright MCP server:

```bash
claude mcp add playwright npx @playwright/mcp@latest --scope project
```

### Verify Installation

Restart Claude Code and check that Playwright tools are available:

```text
/mcp
```

You should see `playwright` listed with tools.

---

## Step 2: Explore the Infinite Scroll Feature

Let's have Claude experience the infinite scroll feature firsthand.

### Start Your Dev Server

Make sure your app is running:

```bash
bun dev
```

### The Task

Ask Claude to explore the infinite scroll feature:

```text
Use Playwright to test the infinite scroll feature on http://localhost:3000

1. Navigate to the app
2. Take a screenshot of the initial state
3. Scroll down to trigger loading more movies
4. Take another screenshot showing new movies loaded
5. Check the browser console for any errors
6. Tell me what you observed about how the feature works
7. Make sure we are using 
```

### Observe

Watch as Claude:

- [ ] Opens a browser and navigates to your app
- [ ] Takes screenshots you can see in the conversation
- [ ] Scrolls and waits for content to load
- [ ] Reports what actually happened vs. what code suggests should happen
- [ ] Identifies any issues or edge cases

**Key Insight**: Claude is now testing your app the same way a QA engineer would - by actually using it.

---

## Step 3: Discover Edge Cases

Now let's have Claude dig deeper and find potential issues.

### The Task

```text
Continue testing the infinite scroll. Try these scenarios:

1. Scroll rapidly multiple times - does it handle concurrent requests?
2. Scroll to the very end - what happens when there are no more movies?
3. Check network requests - are there any failed or duplicate API calls?
4. Look for any UI glitches during loading states

Report any issues or edge cases you find.
```

### Observe

- [ ] Claude tests scenarios you might not have thought of
- [ ] Claude identifies real issues from actual behavior
- [ ] Claude can see things in the browser you'd have to manually check

---

## Step 4: Write Tests Based on Observations

Now that Claude has experienced the feature, it can write tests grounded in reality.

### The Task

```text
Based on your testing of the infinite scroll feature, write Playwright e2e tests that cover:

1. Initial page load shows movies
2. Scrolling to bottom triggers loading more movies
3. Loading indicator appears while fetching
4. The edge cases you discovered during exploration

Create the tests in a new file: e2e/infinite-scroll.spec.ts
```

### What Claude Should Do

Because Claude actually used the feature, it should:

1. **Know real selectors** - From the accessibility snapshot, not guessing
2. **Use accurate wait times** - Based on observed load times
3. **Cover discovered edge cases** - Issues found during exploration
4. **Write realistic assertions** - Based on actual behavior

### Observe

Check if Claude:

- [ ] Creates tests that reflect what it actually observed
- [ ] Uses selectors it discovered from the accessibility tree
- [ ] Includes tests for edge cases it found
- [ ] Sets appropriate timeouts based on real performance

---

## Step 5: Run the Tests

Let's verify the tests Claude wrote actually pass.

### The Task

```text
Run the Playwright tests you just created and fix any failures.
```

### Observe

- [ ] Claude runs the tests
- [ ] If tests fail, Claude can debug using the same Playwright tools
- [ ] Claude iterates until tests pass

---

## Why This Matters

| Approach | What Claude Knows |
|----------|-------------------|
| **Tests from code** | What *should* happen based on implementation |
| **Tests from MCP exploration** | What *actually* happens in a real browser |

The MCP approach catches:
- Race conditions the code doesn't reveal
- UI glitches only visible in browser
- Performance issues under real conditions
- Edge cases discovered through interaction

---

## More MCP Ideas

| MCP Server | Use Case |
|------------|----------|
| **Context7** | Fetch up-to-date documentation for libraries |
| **GitHub** | Create issues, PRs, manage repos |
| **Figma** | Extract design specs and assets |
| **PostgreSQL** | Query and explore databases |

Browse more at [MCP Server Registry](https://github.com/modelcontextprotocol/servers)

---

## Catch Up

```bash
git checkout workshop/section-6-mcp
```

---

[← Back to Hooks](./5-hooks.md) | [Next: SDD →](./7-sdd.md)
