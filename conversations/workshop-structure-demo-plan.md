# Workshop Structure & Demo Plan

**Date:** 2023-11-23

---

## About This Workshop

This workshop teaches our team how to set up their development workflow with Claude Code. By the end, participants will transform Claude from a generic coding assistant into a project-aware development partner that knows their stack, follows team conventions, and automates repetitive tasks.

**Target Outcome:** Each team member leaves with a fully configured Claude Code environment that saves time, maintains code quality, and reduces context waste.

---

## Workshop Sections (5 hrs total)

1. Intro + Q&A (1 hr)
2. Claude Code Setup + Basics (30 min)
3. Hands-on: Commands, Hooks, MCP, Skills (2 hrs)
4. SDD with Pavel (1 hr)

---

## Section Progress

| Section | Status | Doc File |
|---------|--------|----------|
| 0. Introduction | ✅ Complete | `docs/0-intro.md` |
| 1. Setup & Shortcuts | ✅ Complete | `docs/1-setup.md` |
| 2. Baseline Task | ✅ Complete | `docs/2-baseline.md` |
| 3. CLAUDE.md | ✅ Complete | `docs/3-claude-memory.md` |
| 4. Slash Commands | ✅ Complete | `docs/4-commands.md` |
| 5. Hooks | ⏳ Pending | `docs/5-hooks.md` |
| 6. MCP Servers | ⏳ Pending | `docs/6-mcp.md` |

---

## What to Demo Per Section

| Section | What to Show | The "Aha" Moment |
|---------|--------------|------------------|
| **0. Introduction** | Presentation + Q&A | Understanding agentic workflows vs simple chat |
| **1. Setup** | CLI install, VS Code extension, shortcuts, permissions | Keyboard shortcuts save real time |
| **2. Baseline Task** | Infinite scroll with no setup | Claude ignores Shadcn, dumps logic in page.tsx |
| **3. CLAUDE.md** | Add project memory with `/init` | Same task now uses Shadcn, extracts hooks |
| **4. Commands** | `/commit`, `/review`, `/worktree-create` | Pre-loaded workflows = fewer tool calls |
| **5. Hooks** | Auto-format on edit | Lint runs automatically, no manual step |
| **6. MCP** | Shadcn MCP, GitHub MCP | Claude can browse/add components, create PRs |

---

## Section 4: Slash Commands - Planning

### What Are Slash Commands?

Reusable prompts stored as Markdown files in `.claude/commands/`. They let you invoke frequently-used workflows with a single command instead of re-typing instructions.

### Directory Structure

- **Project commands:** `.claude/commands/` (shared with team via git)
- **Personal commands:** `~/.claude/commands/` (user only, across all projects)

---

### Built-in Commands - What Each Solves

| Command | Problem It Solves | "Aha" Moment |
|---------|-------------------|--------------|
| `/init` | No project memory | Creates CLAUDE.md - persistent knowledge |
| `/compact` | Context bloat slowing things down | Smartly reduces context without losing everything |
| `/clear` | Need fresh start | Wipes context but keeps files safe |
| `/permissions` | Too many approval prompts | Auto-allow trusted tools, deny dangerous ones |
| `/model` | Wrong model for task | Switch Haiku↔Sonnet↔Opus mid-conversation |
| `/cost` | No visibility into token usage | See exactly what each message costs |
| `/doctor` | Something's broken, no idea what | Comprehensive health check with fixes |
| `/help` | Don't know what commands exist | Shows built-in + custom commands |

---

### Demo Flow: Creating Your First Custom Command

#### Step 1: Show the problem

```
> git add .
> "Now I need to write a commit message... what changed again?"
```

#### Step 2: Create `/commit` live

```bash
mkdir -p .claude/commands
```

Create `.claude/commands/commit.md`:

```markdown
---
description: Generate a commit message for staged changes
---

Look at my staged changes and write a conventional commit message.

Use this format:
type(scope): subject

Types: feat, fix, docs, style, refactor, test, chore

Keep the subject under 50 characters, imperative mood.
```

#### Step 3: Use it

```
> /commit
```

#### Step 4: The "Aha" moment

> "Claude already knew what I changed. I didn't have to explain anything."

---

### Advanced: Introducing Structured Commands

After participants understand the basics, show them `/create-command` - a meta-command that generates commands with consistent structure.

#### Why Structure Matters

| Scenario | Naive `/commit` | Structured `/commit` |
|----------|-----------------|----------------------|
| **Works** | "Here's a commit message for your changes: `feat(ui): add button`..." | `STATUS=OK MESSAGE="feat(ui): add button"` |
| **No staged changes** | "I notice you haven't staged anything yet. Would you like me to..." | `STATUS=FAIL ERROR="no staged changes"` |

**The difference:** Naive works fine. Structured validates first and gives clean, parseable output instead of prose.

#### Demo: Rebuild `/commit` with `/create-command`

```
> /create-command commit "Generate commit message for staged changes"
```

Compare the outputs side-by-side. The structured version:
- Validates inputs before running
- Gives consistent `STATUS=OK|FAIL` output
- Handles edge cases explicitly

---

### Custom Command Features (Reference)

| Feature | Syntax | Use Case |
|---------|--------|----------|
| All arguments | `$ARGUMENTS` | `/fix-issue 123` → `$ARGUMENTS = "123"` |
| Positional args | `$1`, `$2`, `$3` | `/deploy prod v1.2` → `$1="prod"`, `$2="v1.2"` |
| Run shell | `!git status` | Inject command output into prompt |
| Include file | `@package.json` | Include file contents in prompt |
| Metadata | Frontmatter YAML | `description`, `allowed-tools`, `model` |

---

### Advanced Commands for Later Exploration

These are pre-built commands participants can add to their projects after the workshop:

1. **`/create-command`** - Meta-command that generates structured commands
2. **`/create-md`** - Generates CLAUDE.md files for project and subdirectories

*(Full command files provided in workshop resources)*

---

## Key Insight: Why Setup Matters

- **Without setup:** Every prompt re-explains stack, Claude decides conventions
- **With setup:** Project knowledge persists, workflows standardized, quality checks automatic
- **Context savings:** Commands pre-inject context (0 tool calls vs 3-4)

---

## Still TODO

- [x] Create `docs/4-commands.md`
- [x] Build `/commit` command in `.claude/commands/`
- [ ] Build `/create-command` and `/create-md` advanced commands
- [ ] Create `docs/5-hooks.md`
- [ ] Create `docs/6-mcp.md`
- [ ] Set up Shadcn in project (not currently installed)
- [ ] Decide which subagents are worth demoing (if any)
