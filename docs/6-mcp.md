---
layout: default
title: 6. MCP Servers
nav_order: 8
---

# Section 6: MCP Servers

Extend Claude's capabilities by connecting to external tools and services through the Model Context Protocol.

---

## What is MCP?

MCP (Model Context Protocol) is an open standard that lets Claude connect to external data sources and tools. Think of MCP servers as **plugins** that give Claude new capabilities—access to browsers, databases, APIs, and specialized tools.

### Architecture Overview

MCP is built on three core layers:

| Layer | Purpose |
|-------|---------|
| **Protocol** | JSON-RPC 2.0 messages for standardized communication |
| **Transport** | How messages move (stdio for local, HTTP/SSE for remote) |
| **Features** | What servers expose: Tools, Resources, Prompts, Sampling |

For this workshop, we focus on the **Tools** feature—this is how Claude gains new abilities like controlling a browser.

[Read more about MCP Architecture](https://modelcontextprotocol.io/docs/concepts/architecture)

---

## The Problem: Claude Can't See Your App

You've been pairing with Claude all workshop. It reads your code, writes tests, suggests fixes. But there's a gap.

**Ask Claude to verify the watchlist feature works correctly.**

```text
Please verify the watchlist feature works correctly.
```

What happens? Claude reads the code:

Observe what it does and see if it is able to catch a bug we have introduced in the code.

**There's a bug.** Add a movie to your watchlist, refresh the page—the heart icon resets. The data is saved, but the UI doesn't know about it on reload.

```typescript
// The bug hiding in plain sight
const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set())
// ^ Initializes empty. Never fetches existing watchlist from API.
```

### Why Claude Missed It

Claude analyzed the code statically. It saw *what the code does*, not *what users experience*. This bug only reveals itself through interaction:

1. Click the `+watchlist` → works
2. Refresh the page → broken

No amount of code reading catches this. You need to **use the app**.

### The Solution: Give Claude a Browser Experience

With Playwright MCP, Claude can:

1. **Open your app** in a real browser
2. **Click buttons**, fill forms, scroll pages
3. **Observe what actually happens**—not what code suggests should happen
4. **Discover bugs** through real user workflows
5. **Write tests** grounded in observed behavior

---

## Step 1: Install Playwright MCP

We'll use the official Playwright MCP server from Microsoft.

### Add to Claude Code Settings

```bash
claude mcp add playwright npx @playwright/mcp@latest --scope project
```

### Verify Installation

Restart Claude Code and check that Playwright tools are available:

```text
/mcp
```

You should see `playwright` listed with its tools.

---

## Step 2: Watch Claude Discover the Bug

Now let's see MCP in action. We won't tell Claude about the bug—we'll let it find the issue through real interaction.

### Start Your Dev Server

```bash
bun dev
```

### The Prompt

Give Claude a QA task. Notice we're asking it to *verify* behavior, not fix anything:

Try first with a less descriptive prompt to see if it pickups the issue even with a simplified prompt:

```text
Use Playwright to test the watchlist feature on http://localhost:3000 . Please verify the watchlist feature fully works. Report what you observed and summarise.
```

A more descriptive prompt is:

```text
Use Playwright to test the watchlist feature on http://localhost:3000

1. Navigate to the app
2. Add a movie to the watchlist
3. Verify the UI shows it's in the watchlist
4. Refresh the page
5. Check if the watchlist state persisted
6. Report what you observed
```

### What You'll See

Observe what happens.

Claude will act as a QA now using the app as a user would. Not just looking at the code anymore. The same way a user or QA engineer would. No hints, no code review. Just using the app.

---

## Step 3: Investigate and Fix

Now that Claude has discovered the issue, ask it to investigate:

```text
You found that the watchlist state doesn't persist after refresh.

1. Check the network requests - is the data being saved to the API?
2. Look at the page source - is there a fetch on page load?
3. Identify the root cause and suggest a fix
```

### What Claude Should Find

- The POST request to `/api/watchlist` succeeds (data is saved)
- There's no GET request on page load to fetch existing watchlist
- The fix: Add a `useEffect` to fetch watchlist on mount

---

## Step 4: Write Tests Based on Real Behavior

Now that Claude has experienced the feature (and its bug), it can write meaningful tests:

```text
Based on your testing of the watchlist feature, write Playwright e2e tests that cover:

1. Adding a movie to the watchlist updates the UI
2. Watchlist state persists after page refresh (this should currently fail)
3. Removing a movie from watchlist works correctly

Create the tests in: e2e/watchlist.spec.ts
```

### Why This Matters

Because Claude actually used the feature, it:

- **Knows real selectors** from the accessibility snapshot
- **Understands actual behavior** vs. expected behavior
- **Can write a failing test** that proves the bug exists
- **Will know when the fix works** by re-running the test

---

## Step 5: Fix and Verify

Ask Claude to fix the bug and verify:

```text
Fix the watchlist persistence bug and run the tests to verify it works.
```

Claude should:

1. Add a `useEffect` to fetch watchlist on page load
2. Run the Playwright tests
3. Confirm all tests pass

---

## Why MCP Changes Everything

| Approach | What Claude Knows |
|----------|-------------------|
| **Tests from code** | What *should* happen based on implementation |
| **Tests from MCP exploration** | What *actually* happens in a real browser |

The MCP approach catches:

- **State persistence bugs** that only appear after refresh
- **Race conditions** invisible in code
- **UI glitches** only visible in browser
- **Edge cases** discovered through real interaction

---

## More MCP Ideas

| MCP Server | Use Case |
|------------|----------|
| **Context7** | Fetch up-to-date documentation for libraries |
| **GitHub** | Create issues, PRs, manage repos |
| **Figma** | Extract design specs and assets |
| **PostgreSQL** | Query and explore databases |

Browse the [MCP Server Registry](https://github.com/modelcontextprotocol/servers) for more.

---

## A word of caution on MCPs

### Context

MCPs can easily pollute the context if not aware. This will cause:

- Additional costs and
- Makes LLM prone to more hallucinations and less accurate response
- Pushes context exhaustion faster

Let's review the context in claude together using the slash command:

Start a fresh Claude Code instance then run the following command:

```text
/context
```

Pay attention to how much free space is left in the context.

As a test try adding another MCP like Github with many tools. Currently Claude code doesn't allow for tool filtering and dynamic MCP selection. So it will add all the tools to the context.

### Key Insight: Do You Really Need an MCP?

Before reaching for an MCP, ask yourself: **is this something I can build a slash command for and only invoke what I need?**

For example, if you just need to create PRs, a slash command like [`.claude/commands/pr.md`](../.claude/commands/pr.md) lets you invoke `gh pr create` on demand—you don't need the full GitHub MCP with 60+ tools loaded permanently.

But if your use case requires Claude to behave like a user—browsing, clicking, observing—then Playwright MCP makes sense. You'll likely use most of its tools, so having them available is worth the context cost.

### Security

MCPs can be risky if not used carefully. Remember you are opening your agent to the outside world.

A few security issues to be aware of:

- **Prompt Injection**: Malicious or obfuscated prompts can trick the LLM into performing unintended actions, leaking data, or executing harmful commands

- **Tool Injection**: Malicious MCP servers may use deceptive tool names/descriptions to hijack actions meant for legitimate tools, or modify tool behavior in future updates

- **Command Injection**: Local MCP servers executing OS commands can be vulnerable to injection attacks if input isn't properly sanitized

- **Confused Deputy**: MCP servers may execute actions with elevated privileges beyond what the user should have access to

- **Supply Chain Attacks**: MCP servers are just code you download and run. If the package or any of its dependencies get hacked (like a compromised npm package), you're running malicious code on your machine with full access to your system

- **Sampling Exploitation**: MCP has a feature called "sampling" where an MCP server can ask your client to make LLM requests on its behalf. A malicious server could abuse this to run prompts you never intended, racking up API costs or extracting info from your conversation context

### Best Practices

- **Only use trusted MCP servers**: Treat them like any npm package—check the source, verify the author, read the code if you can

- **Pin versions**: Don't auto-update MCP servers. A malicious update could change tool behavior without you noticing

- **Use OAuth enabled MCPs with scopes**: Request only the permissions you need. Short-lived, minimal-scope tokens reduce blast radius if compromised

- **Sandbox local servers**: Run MCP servers in containers or restricted environments so they can't access your whole system

- **Review tool descriptions**: Before approving an MCP server, check what tools it exposes and what they claim to do

- **Enable human-in-the-loop**: Keep approval prompts on for sensitive actions—don't auto-approve everything

---

## Catch Up

```bash
git checkout workshop/section-6-mcp
```

---

[← Back to Hooks](./5-hooks.md) | [Next: SDD →](./7-sdd.md)
