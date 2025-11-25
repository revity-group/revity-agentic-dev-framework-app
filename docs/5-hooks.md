---
layout: default
title: 5. Hooks
nav_order: 7
---

# Section 5: Hooks

Run shell commands at key points in Claude's lifecycle.

---

## What Are Hooks?

Hooks are shell commands that execute automatically when specific events happen in Claude Code. They let you:

- Get notified when Claude needs your attention
- Run validation before commands execute
- Log or audit Claude's actions

---

## The Frictionless Workflow

The goal: Claude works autonomously on safe operations, but pings you when it needs approval.

```text
┌─────────────────────────────────────────────────────┐
│  Allowlist (auto-approved)    │  Everything Else    │
│  ─────────────────────────    │  ────────────────   │
│  bun build                    │  git push           │
│  git add                      │  rm -rf             │
│  git commit                   │  curl               │
│  Read/Edit files              │  npm publish        │
│                               │                     │
│  → Runs silently              │  → Notification!    │
└─────────────────────────────────────────────────────┘
```

---

## Step 1: Set Up the Allowlist

Create or update `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(bun:*)",
      "Bash(bunx:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Read",
      "Edit",
      "Write"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

**What this means:**

- `Bash(bun:*)` - Any bun command is auto-approved
- `Bash(git add:*)` - Staging files is auto-approved
- `git push` is NOT listed - requires approval (triggers notification)

---

## Step 2: Add Notification Hook

Add the hooks section to `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [],
    "deny": [],
    "hooks": {
      "Notification": [
        {
          "hooks": [
            {
              "type": "command",
              "command": "osascript -e 'display notification \"Claude needs your attention\" with title \"Claude Code\" sound name \"Blow\"'"
            }
          ]
        }
      ]
    }
  }
}
```

This uses macOS's built-in notification system. You'll hear a sound and see a notification when Claude needs you.

---

## Try It: The Non-Overlapping Demo

This demo shows the allowlist + notification combo without touching git commit workflows.

### Scenario 1: Allowed Command (Silent)

```text
Run the build and tell me if there are any errors
```

**What happens:**

1. Claude runs `bun build`
2. `Bash(bun:*)` matches the allowlist
3. Command runs immediately - no notification, no prompt
4. You see the output

### Scenario 2: Blocked Command (Notification)

```text
Push to origin
```

**What happens:**

1. Claude wants to run `git push origin main`
2. `git push` is NOT on the allowlist
3. Notification fires - you hear "Blow" sound
4. Claude waits for your approval in the terminal

---

## The Flow

```text
You: "Run the build"
     ↓
Claude: bun build        ← Auto-approved, runs silently
     ↓
You: "Push to origin"
     ↓
Claude: git push         ← Not on allowlist
     ↓
🔔 Notification: "Claude needs your attention"
     ↓
You: Return to terminal, approve or deny
```

---

## Advanced: TypeScript Notification Script

For richer notifications, create a script:

### Create the hook file

`.claude/hooks/notification.ts`:

```typescript
#!/usr/bin/env npx tsx
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

interface HookInput {
  notification_type?: string
  message?: string
}

function notify(title: string, message: string): void {
  const escaped = message.replace(/"/g, '\\"')
  const script = `display notification "${escaped}" with title "${title}" sound name "Ping"`
  try {
    execSync(`osascript -e '${script}'`, { stdio: 'ignore' })
  } catch {
    // Ignore failures
  }
}

function main(): void {
  const input: HookInput = JSON.parse(readFileSync(0, 'utf-8'))

  if (input.notification_type === 'permission_prompt') {
    notify('Claude Code - Permission', input.message || 'Approval needed')
  } else if (input.notification_type === 'idle_prompt') {
    notify('Claude Code - Waiting', input.message || 'Waiting for input')
  }
}

main()
```

### Update settings.json

```json
{
  "permissions": {
    "hooks": {
      "Notification": [
        {
          "hooks": [
            {
              "type": "command",
              "command": "npx tsx \"$CLAUDE_PROJECT_DIR/.claude/hooks/notification.ts\"",
              "timeout": 5
            }
          ]
        }
      ]
    }
  }
}
```

---

## Observe

- [ ] `bun build` runs without any prompt or notification
- [ ] `git push` triggers a desktop notification
- [ ] You can work on other tasks while Claude runs allowed commands
- [ ] You only get interrupted when approval is actually needed

---

## Catch Up

```bash
git checkout workshop/section-5-hooks
```

---

[← Back to Slash Commands](./4-commands.md) | [Next: MCP Servers →](./6-mcp.md)
