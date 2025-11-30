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
- **type**: "command" indicates a shell command. There are two types of hooks: command and prompt. We are focused on command hooks for this workshop. You can checkout the [hooks documentation](https://docs.anthropic.com/claude/hooks/hooks-reference) for more information.
- **command**: The actual shell command to run

### Try It

Send the following message to Claude (or try another prompt):

```text
Add a new function to lib/utils.ts that formats movie runtime from minutes to "Xh Ym" format (e.g., 142 → "2h 22m"). Then use this to display runtime in MovieCard. Skip linting for now. 
```

### Observe

- [ ] You see "when you finished say I AM DONE" printed before Claude responds
- [ ] Claude should say "I AM DONE" at the end of its response work
- [ ] The hook runs on every prompt submission
- [ ] It's working! But...

---

## Why Simple Shell Hooks Don't Scale

The echo hook works for demos, but it has serious limitations for real automation:

- **No access to context** - What tool was used? What file was edited?
- **No conditional logic** - Can't say "only lint TypeScript files"
- **No blocking** - Can't prevent bad edits from going through
- **No feedback to Claude** - Can't send errors back for Claude to fix using [JSON Output](https://code.claude.com/docs/en/hooks#advanced:-json-output) 

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

Let's replace that simple echo hook with something useful - injecting context into every conversation.

### The Problem

Claude would most probably know your timezone however it does not have concept of your present moment. Wouldn't it be cool to make Claude fully time aware no matter where you are in the world?. This could help in providing more accurate and context aware responses, depending on what user is asking.

Before we continue. Try asking Claude something like:

```text
What exact time am I in?
```

Notice the response. It's not very accurate, especially when it comes to your exact time. Let's fix this by injecting context into every conversation. Claude might also try to run a bash command to get the exact time in your timezone, because it doesn't have a concept of your present moment.

### Create the Hook

Create `.claude/hooks/UserPromptSubmit.ts`:

```typescript
/**
 * UserPromptSubmit Hook - Runs before Claude processes each user message
 *
 * Use cases:
 * - Inject dynamic context (time, environment info, etc.)
 * - Add project-specific context to every prompt
 * - Validate or transform user input
 *
 * Communication pattern:
 * - Output to stdout (console.log): Sent to Claude as additional context
 * - No JSON response needed for this hook type (unlike PostToolUse)
 */

// Capture current timestamp when the user submits their prompt
const now = new Date()

// Detect system timezone and locale dynamically from the environment
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const locale = Intl.DateTimeFormat().resolvedOptions().locale

// Build context string with formatted date/time info
// This gives Claude awareness of when the conversation is happening
const context = `
[Context]
- Current time: ${now.toLocaleString(locale, { timeZone: timezone })}
- Timezone: ${timezone}
- Day: ${now.toLocaleDateString(locale, { weekday: 'long', timeZone: timezone })}
`

// console.log output is sent to Claude as context
console.log(context)
```

### Configure It

Update your `.claude/settings.json` and replace the existing hook with the following:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bun run .claude/hooks/UserPromptSubmit.ts"
          }
        ]
      }
    ]
  }
}
```

**Note:** Empty `matcher` means it runs on every prompt.

### Try It

Ask Claude again:

```text
What exact time am I in?
```

Claude should now say your exact time in your timezone.

---

## Step 4: Linting Hook (PostToolUse)

Now let's add a hook that enforces code quality by running the linter after every file edit.

### The Problem

Have you ever wondered wouldit be cool if your agent could auto lint your code on edits so that it can keep code quality in check?, and perhaps not rely on the LLM to remember to run run the linter?. Let's try this out.

Open the `lib/utils.ts` file and let's introduce an intentional bug.

add the following line to the `cn` function just before the actual return statement:

```typescript
return 'test'
```

Now let's run `bun lint` to see how many errors we have in the code.

Now pretending we don't know about the bugs, let's ask Claude to implement a new functionality.

```text
Add a new function to lib/utils.ts that formats movie runtime from minutes to "Xh Ym" format (e.g., 142 → "2h 22m"). Then use this to display runtime in MovieCard.
```

Observe what is happening:

- [ ] Did Claude pick up on the bugs?
- [ ] Did claude manually asked you to run the linter?, or did it just ignore linting errors?
- [ ] Did claude pick up the early return bug on the same file that it added the new function to?

What if we could enforce claude to stay on track and continuously strive for no bugs in the code? That's exactly what the PostToolUse hook is for. Let's create it.

---

### Create the Hook

Create `.claude/hooks/PostToolUse.ts`:

```typescript
/**
 * PostToolUse Hook - Runs after Claude Code uses a tool (Edit, Write, Bash, etc.)
 *
 * Communication pattern:
 * - Input: Claude pipes hook context as JSON to stdin
 * - Output: Hook writes JSON response to stdout with `decision` and optionally `reason`
 *
 * Why Bun?
 * - Fast startup: Executes TypeScript directly without compilation
 * - Built-in APIs: Clean ergonomic APIs for stdin/stdout and process spawning
 */
import type { PostToolUseHookInput } from '@anthropic-ai/claude-agent-sdk'

// Read the JSON payload that Claude Code pipes via stdin
// Contains info about what tool was used, working directory, etc.
const input: PostToolUseHookInput = await Bun.stdin.json()

// Run linting synchronously in the project directory
// This checks if code still passes linting after Claude made changes
const result = Bun.spawnSync(['bun', 'lint'], { cwd: input.cwd })

// If linting fails, block the action and report errors back to Claude
if (result.exitCode !== 0) {
  const stdout = result.stdout.toString()
  const stderr = result.stderr.toString()
  const output = [stdout, stderr].filter(Boolean).join('\n').trim()

  // Output JSON with decision: 'block' tells Claude Code the action was problematic
  // The reason is shown to Claude so it can fix the lint errors
  await Bun.write(
    Bun.stdout,
    JSON.stringify({
      decision: 'block',
      reason: `Linting failed. Please fix errors:\n\n${output}`,
    })
  )
  process.exit(0) //JSON output is only processed when the hook exits with code 0. If your hook exits with code 2 (blocking error), stderr text is used directly—any JSON in stdout is ignored. For other non-zero exit codes, only stderr is shown to the user in verbose mode (ctrl+o).
}

// If linting passes, no JSON response needed - Claude continues normally
console.log('✅ Lint passed')
```

### Key Features

- **Type safety**: `PostToolUseHookInput` from the SDK catches errors at write-time
- **Blocking**: Can prevent edits that fail quality checks (exit code 0 with JSON output)
- **Feedback to Claude**: Sends lint errors back so Claude can fix them using JSON output
- **Enhanced file type detection**: Can detect if the file is a TypeScript file and run the linter accordingly ( we are skipping this for now)

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

Now discard the previous changes and let's ask Claude the same prompt again:

```text
Add a new function to lib/utils.ts that formats movie runtime from minutes to "Xh Ym" format (e.g., 142 → "2h 22m"). Then use this to display runtime in MovieCard.
```

Observe how your agent keeps itself in check and resolves the linting errors automatically.

---

## Step 5: Adding Test Automation (Optional)

Extend the PostToolUse hook to also run tests after edits. You can do this on your own time.

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

    await Bun.write(
      Bun.stdout,
      JSON.stringify({
        decision: 'block',
        reason: `Tests failed:\n${testOutput}`,
      })
    )
    process.exit(0)
  }

  console.error('✅ Tests passed!')
}
```

**NOTE**: It is very common to get into an infinite loop with hooks. Make sure you always test the hooks you create with multiple ground truth prompts (test cases) to ensure they are working as expected.

---

### When to Use Each

| Scenario | Use |
|----------|-----|
| Run linter after edits | `command` |
| Check if all tasks complete before stopping | `prompt` |
| Format code on save | `command` |
| Evaluate if code follows security guidelines | `prompt` |
| Inject context into prompts | `command` |

---

## More Hook Ideas

| Idea | Hook |
|------|------|
| Auto-format with Prettier | `PostToolUse` |
| Block dangerous bash commands | `PreToolUse` |
| Load project context at startup | `SessionStart` |
| Verify task completion before stopping | `Stop` using `prompt` type|
| Auto-approve safe file reads | `PreToolUse` |

---

## Catch Up

```bash
git checkout workshop/section-5-hooks
```

---

[← Back to Slash Commands](./4-commands.md) | [Next: MCP Servers →](./6-mcp.md)
