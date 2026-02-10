# 4. MCP (Model Context Protocol)

## Checkout Checkpoint (Section 4)

```bash
git switch --detach codex/04-mcp
```

Goal: show how external tools/services expand Codex capabilities.

## Why GitHub MCP for This Workshop

- It demonstrates capability beyond local Git operations.
- It enables issue/PR/repository workflows directly from Codex.
- It creates a clear before/after demo: local code context vs live GitHub context.

Reference: [OpenAI Codex MCP docs](https://developers.openai.com/codex/mcp).

## Setup: GitHub MCP (Remote HTTP)

Prerequisites:
- GitHub Personal Access Token (PAT) with least-privilege scopes for your demo.
- Codex CLI installed and authenticated.

Option A: Add via CLI

```bash
codex mcp add github --url https://api.githubcopilot.com/mcp/
```

Then complete PAT setup:

1. Create a GitHub PAT at:
   `https://github.com/settings/personal-access-tokens`
2. Export the token locally:

```bash
export CODEX_GITHUB_PERSONAL_ACCESS_TOKEN=github_pat_...
```
3. Edit `.codex/config.toml` to reference the env var:

```toml
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
bearer_token_env_var = "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"
```

Option B: Add via config file (`~/.codex/config.toml` or project `.codex/config.toml` in trusted projects)

```toml
[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
bearer_token_env_var = "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"
```

Notes:
- CLI and IDE extension share the same MCP configuration.
- Keep tokens out of version control.

## Verify Configuration

1. Run `codex mcp list` and confirm `github` is configured.
2. Inside Codex TUI, run `/mcp` and confirm GitHub tools are available.
3. Test with a simple prompt: `List my GitHub repositories`.

## Demo Pattern

1. Start with a task that needs GitHub data (for example: "Summarize open PR risks in this repo").
2. Run without MCP first and note limitations.
3. Enable GitHub MCP and re-run the same task.
4. Compare depth, accuracy, and actionability.

## High-Value Demo Prompts

- `List open pull requests in <owner>/<repo> and group them by risk level.`
- `Find failed GitHub Actions runs in <owner>/<repo> from the last 24 hours and suggest likely fixes.`
- `Create a draft issue in <owner>/<repo> summarizing flaky test failures from recent runs.`
- `Review PR #<number> in <owner>/<repo> and propose focused follow-up tasks.`

## Workshop Prompt: Implement Issue #11 via MCP

Use this prompt in Codex to demonstrate MCP + local implementation in one flow:

```text
Implement GitHub issue #11.
```

## Discussion Points

- Capability gains vs security/privacy tradeoffs.
- Scope and permission controls.
- Choosing trusted MCP servers and minimal required access.
- PAT scope minimization and token rotation practices.

## Cleanup (Optional)

```bash
codex mcp remove github
```

Additional reference for GitHub-specific setup: [GitHub MCP Server - Codex install guide](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-codex.md).

[Back: AGENTS.md guidance](./3-agents-md.md) | [Next: Skills](./5-skills.md)
