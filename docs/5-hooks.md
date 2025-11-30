---
layout: default
title: 5. Hooks
nav_order: 7
---

# Section 5: Hooks

Automate workflows and validation by executing shell commands at key points in Claude Code's lifecycle.

---

## What Are Hooks?

Hooks are shell commands or scripts that execute automatically when specific events happen in Claude Code. Think of them as automated quality gates that run at different points in Claude's lifecycle.
Hooks run automatically without Claude needing to decide to run them, and without you needing to approve each check.

### Available Hook Types

**Tool-related:**
- `PreToolUse` - Before Claude uses any tool (can block/allow)
- `PostToolUse` - After Claude uses any tool
- `PermissionRequest` - When permission dialog is shown (can allow/deny)

**User interaction:**
- `UserPromptSubmit` - When user submits a prompt (can block)
- `Notification` - When Claude Code sends notifications

**Session lifecycle:**
- `SessionStart` - At the beginning of sessions
- `SessionEnd` - At the end of sessions

**Stopping:**
- `Stop` - When Claude attempts to stop
- `SubagentStop` - When a subagent attempts to stop

**Maintenance:**
- `PreCompact` - Before conversation history is compacted

---

## Step 1: Your First Hook with `/hooks`
The fastest way to create a hook is using Claude Code's built-in `/hooks` command. Let's start with a simple demo to see hooks in action.

### The Task

Run the `/hooks` command in Claude Code:

```text
/hooks
```

When prompted:
1. Select **UserPromptSubmit** as the hook type
2. Press Enter to add a new hook
3. Set the command to: `echo when you finished say I AM DONE`
4. Add it to your **settings**

### What Gets Created

After running `/hooks`, check your project. You'll now have a `.claude` directory with a `settings.local.json` file containing:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo when you finished say I AM DONE"
          }
        ]
      }
    ]
  }
}
```

The hook configuration has:
- **matcher**: Empty string means it runs on every prompt (no filtering)
- **hooks**: An array of commands to execute
- **type**: "command" indicates a shell command
- **command**: The actual shell command to run

### Try It

Send any message to Claude:

```text
Hi there!
```

### Observe

- [ ] You see "when you finished say I AM DONE" printed before Claude responds
- [ ] Claude actually says "I AM DONE" at the end of its response (it received the hook output!)
- [ ] The hook runs on every prompt submission
- [ ] It's working! But...

---

## Why Simple Shell Hooks Don't Scale

The `echo hello` hook works for demos, but it has serious limitations for real automation:

- **No access to context** - What tool was used? What file was edited?
- **No conditional logic** - Can't say "only lint TypeScript files"
- **No blocking** - Can't prevent bad edits from going through
- **No feedback to Claude** - Can't send errors back for Claude to fix

To do anything useful, you'd need to parse JSON input from stdin, use tools like `jq`, handle escape sequences, and manually construct JSON output. It gets messy fast.

There's a better way.

---

## Step 2: TypeScript Hooks with the Claude Agent SDK

For real automation, we use TypeScript hooks with the official SDK.

### Why This Pattern Scales

| Feature | Shell Hooks | TypeScript + SDK |
|---------|-------------|------------------|
| **Type safety** | None | SDK types catch errors at write-time |
| **Input parsing** | Complex jq/bash pipes | One-line: `Bun.stdin.json()` |
| **Logic** | Awkward shell scripts | Full TypeScript |
| **Ecosystem** | Limited | Any npm package |

### Set Up the Hooks Directory

Create a hooks directory and initialize it:

```bash
mkdir -p .claude/hooks
cd .claude/hooks
bun init -y
bun add @anthropic-ai/claude-code-sdk
```

This gives you:
- A dedicated directory for hook scripts
- TypeScript support out of the box
- Type definitions for all hook inputs/outputs

---

## Step 3: Context Injection Hook (UserPromptSubmit)

Let's replace that simple `echo hello` with something useful - injecting context into every conversation.

### The Problem

Without context injection, Claude doesn't know:
- Your local time
- Your timezone
- What day it is for you

### Create the Hook

Create `.claude/hooks/UserPromptSubmit.ts`:

```typescript
/**
 * UserPromptSubmit hook - Injects context before every prompt
 * Uses @anthropic-ai/claude-code-sdk for type safety
 */

// Inject current time and timezone into every conversation
const now = new Date()

const context = `[Context]
- Current time: ${now.toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })}
- Timezone: Australia/Melbourne
- Day: ${now.toLocaleDateString('en-AU', { weekday: 'long' })}`

console.log(context)
```

### Configure It

Update your `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bun .claude/hooks/UserPromptSubmit.ts",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Note:** Empty `matcher` means it runs on every prompt.

### Try It

Ask Claude:

```text
What time is it?
```

### Observe

- [ ] Claude now knows your current time and timezone
- [ ] Context is injected before every prompt
- [ ] Claude can give time-aware responses like "It's Sunday evening in Melbourne"

---

## Step 4: Linting Hook (PostToolUse)

Now let's add a hook that enforces code quality by running the linter after every file edit.

### The Problem

Without automated linting:
- Claude might introduce code style issues
- Errors aren't caught until you manually run `bun lint`
- You have to remember to check after every change

### Create the Hook

Create `.claude/hooks/PostToolUse.ts`:

```typescript
/**
 * PostToolUse hook - Runs linter after file edits
 * Uses @anthropic-ai/claude-code-sdk for type safety
 */
import type { PostToolUseHookInput } from '@anthropic-ai/claude-code-sdk'

// 1. Read input from Claude about what tool was used
const input: PostToolUseHookInput = await Bun.stdin.json()

// 2. Only process Edit and Write tools
if (input.tool_name !== 'Edit' && input.tool_name !== 'Write') {
  process.exit(0)
}

// 3. Get the file path from tool input
const toolInput = input.tool_input as { file_path?: string }
const filePath = toolInput.file_path

if (!filePath) {
  process.exit(0)
}

// 4. Only process TypeScript files
if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
  process.exit(0)
}

// 5. Run linting
console.error('🔍 Running linter...')
const lintResult = Bun.spawnSync(['bun', 'lint'], {
  cwd: input.cwd,
  stdout: 'pipe',
  stderr: 'pipe',
})

const lintOutput = lintResult.stdout.toString() + lintResult.stderr.toString()

// 6. If lint fails, BLOCK the edit and send errors to Claude
if (lintResult.exitCode !== 0) {
  console.error('❌ Linting failed!')
  console.error(lintOutput)

  await Bun.write(
    Bun.stdout,
    JSON.stringify({
      decision: 'block',
      reason: `Linting failed:\n${lintOutput}`,
    })
  )
  process.exit(2)
}

console.error('✅ Linting passed!')
process.exit(0)
```

### Key Features

- **Type safety**: `PostToolUseHookInput` from the SDK catches errors at write-time
- **Smart filtering**: Only runs on `.ts` and `.tsx` files
- **Blocking**: Can prevent edits that fail quality checks (exit code 2)
- **Feedback to Claude**: Sends lint errors back so Claude can fix them

### Configure It

Update your `.claude/settings.json` to include both hooks:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bun .claude/hooks/UserPromptSubmit.ts",
            "timeout": 5
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bun .claude/hooks/PostToolUse.ts",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

### Try It

Ask Claude to introduce a linting error:

```text
Add a new utility function in lib/utils.ts with an unused variable
```

### Observe

- [ ] Hook runs only for TypeScript files
- [ ] Linting errors are caught
- [ ] Claude receives the error feedback
- [ ] Claude automatically fixes the errors
- [ ] Hook runs again and passes

---

## Step 5: Adding Test Automation (Optional)

Extend the PostToolUse hook to also run tests after edits.

### Add to PostToolUse.ts

After the linting section, add:

```typescript
// 7. Check if tests exist
const hasTests = Bun.spawnSync(
  ['bash', '-c', "find . -name '*.test.ts' -o -name '*.test.tsx' | grep -q ."],
  { cwd: input.cwd }
).exitCode === 0

if (hasTests) {
  console.error('🧪 Running tests...')
  const testResult = Bun.spawnSync(['bunx', 'vitest', 'run'], {
    cwd: input.cwd,
    stdout: 'pipe',
    stderr: 'pipe',
  })

  const testOutput = testResult.stdout.toString() + testResult.stderr.toString()

  if (testResult.exitCode !== 0) {
    console.error('❌ Tests failed!')
    console.error(testOutput)

    await Bun.write(
      Bun.stdout,
      JSON.stringify({
        decision: 'block',
        reason: `Tests failed:\n${testOutput}`,
      })
    )
    process.exit(2)
  }

  console.error('✅ Tests passed!')
}
```

---

## Hook Lifecycle Flow

```text
You: "Add error handling to MovieCard"
     ↓
Claude: Uses Edit tool to modify MovieCard.tsx
     ↓
PostToolUse Hook: Triggered
     ↓
Check: Is it TypeScript? → Yes
     ↓
Run: bun lint
     ↓
     ├─ Lint passes → ✅ Allow edit
     │                   ↓
     │                (Optional) Run tests
     │                   ↓
     │                   ├─ Tests pass → ✅ Complete
     │                   └─ Tests fail → ❌ Block edit
     │
     └─ Lint fails → ❌ Block edit
                        ↓
                     Send errors to Claude
                        ↓
                     Claude sees errors and fixes
```

---

## Hook Best Practices

1. **Start with `/hooks`** - Quick way to scaffold, then migrate to TypeScript
2. **Use the SDK** - Type safety prevents runtime surprises
3. **Filter wisely** - Only run checks on relevant files
4. **Use timeouts** - Prevent hooks from hanging forever
5. **Provide feedback** - Use `console.error()` for messages Claude sees
6. **Block sparingly** - Only block for critical failures

---

## Hook Execution Types

Claude Code supports two distinct hook execution types:

### Type: Command

Shell commands that execute locally. This is what we've used throughout this workshop.

```json
{
  "type": "command",
  "command": "bun .claude/hooks/PostToolUse.ts",
  "timeout": 60
}
```

- **Execution**: Runs locally as a bash/shell command
- **Use case**: Deterministic rule enforcement (linting, tests, formatting)
- **Speed**: Fast (local execution)
- **Control**: Exit codes determine behavior (0 = success, 2 = block)

### Type: Prompt

LLM-based hooks that use AI to evaluate whether to allow actions.

```json
{
  "type": "prompt",
  "prompt": "Evaluate if this code change follows our security guidelines: $ARGUMENTS"
}
```

- **Execution**: Sends input to Haiku (a fast LLM) for evaluation
- **Use case**: Context-aware evaluation that's hard to express as rules
- **Speed**: Slower (requires API call)
- **Control**: Returns structured JSON with decisions like `"approve"` or `"block"`

### When to Use Each

| Scenario | Use |
|----------|-----|
| Run linter after edits | `command` |
| Check if all tasks complete before stopping | `prompt` |
| Format code on save | `command` |
| Evaluate if code follows security guidelines | `prompt` |
| Inject context into prompts | `command` |

---

## Summary: Shell vs TypeScript Hooks

| Approach | Use When |
|----------|----------|
| `/hooks` + shell | Quick demos, simple echo/notifications |
| TypeScript + SDK | Real automation, conditional logic, blocking |

The TypeScript + SDK approach gives you:
- **Type safety**: SDK types catch errors at write-time
- **One-line parsing**: `Bun.stdin.json()` replaces complex pipes
- **NPM ecosystem**: Use any package for advanced automation

---

## Troubleshooting

**Hook not running?**
- Check `.claude/settings.json` syntax (valid JSON)
- Verify the matcher pattern matches your tool
- Check timeout is sufficient

**Hook blocking all edits?**
- Check exit code logic in your hook script
- Look for `process.exit(2)` - this blocks
- `process.exit(0)` allows the edit

**Want to see hook output?**
- Hooks write to `stderr` - you'll see it in the terminal
- Use `console.error()` in TypeScript hooks
- Use `echo` to stderr in shell: `>&2 echo "message"`

---

## Catch Up

```bash
git checkout workshop/section-5-hooks
```

---

[← Back to Slash Commands](./4-commands.md) | [Next: MCP Servers →](./6-mcp.md)
