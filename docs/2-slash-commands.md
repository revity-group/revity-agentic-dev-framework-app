# 2. Slash Commands

## Checkout Checkpoint (Section 2)

```bash
git switch --detach codex/02-slash-commands
```

Goal: control Codex sessions faster with built-in CLI slash commands.

## Why This Matters

- Keeps you in the terminal while changing model, permissions, and session state.
- Reduces friction during live demos and workshop facilitation.
- Improves consistency when reviewing changes and managing context.

Reference: [OpenAI Codex CLI slash commands](https://developers.openai.com/codex/cli/slash-commands).

## Most Important Commands

- `/status`: see active model, approval policy, writable roots, and token usage.
- `/model`: switch model (and reasoning effort when supported).
- `/permissions`: change approval behavior mid-session.
- `/mention`: attach specific files/folders to the conversation.
- `/diff`: inspect current Git diff, including untracked files.
- `/compact`: summarize long chat history to free context.
- `/plan`: switch to plan mode (optionally with inline prompt text).
- `/review`: ask Codex to review your working tree.
- `/new`: start a fresh conversation in the same CLI session.
- `/resume`: continue a saved conversation.
- `/init`: scaffold `AGENTS.md` in the current directory.
- `/mcp`: list available MCP tools.

Notes:
- `/quit` and `/exit` both close the CLI session.
- `/approvals` still works as an alias, but it is no longer shown in the slash popup.

## Demo Steps

1. Start with `/status` to confirm current model and permissions.
2. Run `/model` if you need to change model before the task.
3. Run `/permissions` to set the desired approval level.
4. Use `/mention <path>` to focus Codex on relevant files.
5. After edits, run `/diff` and `/review`.
6. Run `/init` to scaffold an `AGENTS.md` placeholder for this repository.
7. If context grows too large, run `/compact`.
8. Use `/new` for a fresh task or `/resume` to continue prior work.

## Team Guidance

- Standardize facilitator flow around `/status` -> `/permissions` -> `/mention` -> `/diff`.
- Teach `/compact` early to avoid context-window issues in long sessions.
- Use `/init` to bootstrap `AGENTS.md` quickly, then copy in project-specific guidance during the next section.
- Keep `/mcp` in your checklist when demos depend on external tools.

[Back: Baseline](./1-baseline.md) | [Next: AGENTS.md guidance](./3-agents-md.md)
