# Gemini CLI Cookbook

## Installation

```bash
brew install gemini-cli
```

## Authentication

Run `gemini` and follow the Google login, or set `GOOGLE_API_KEY`.

## Fork Terminal Spawn Behavior

When spawning Gemini via fork-terminal, the script uses a special flow:

1. Opens a new terminal tab
2. Runs `gemini` (interactive mode, no arguments)
3. Waits 10 seconds for Gemini to initialize
4. Injects the user's message into the running agent

This ensures Gemini is fully loaded before receiving the task.

## Commands

### One-shot mode (default)

```bash
gemini "<task>"
```

### Interactive mode

Use `-i` or `--prompt-interactive` to execute a prompt and stay in interactive mode:

```bash
gemini -i "<task>"
gemini --prompt-interactive "<initial prompt>"
```

### Pure interactive (no initial prompt)

```bash
gemini
```

## Models

| Model | Use For |
|-------|---------|
| `gemini-2.5-flash-lite` | Bulk ops, cheapest |
| `gemini-2.5-flash` | Default, fast |
| `gemini-3-pro` | Complex reasoning |

```bash
gemini --model gemini-2.5-flash "<task>"
```

## Flags

| Flag | Description |
|------|-------------|
| `-i, --prompt-interactive` | Execute prompt and continue in interactive mode |
| `-m, --model <model>` | Specify model |
| `-y, --yolo` | Skip all confirmations (auto-approve everything) |
| `--approval-mode <mode>` | Set approval: `default`, `auto_edit`, `yolo` |
| `-r, --resume <id>` | Resume previous session (`latest` or index) |
| `--list-sessions` | List available sessions |
| `-s, --sandbox` | Run in sandbox mode |
| `-d, --debug` | Enable debug output |

## Examples

```bash
# One-shot task
gemini "Analyze the API routes"

# Interactive session with initial context
gemini -i "Let's review the codebase together"

# Auto-approve edits only
gemini --approval-mode auto_edit "Refactor this component"

# Resume last session
gemini --resume latest

# Specific model + interactive
gemini -m gemini-3-pro -i "Help me architect this feature"
```
