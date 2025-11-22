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

## VS Code Integration (Optional)

If using VS Code, you can also use the Claude Code extension:

1. Install "Claude Code" extension
2. `Cmd+Shift+P` → "Claude Code: Open"
3. Same features, integrated in your editor

---

## Verify Your Setup

Before moving on, make sure:

- [ ] Claude Code is installed (`claude --version` works)
- [ ] You can launch it in the project (`claude` in project root)
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
