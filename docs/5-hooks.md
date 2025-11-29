---
layout: default
title: 5. Hooks
nav_order: 7
---

# Section 5: Hooks

Automate quality checks and validation by running shell commands at key points in Claude's workflow.

---

## What Are Hooks?

Hooks are shell commands or scripts that execute automatically when specific events happen in Claude Code. Think of them as automated quality gates that run:

- **After file edits** - Lint code, format files, run quick checks
- **After file writes** - Run tests, validate structure, check coverage
- **Before/after any tool** - Custom validation, logging, notifications

Hooks let Claude get immediate feedback about code quality without you having to manually run checks.

---

## Why Use Hooks?

Without hooks:
```text
You: "Add error handling to MovieCard"
Claude: *edits file*
You: *manually run* `bun lint`
You: *see errors* "Claude, you have lint errors"
Claude: *fixes errors*
```

With hooks:
```text
You: "Add error handling to MovieCard"
Claude: *edits file*
Hook: *automatically runs* `bun lint`
Claude: *sees feedback immediately* "Let me fix those lint errors"
```

---

## Step 1: Your First Hook (Simple Echo)

Let's start with the simplest possible hook - just echo a message when Claude edits a file.

### The Task

Add this to your `.claude/settings.json`:

```json
{
  "permissions": {
    "hooks": {
      "PostToolUse": [
        {
          "matcher": "Edit",
          "hooks": [
            {
              "type": "command",
              "command": "echo '✅ File edited successfully!'",
              "timeout": 5
            }
          ]
        }
      ]
    }
  }
}
```

**What this does:**
- **PostToolUse**: Runs after a tool is used
- **matcher: "Edit"**: Only triggers after the Edit tool
- **command**: Simple echo statement
- **timeout**: Maximum seconds to wait (5s)

### Try It

Now ask Claude:

```text
Add a comment to the MovieCard component explaining what it does
```

### Observe

- [ ] After Claude edits the file, you see: `✅ File edited successfully!`
- [ ] The hook runs automatically without Claude or you triggering it
- [ ] The edit still completes normally

---

## Step 2: Context-Aware Hooks

Let's make the hook more useful by showing which file was edited.

### The Task

Update your `.claude/settings.json`:

```json
{
  "permissions": {
    "hooks": {
      "PostToolUse": [
        {
          "matcher": "Edit|Write",
          "hooks": [
            {
              "type": "command",
              "command": "echo '📝 Modified: $CLAUDE_TOOL_INPUT_FILE_PATH'",
              "timeout": 5
            }
          ]
        }
      ]
    }
  }
}
```

**What's new:**
- **matcher: "Edit|Write"**: Triggers after Edit OR Write
- **$CLAUDE_TOOL_INPUT_FILE_PATH**: Environment variable with the file path

### Try It

```text
Add a new prop to MovieCard for showing the release year
```

### Observe

- [ ] You see which file was modified: `📝 Modified: /path/to/MovieCard.tsx`
- [ ] Hook provides context about what changed
- [ ] Works for both Edit and Write operations

---

## Step 3: Running Real Checks (Linting)

Now let's use hooks for their real purpose - automatic code quality checks.

### The Task

Update your `.claude/settings.json`:

```json
{
  "permissions": {
    "hooks": {
      "PostToolUse": [
        {
          "matcher": "Edit|Write",
          "hooks": [
            {
              "type": "command",
              "command": "echo '🔍 Running linter...' && bun lint",
              "timeout": 30
            }
          ]
        }
      ]
    }
  }
}
```

**What this does:**
- Runs ESLint on the entire codebase after every edit/write
- Shows you any linting errors immediately
- Timeout increased to 30s to allow lint to complete

### Try It

```text
Add a poorly formatted function to MovieCard (missing semicolons, wrong quotes, etc)
```

### Observe

- [ ] Lint runs automatically after the edit
- [ ] You see any ESLint errors in the output
- [ ] Claude can see the errors and fix them if needed

**Note:** This lints the whole codebase. For larger projects, you might want to lint only the changed file.

---

## Step 4: TypeScript Hooks (Full Power)

For complex logic like "only run tests if they exist" or "block edits that fail linting", you need TypeScript hooks.

### The Task

The `.claude/hooks/PostToolUse.ts` file already exists in your project. Let's understand what it does:

```typescript
// 1. Read input from Claude about what tool was used
const input: PostToolUseHookInput = await Bun.stdin.json()

// 2. Only process Edit and Write tools
if (input.tool_name !== 'Edit' && input.tool_name !== 'Write') {
  process.exit(0)
}

// 3. Only process TypeScript files
const filePath = toolInput.file_path
if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
  process.exit(0)
}

// 4. Run linting
const lintResult = Bun.spawnSync(['bun', 'lint'], { ... })

// 5. If lint fails, BLOCK the edit
if (lintResult.exitCode !== 0) {
  await Bun.write(Bun.stdout, JSON.stringify({
    decision: 'block',
    reason: `Linting failed:\n${lintOutput}`,
  }))
  process.exit(2)
}
```

**Key features:**
- **Smart filtering**: Only runs on `.ts` and `.tsx` files
- **Blocking**: Can prevent edits that fail quality checks
- **Feedback to Claude**: Sends lint errors back to Claude to fix
- **TypeScript**: Full programming language for complex logic

### Configure It

Update your `.claude/settings.json`:

```json
{
  "permissions": {
    "hooks": {
      "PostToolUse": [
        {
          "matcher": "Edit|Write",
          "hooks": [
            {
              "type": "command",
              "command": "bun run .claude/hooks/PostToolUse.ts",
              "timeout": 60
            }
          ]
        }
      ]
    }
  }
}
```

### Try It

```text
Add a new utility function in lib/ with intentional linting errors (unused variables, wrong formatting)
```

### Observe

- [ ] Hook runs only for TypeScript files
- [ ] Linting errors are caught
- [ ] Claude receives the error feedback
- [ ] Claude automatically fixes the errors
- [ ] Hook runs again and passes

---

## Step 5: Adding Test Automation

Let's extend the TypeScript hook to also run tests.

### The Task

The test automation is already in `PostToolUse.ts` but commented out. Let's understand it:

```typescript
// Uncomment this section in .claude/hooks/PostToolUse.ts

// Check if tests exist
const hasTests = Bun.spawnSync([
  'bash', '-c',
  "find . -name '*.test.ts' -o -name '*.test.tsx' | grep -q ."
], { cwd: input.cwd }).exitCode === 0

if (hasTests) {
  console.error('🧪 Running tests...')
  const testResult = Bun.spawnSync(['bunx', 'vitest', 'run'], { ... })

  if (testResult.exitCode !== 0) {
    // Block the edit if tests fail
    await Bun.write(Bun.stdout, JSON.stringify({
      decision: 'block',
      reason: `Tests failed:\n${testOutput}`,
    }))
    process.exit(2)
  }
}
```

To enable this, uncomment lines 59-99 in `.claude/hooks/PostToolUse.ts`.

### Try It (After uncommenting)

```text
Add a new function to hooks/useMovies.ts that breaks existing tests
```

### Observe

- [ ] Tests run automatically after the edit
- [ ] Failing tests block the edit
- [ ] Claude sees the test output
- [ ] Claude can fix the implementation or tests

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

1. **Start simple** - Begin with echo, add complexity gradually
2. **Use timeouts** - Prevent hooks from hanging forever
3. **Filter wisely** - Only run checks on relevant files
4. **Provide feedback** - Use `console.error()` for messages Claude sees
5. **Block sparingly** - Only block for critical failures
6. **Test your hooks** - Make sure they work before relying on them

---

## Observe

After setting up hooks, you should see:

- [ ] Automatic linting after every TypeScript file edit
- [ ] Lint errors sent back to Claude for fixing
- [ ] (Optional) Tests running automatically
- [ ] Faster development loop - no manual checking needed
- [ ] Higher code quality - catches issues immediately

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
