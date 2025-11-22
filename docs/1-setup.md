---
layout: default
title: 1. Setup & Shortcuts
nav_order: 2
---

# Section 1: Setup & Shortcuts

Get Claude Code installed and learn the essential shortcuts.

---

## Install Claude Code

```bash
# Install via curl (recommended)
curl -fsSL https://claude.ai/install.sh | bash

# Or via Homebrew (macOS)
brew install --cask claude-code

# Verify installation
claude --version
```

---

## First Launch

```bash
# Navigate to project
cd revity-workshop-app

# Launch Claude Code
claude
```

On first launch, you'll be prompted to authenticate with Claude Code and setup initial theme and settings.

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
| **Rewind to previous checkpoints (undo changes)** | `double Escape` |
| **Double tap on esc to choose previous commands** | `cmd+option+k` |
| **Jump to the end of the line** | `ctrl+e` |
| **Jump to the beginning of the line** | `ctrl+a` |
| **Delete a word** | `ctrl+w` |

---

[← Back to Overview](./index.md) | [Next: Baseline Task →](./2-baseline.md)
