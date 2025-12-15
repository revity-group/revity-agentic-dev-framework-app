---
name: fork-terminal
description: "This skill spawns new terminal windows with AI coding agents (Claude Code, Gemini CLI, Codex CLI) or raw commands. Use when the user says 'fork terminal', 'new terminal', 'spawn terminal', or wants to delegate work to another agent in parallel."
allowed-tools: Read,Bash
license: Complete terms in LICENSE.txt
---

# Fork Terminal

Spawn new Cursor terminal tabs with AI coding agents running in parallel. Delegate tasks to Claude Code, Gemini CLI, or Codex CLI.

## Trigger Phrases

- "fork terminal use claude code to..."
- "new terminal with gemini..."
- "spawn a terminal running codex..."
- "fork terminal to run..."

## Supported Tools

| Tool | Trigger Keywords | Command |
|------|------------------|---------|
| Claude Code | "claude", "claude code" | `claude --print "<task>"` |
| Gemini CLI | "gemini" | `gemini "<task>"` |
| Codex CLI | "codex", "gpt", "openai" | `codex "<task>"` |
| Raw CLI | No agent keyword | Direct command |

## Workflow

1. **Identify the tool** from keywords in the request
2. **Read the cookbook** for command syntax (`cookbook/<tool>.md`)
3. **Check for context handoff** - if user wants context passed, use `prompts/fork_summary.md`
4. **Execute the fork**:

```bash
bun run .claude/skills/fork-terminal/scripts/fork-terminal.ts "<command>"
```

## Examples

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

## Setup

**Accessibility permissions required** - Grant in: System Settings > Privacy & Security > Accessibility

## Resources

- `scripts/fork-terminal.ts` - Terminal spawner (macOS + Cursor)
- `cookbook/` - Command reference for each tool
- `prompts/fork_summary.md` - Context handoff template
