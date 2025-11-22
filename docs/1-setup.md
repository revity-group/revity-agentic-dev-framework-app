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
# Install globally via npm
npm install -g @anthropic-ai/claude-code

# Or via Homebrew (macOS)
brew install claude-code

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

On first launch, you'll be prompted for your Anthropic API key.

---

## Essential Shortcuts

Master these shortcuts to work efficiently:

### Navigation & Control

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Stop Claude mid-response |
| `Escape` | Clear current input |
| `Ctrl+L` | Clear screen |
| `/clear` | Clear conversation history |
| `/compact` | Summarize & reduce context |
| `/help` | Show all commands |

### Input

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift+Enter` | New line (multi-line input) |
| `Tab` | Accept autocomplete suggestion |
| `↑` / `↓` | Navigate command history |

### File References

| Syntax | What it does |
|--------|--------------|
| `@filename` | Reference a specific file |
| `@folder/` | Reference a folder |
| `#symbolName` | Reference a code symbol |

---

## Useful Commands

```bash
# Show current settings
/config

# Show active model
/model

# Change model
/model claude-sonnet-4-5-20250929

# Show cost of current session
/cost
```

---

## VS Code Integration

Connect Claude Code to your IDE for automatic context awareness.

### Install the Extension

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X`)
3. Search for "Claude Code"
4. Click Install

### Launch Claude Code in VS Code

- **Shortcut**: `Cmd+Esc` (Mac) / `Ctrl+Esc` (Windows/Linux)
- **Command Palette**: `Cmd+Shift+P` → "Claude Code: Open"

### Why Use the IDE Integration?

When connected to VS Code, Claude Code gets **automatic context**:

| Context | What Claude Sees |
|---------|------------------|
| **Open file** | The file you're currently editing |
| **Selection** | Any highlighted code |
| **Cursor position** | Where you're working |
| **Visible files** | Files open in your tabs |
| **Diagnostics** | Errors and warnings from your linter/compiler |

### Context in Action

Try this:
1. Open a file in VS Code (e.g., `app/page.tsx`)
2. Highlight some code
3. Open Claude Code (`Cmd+Esc`)
4. Ask: "What does this do?"

Claude will know exactly what code you're referring to - no copy-pasting needed!

### Terminal vs IDE

| Feature | Terminal (`claude`) | VS Code Extension |
|---------|--------------------|--------------------|
| Works anywhere | ✅ | VS Code only |
| Auto file context | ❌ (use `@file`) | ✅ Automatic |
| See selections | ❌ | ✅ |
| Inline diagnostics | ❌ | ✅ |
| Same core features | ✅ | ✅ |

**Recommendation**: Use VS Code integration when actively coding, terminal for quick tasks.

---

## Verify Your Setup

Before moving on, make sure:

- [ ] Claude Code CLI is installed (`claude --version` works)
- [ ] You can launch it in the terminal (`claude` in project root)
- [ ] VS Code extension is installed and opens (`Cmd+Esc`)
- [ ] The movie app runs (`bun dev` → visit http://localhost:3000)

---

## Try It Out

Ask Claude Code something simple to verify it's working:

```
What files are in this project?
```

or

```
Explain what this project does
```

---

[← Back to Overview](./index.md) | [Next: Baseline Task →](./2-baseline.md)
