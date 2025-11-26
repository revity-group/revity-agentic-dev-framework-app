---
layout: default
title: 1. Setup & Shortcuts
nav_order: 3
---

# Section 1: Setup & Shortcuts

Get your development environment and Claude Code installed, then learn the essential shortcuts.

---

## Install Flox

Flox manages your development environment, ensuring everyone has the same setup across all platforms.

```bash
# Install Flox (macOS/Linux)
curl -fsSL https://flox.dev/install | bash

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
4. **Project dependencies** - Runs `bun install` automatically via hook

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
You can open it using `Cmd+Escape` but if you prefer cli you can connect it using `/ide` command.

---

### Tips & Tricks

| Action | How |
|--------|-----|
| **Open Claude instantly** | `Cmd+Escape` opens the panel. Prefer terminal? Run `claude` from an editor terminal |
| **Reconnect IDE bridge** | If you see "IDE disconnected," type `/ide` in Claude terminal to re-establish context |
| **Create a new terminal on side panel** | Open key binding `cmd+shift+p`, search for `create new terminal` , select `create new  terminal in editor area to the side` and add `cmd+t` |
| **Demostrate how auto adding files to context works** | Open a file and you will see it auto adds to context. You can also select lines within the same file to add to context. |
| **Setup key binding to include selected lines into context** | I use `cmd+option+k` to include selected lines into context. You can ad this keybinding to claude-code.insertAtMentioned  |


## Claude code shortcuts & tips

| Action | How |
|--------|-----|
| **Continue from previous session** | `claude --continue` |
| **Rewind to previous checkpoints** | `double Escape` |
| **Add selected lines to context** | `cmd+option+k` |
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
- Add the following content to the file: Installs status line : [https://github.com/sirmalloc/ccstatusline]

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
  - Choose settings local 
  - Then you will see a file called `.claude/settings.local.json`

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
            "Read(./config/credentials.json)",
            "Read(./build)"
        ]
    },
    "alwaysThinkingEnabled": true
}
```

```json

# settings.local.json
{
    "permissions": {
        "allow": ["Read(//Users/alireza/.claude/**)"],
        "ask": [],
        "deny": []
    }
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
