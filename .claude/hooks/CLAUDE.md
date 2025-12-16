# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **Claude Code hooks library** - a collection of TypeScript hooks that extend Claude Code's behavior during tool execution and prompt submission. Hooks run as external processes that receive JSON input via stdin and communicate back via stdout/exit codes.

## Development Commands

```bash
# Install dependencies
bun install

# Run a hook directly (for testing)
echo '{"prompt": "help me with nextjs"}' | bun run user-prompt-submit/library-detection.ts

# Type check
bun tsc --noEmit
```

## Directory Structure

```
hooks/
├── user-prompt-submit/     # Hooks that run before Claude processes prompts
│   ├── timezone-context.ts # Injects current time/timezone
│   └── library-detection.ts# Detects libraries, prompts Context7 usage
├── post-tool-use/          # Hooks that run after tool execution
│   └── lint-check.ts       # Runs linting after Edit/Write
├── pre-tool-use/           # Hooks that run before tool execution (add as needed)
├── index.ts                # Entry point (placeholder)
└── CLAUDE.md
```

## Hook Architecture

### Communication Pattern

All hooks follow this contract:

1. **Input**: Claude pipes JSON to stdin containing hook context
2. **Processing**: Hook validates/transforms/enriches the request
3. **Output**:
   - Exit code 0 + optional JSON to stdout → success (JSON parsed for decisions)
   - Exit code 2 + stderr → blocking error (stderr shown to Claude)
   - Other exit codes → non-blocking (stderr shown in verbose mode only)

### Input Types

Import hook input types from the Agent SDK:

```typescript
import type {
  PostToolUseHookInput,
  PreToolUseHookInput,
  UserPromptSubmitHookInput
} from '@anthropic-ai/claude-agent-sdk'
```

### Output Schema (for blocking/decision hooks)

```typescript
interface HookOutput {
  decision: 'approve' | 'block' | 'deny' | 'allow' | 'ask'
  reason?: string
  continue?: boolean
  stopReason?: string
}
```

## Naming Conventions

**Directories**: kebab-case matching hook event names
- `user-prompt-submit/` → UserPromptSubmit event
- `post-tool-use/` → PostToolUse event
- `pre-tool-use/` → PreToolUse event

**Files**: kebab-case describing the hook's purpose
- `lint-check.ts` - runs linting
- `timezone-context.ts` - injects timezone
- `library-detection.ts` - detects library mentions

## Adding New Hooks

1. Create a new `.ts` file in the appropriate event directory
2. Import the appropriate input type from `@anthropic-ai/claude-agent-sdk`
3. Read input via `await Bun.stdin.json()`
4. For blocking decisions, write JSON to stdout via `Bun.write(Bun.stdout, JSON.stringify({...}))`
5. Register in `../.claude/settings.json` under the appropriate hook event

### Template for a New Hook

```typescript
/**
 * [HookEvent] Hook - [Brief description]
 *
 * Purpose: [What this hook does]
 * Triggers: [When this hook runs]
 */
import type { [HookEvent]HookInput } from '@anthropic-ai/claude-agent-sdk'

const input: [HookEvent]HookInput = await Bun.stdin.json()

// Your logic here

// For blocking decisions:
await Bun.write(Bun.stdout, JSON.stringify({
  decision: 'block',
  reason: 'Explanation shown to Claude'
}))
process.exit(0)

// For pass-through (UserPromptSubmit context injection):
console.log('[Context Header]\nYour context here')
```

## Registering Hooks

Add hooks to `../.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          { "type": "command", "command": "bun run .claude/hooks/user-prompt-submit/your-hook.ts" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bun run .claude/hooks/post-tool-use/your-hook.ts" }
        ]
      }
    ]
  }
}
```

**Matcher patterns**: Use regex to filter which tools trigger the hook (e.g., `"Edit|Write"`, `"Bash"`, `".*"` for all).

## Bun-Specific Patterns

This library uses Bun for fast TypeScript execution without compilation:

```typescript
// Read JSON from stdin
const input = await Bun.stdin.json()

// Write JSON to stdout
await Bun.write(Bun.stdout, JSON.stringify({ decision: 'block', reason: '...' }))

// Spawn sync process
const result = Bun.spawnSync(['bun', 'lint'], { cwd: input.cwd })

// File operations
const content = await Bun.file('path/to/file').text()
```

## Testing Hooks Locally

```bash
# Test UserPromptSubmit hooks
echo '{"prompt": "help with tanstack query", "cwd": "/path/to/project"}' | bun run user-prompt-submit/library-detection.ts

# Test PostToolUse hooks (simulate Edit tool)
echo '{"tool_name": "Edit", "cwd": "/path/to/project"}' | bun run post-tool-use/lint-check.ts
```

## Key Dependencies

- `@anthropic-ai/claude-agent-sdk` - TypeScript types for hook inputs
- `bun` - Runtime for fast TypeScript execution
