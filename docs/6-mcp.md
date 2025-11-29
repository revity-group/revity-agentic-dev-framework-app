---
layout: default
title: 6. MCP Servers
nav_order: 8
---

# Section 6: MCP Servers

Extend Claude's capabilities by connecting to external tools and services through the Model Context Protocol (MCP).

---

## What is MCP?

MCP (Model Context Protocol) is an open standard that lets Claude connect to external data sources and tools. Think of MCP servers as plugins that give Claude new superpowers:

- **Access external data** - Databases, APIs, file systems
- **Use specialized tools** - Browsers, search engines, development tools
- **Integrate services** - Slack, GitHub, Jira, and more

Instead of Claude being limited to the tools built into Claude Code, MCP lets you connect to an ecosystem of servers.

---

## Why Use MCP Servers?

Without MCP:
```text
You: "Search for the latest Next.js 15 documentation"
Claude: "I can't browse the web, but based on my training data..."
```

With MCP (using a browser or search server):
```text
You: "Search for the latest Next.js 15 documentation"
Claude: *uses web search MCP server*
Claude: "Here's what I found from the official Next.js docs..."
```

---

## Available MCP Servers (For This Workshop)

Here are the MCP servers we have available:

### Development & Infrastructure
- **awslabs.cdk-mcp-server** - AWS CDK infrastructure management
- **github** - GitHub API integration via Copilot MCP
- **atlassian** - Jira, Confluence, and other Atlassian tools

### Browser & Web
- **playwright** - Browser automation and testing (Firefox)
- **context7** - AI-powered context and knowledge management

### Design Tools
- **Figma** - Design file access and manipulation

---

## Workshop Plan

In this section, we'll set up **2 MCP servers** that are:
- ✅ Simple to configure
- ✅ Immediately useful for development
- ✅ Great for learning MCP concepts

**Coming soon:** Step-by-step guides for setting up and using these servers.

---

## MCP Server Structure

Each MCP server will follow this pattern:

1. **Installation** - How to install and configure
2. **Configuration** - Adding to `.claude/settings.json`
3. **Capabilities** - What tools/resources it provides
4. **Try It** - Hands-on tasks
5. **Observe** - What you should see
6. **Best Practices** - Tips for effective use

---

## Recommended Servers for This Workshop

Based on ease of setup and practical value, I recommend:

### Option 1: **Playwright** (Browser Automation)
**Why?**
- Already configured in your setup
- Visual and engaging (see browser actions happen)
- Great for testing the movie app UI
- No API keys or complex auth needed

**Use cases:**
- Test the movie search functionality
- Verify watchlist features work correctly
- Automate UI testing

---

### Option 2: **Context7** (AI Context Management)
**Why?**
- Already has API key configured
- Simple to set up (just npx command)
- Provides persistent memory across Claude sessions
- Useful for maintaining workshop context

**Use cases:**
- Remember workshop progress
- Store project-specific knowledge
- Maintain conversation context

---

## Alternative Choices

**GitHub MCP** - If you want to practice GitHub operations (create issues, PRs, etc.)

**Atlassian** - If your team uses Jira/Confluence and you want integration practice

---

## Catch Up

```bash
git checkout workshop/section-6-mcp
```

---

[← Back to Hooks](./5-hooks.md) | [Next: Skills →](./7-skills.md)
