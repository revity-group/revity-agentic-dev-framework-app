---
layout: default
title: 1. Setup & Shortcuts
nav_order: 3
---

# Section 1: Setup & Shortcuts

Get your development environment and Claude Code installed, then learn the essential shortcuts.

---

## Install Flox

Flox manages your development environment, ensuring everyone has the same setup across all platforms. To install follow instructions at [flox.dev](https://flox.dev/docs/install-flox/install/)

```bash
# Verify installation
flox --version
```

Learn more at [flox.dev](https://flox.dev)

---

## Set Up Project Environment (One Command!)

```bash
# Navigate to project
cd revity-agentic-dev-framework-app

# Activate Flox environment (installs EVERYTHING automatically)
flox activate
```

### What Gets Installed Automatically

When you run `flox activate`, the environment installs:

1. **Node.js** - JavaScript runtime
2. **Bun** - Fast package manager and runtime
3. **Claude Code** - AI-powered coding assistant
4. **GitHub CLI (gh)** - GitHub command-line tool
5. **Project dependencies** - Runs `bun install` automatically via hook

That's it! No manual installation of tools needed. Everything your team needs is defined in `.flox/env/manifest.toml` and installed automatically.

---

## First Launch

```bash
# Make sure you're in the Flox environment (if not already activated)
flox activate

# Launch Claude Code (already installed by Flox!)
claude
```

On first launch, you'll be prompted to authenticate with Claude Code and setup initial theme and settings.

### Why This Works

The Flox manifest (`.flox/env/manifest.toml`) includes:
- All required packages (Node.js, Bun, Claude Code)
- An activation hook that runs `bun install` automatically
- Consistent versions across all team members and platforms

---

## IDE Integration (VS Code / Cursor)

To combine the power of Claude Code and IDEs, you'll need the VS Code extension. Once installed, the chat panel understands which active file you have open and auto adds it to the context. You can also select lines to add to the context.

---

### Install the Claude Code Extension

Open VS Code (or Cursor) and press `Cmd+Shift+X` to open the Extensions view
Search for **Claude Code for VSCode** and install the official Anthropic extension
You can open it using `Cmd+Escape` , however in this workshop we will be focusing on the CLI experience. So in order to connect the extension to claude code CLI, type slash command `/ide` and connect your IDE.

---

### Tips & Tricks + some preferences I find useful

| Action | How |
|--------|-----|
| **Open Claude instantly** | `Cmd+Escape` opens the panel. Prefer terminal? Run `claude` from an editor terminal |
| **Reconnect IDE bridge** | If you see "IDE disconnected," type `/ide` in Claude terminal to re-establish context |
| **Create a new terminal on side panel** | Open keybindings shortcuts with `cmd+shift+p`, search for `create new terminal` , select `create new  terminal in editor area to the side` and add `cmd+t`  - My preference is normally bottom terminal for development and top terminal for claude |
| **Demonstrate how auto adding files to context works** | Open a file and you will see it auto adds to context. You can also select lines within the same file to add to context. |
| **Setup key binding to include selected lines into context(surgical selection)** | I use `cmd+option+k` to include selected lines into context. You can add this keybinding to claude-code.insertAtMentioned  |

---

## Surgical Selection Demo: Multi-File API Validation

Now that you know how to select lines and add them to context, let's demonstrate the power of surgical selection with a practical example.

### The Problem: Missing Backend Validation

Our app has two API endpoints that only check if fields exist, but don't validate their values:
- `/api/reviews` - Accepts invalid emails, out-of-range ratings, and short reviews
- `/api/watchlist` - Accepts string movieIds and whitespace-only titles

### Step 1: Demonstrate the Vulnerability

Open the app in your browser (`bun dev`), open the browser console, and run:

```javascript
// Bypass review validation
fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    movieId: 1,
    movieTitle: "Test Movie",
    userName: " ",            // Just whitespace
    email: "notanemail",      // Invalid format
    rating: 999,              // Way out of range
    review: "x"               // Too short
  })
}).then(r => r.json()).then(console.log)

// Bypass watchlist validation
fetch('/api/watchlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    movieId: "abc",           // String instead of number
    movieTitle: "   ",        // Just whitespace
    posterPath: null
  })
}).then(r => r.json()).then(console.log)
```

Both requests succeed! Check `data/reviews.json` and `data/watchlist.json` - invalid data was saved.

### Step 2: Surgical Selection Fix

1. **Open both API files** in your IDE:
   - `app/api/reviews/route.ts`
   - `app/api/watchlist/route.ts`

2. **Select validation blocks:**
   - In `reviews/route.ts`: Select lines 46-54 (validation logic)
   - In `watchlist/route.ts`: Select lines 46-54 (validation logic)

3. **Add both selections to context** using `Cmd+Option+K` (or your configured keybinding)

4. **Prompt Claude:**

   ```text

   Add proper validation with specific error messages:
   - Reviews: validate email format, rating range 1-10, minimum review length 10 chars
   - Watchlist: validate movieId is a positive number, movieTitle is non-empty string
   - Both: return specific field-level error messages, make sure we show al fields that are not valid.
   ```

5. **Review the changes:** Claude will add coordinated validation to both files with specific, helpful error messages

6. **Test again:** MAke sure you delete the data folder from root, Run the same fetch commands - now they return proper validation errors!

This demonstrates how surgical selection allows Claude to understand relationships between files and make intelligent, coordinated improvements.

---

## Claude code shortcuts & tips

| Action | How |
|--------|-----|
| **Continue from previous session** | `claude --continue` |
| **Rewind to previous checkpoints** | `double Escape` |
| **Switch between plan / auto accept modes** | `shift+tab/+tab`|
| **Jump to the end of the line** | `ctrl+e` |
| **Jump to the beginning of the line** | `ctrl+a` |
| **Delete a word** | `ctrl+w` |
| **Open detailed AI response** | `ctrl+o` |

---

## Claude settings & configuration

1. Enterprise: `/etc/claude-code/managed-settings.json` (highest priority)
2. Project Local: `.claude/settings.local.json` (personal, git-ignored)
3. Project Shared: `.claude/settings.json` (team settings)
4. User Global: `~/.claude/settings.json` (personal defaults)

## Example of settings.json setup

### Personal user settings.json

- Create `~/.claude/settings.json` file if it doesnt exist: `mkdir -p ~/.claude && touch ~/.claude/settings.json`
- Add the following content to the file: Installs status line : [ccstatusline](https://github.com/sirmalloc/ccstatusline)

  ```json

  {
    "statusLine": {
      "type": "command",
      "command": "npx -y ccstatusline@latest",
      "padding": 0
    }
  }
  ```

  ### Project local and shared settings.json

  It is best practice to always set the project's deny list to avoid leaking sensitive information to the AI, in case of a rogue MCP or prompt poisoning

  - In claude run  `/permissions`
  - Tab over to deny and add permission rule `Read(./.env.*)`
  - Choose `Project Settings`
  - Then you will see a file called `.claude/settings.json`

A recommendation of sharable settings.json (shared with team) as well as settings.local.json (only project local) files is as follows:

```json

# settings.json
{
    "permissions": {
        "allow": [
            "Bash(grep:*)",
            "Bash(cat:*)",
            "Bash(mkdir:*)"
        ],
        "ask": [],
        "defaultMode": "acceptEdits",
        "deny": [
            "Read(./.env)",
            "Read(./.env.*)",
            "Read(./secrets/**)",
            "Read(./build)",
        ]
    }
}
```

```json

# settings.local.json
{
    "permissions": {
        "allow": ["Read(//Users/<username>/.claude/**)", "Write(//Users/<username>/.claude/**)"],
        "ask": [],
        "deny": []
    },
    "alwaysThinkingEnabled": true
}
```

Go ahead and add your local settings to gitignore. as this is specific to you and not your team

Now try asking claude to read the .env file

```text
Read the .env file
```

Claude should be denied to read the .env file.

---

## Catch Up

If you fell behind or want to see the completed setup:

```bash
git checkout workshop/section-1-setup
```

---

[← Back to Introduction](./0-intro.md) | [Next: Baseline Task →](./2-baseline.md)
