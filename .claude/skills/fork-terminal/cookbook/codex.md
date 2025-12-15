# Codex CLI Cookbook

## Installation

```bash
brew install codex
```

## Authentication

Run `codex` and sign in with ChatGPT, or set `OPENAI_API_KEY`.

## Command

```bash
codex "<task>"
```

## Models

| Model | Use For |
|-------|---------|
| `codex-mini` | Default, fast CLI |
| `o4-mini` | Balanced reasoning |
| `o3` | Complex problems |

```bash
codex --model codex-mini "<task>"
```

## Flags

| Flag | Description |
|------|-------------|
| `--model <model>` | Specify model |
| `--approval-mode full-auto` | Auto-approve actions |
| `--quiet` | Less output |
