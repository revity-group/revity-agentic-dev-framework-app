---
name: fork-terminal
description: "This skill spawns new terminal windows with AI coding agents (Claude Code, Gemini CLI, Codex CLI) or raw commands. Use when the user says 'fork terminal', 'new terminal', 'spawn terminal', or wants to delegate work to another agent in parallel."
allowed-tools: Read,Bash
license: Complete terms in LICENSE.txt
---

# Fork Terminal

Spawn new Cursor terminal tabs with AI coding agents running in parallel. Delegate tasks to Claude Code, Gemini CLI, or Codex CLI. Can also detect running agents and inject messages into them.

## Trigger Phrases

- "fork terminal use claude code to..."
- "new terminal with gemini..."
- "spawn a terminal running codex..."
- "fork terminal to run..."
- "send this to the running gemini agent..."
- "inject into codex..."
- "list running agents"

## Supported Tools

| Tool | Trigger Keywords | Command |
|------|------------------|---------|
| Claude Code | "claude", "claude code" | `claude --print "<task>"` |
| Gemini CLI | "gemini" | `gemini "<task>"` |
| Codex CLI | "codex", "gpt", "openai" | `codex "<task>"` |
| Raw CLI | No agent keyword | Direct command |

## Quick Start

Run the setup check to see what you need:

```bash
bun run .claude/skills/fork-terminal/scripts/setup-check.ts
```

This will verify all dependencies and guide you through installation.

## Requirements

- **macOS** - Uses AppleScript for terminal automation
- **Bun** - Runtime for the scripts (`brew install bun`)
- **Accessibility permissions** - System Settings → Privacy & Security → Accessibility
- **At least one agent CLI** installed (see below)

## Installation (via Homebrew)

Install the agents you want to use:

```bash
# Install all at once
brew install claude-code gemini-cli codex

# Or individually
brew install claude-code   # Claude Code
brew install gemini-cli    # Gemini CLI
brew install codex         # Codex CLI
```

## Workflow

### Spawning New Terminal

1. **Identify the tool** from keywords in the request
2. **Read the cookbook** for command syntax (`cookbook/<tool>.md`)
3. **Check for context handoff** - if user wants context passed, use `prompts/fork_summary.md`
4. **Execute the fork**:

```bash
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts "<command>"
```

### Injecting into Running Agents

1. **List running agents** to see what's available:

```bash
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts --list
```

1. **Inject a message** into a running agent:

```bash
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts --inject <agent> "<message>"
```

The script will:

- Detect running gemini/codex/claude processes
- Activate Cursor and type the message into the focused terminal
- The user should have the target agent's terminal in focus

## Examples

### Spawn New Terminal

```bash
# Claude Code
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts "claude --print 'Analyze the API routes'"

# Gemini
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts "gemini 'Generate tests for hooks/'"

# Codex
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts "codex 'Implement the auth feature'"

# Raw command
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts "bun dev"
```

### Inject into Running Agents

```bash
# List running agents
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts --list

# Inject into Gemini
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts --inject gemini "Analyze the codebase structure"

# Inject into Codex
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts --inject codex "Write unit tests for the hooks"

# Inject into Claude
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts --inject claude "Review this PR"
```

## Setup

Run the setup check first:

```bash
bun run .claude/skills/fork-terminal/scripts/setup-check.ts
```

If you don't have Bun yet:

```bash
brew install bun
```

## Resources

- `scripts/setup-check.ts` - Dependency checker and install guide
- `scripts/fork-terminal.ts` - Terminal spawner with inject support (macOS + Cursor)
- `cookbook/` - Command reference for each tool
- `prompts/fork_summary.md` - Context handoff template
