# Claude Code Cookbook

## Installation

```bash
npm install -g @anthropic-ai/claude-code
```

## Authentication

Run `claude` and follow the browser login, or set `ANTHROPIC_API_KEY`.

## Command

```bash
claude --print "<task>"
```

## Models

| Model | Use For |
|-------|---------|
| `haiku` | Quick fixes, simple tasks |
| `sonnet` | Default, most coding tasks |
| `opus` | Complex reasoning, code review |

```bash
claude --model haiku --print "<task>"
```

## Flags

| Flag | Description |
|------|-------------|
| `--print` | Non-interactive mode |
| `--model <model>` | haiku, sonnet, opus |
| `--dangerously-skip-permissions` | Auto-approve actions |
