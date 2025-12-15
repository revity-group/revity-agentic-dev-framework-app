# Gemini CLI Cookbook

## Installation

```bash
npm install -g @google/gemini-cli
```

## Authentication

Run `gemini` and follow the Google login, or set `GOOGLE_API_KEY`.

## Command

```bash
gemini "<task>"
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
| `--model <model>` | Specify model |
| `--yolo` | Skip confirmations |
