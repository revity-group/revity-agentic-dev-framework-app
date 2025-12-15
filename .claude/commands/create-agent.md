---
description: Create a new custom agent for specialized tasks
argument-hint: <name> <description>
---

# Create Agent Command

Create a new custom agent with proper frontmatter and system prompt.

## Arguments

- `$1` (required): Agent name (lowercase-kebab-case, e.g., "code-reviewer")
- `$2+` (required): Description (when/how agent should be used)

Example:
```bash
/create-agent code-reviewer Expert at reviewing code for best practices and bugs
```

## Instructions

### Step 1: Validate Inputs

Check that:
- `$1` is provided and matches pattern: `^[a-z][a-z0-9-]*$` (lowercase, hyphens only)
- `$2+` (remaining args as description) is not empty
- Agent name doesn't contain spaces or special characters

If validation fails, show clear error and stop.

### Step 2: Parse Optional Flags (from description)

Look for these patterns in description and extract if present:
- `--user` → Create in `~/.claude/agents/` instead of `.claude/agents/`
- `--model=<model>` → Set model (sonnet, opus, haiku, inherit)
- `--tools=<tool1,tool2>` → Limit to specific tools

Remove flags from final description.

### Step 3: Set Paths and Check Existence

Determine file path:
```bash
# Default: project-level
AGENT_DIR=".claude/agents"
AGENT_FILE="${AGENT_DIR}/$1.md"

# If --user flag found:
AGENT_DIR="$HOME/.claude/agents"
AGENT_FILE="${AGENT_DIR}/$1.md"
```

Check if file exists:
```bash
if [ -f "$AGENT_FILE" ]; then
  echo "Agent '$1' already exists at: $AGENT_FILE"
  echo "Edit it directly or use a different name."
  exit 1
fi
```

### Step 4: Create Directory

```bash
mkdir -p "$AGENT_DIR"
```

### Step 5: Generate Agent File

Create the agent file with this structure:

```markdown
---
name: {name from $1}
description: {description from $2+, with flags removed}
{optional: tools: Tool1,Tool2,Tool3}
{optional: model: sonnet|opus|haiku|inherit}
---

You are a specialized agent for {infer purpose from description}.

## Your Role

{Expand on description to create 2-3 sentences about the agent's purpose}

## When Invoked

1. Understand the specific task or problem
2. Analyze relevant context using available tools
3. Execute your specialized function
4. Provide clear, actionable results

## Key Responsibilities

{Generate 3-5 bullet points based on description}

## Approach

- Be focused and efficient
- Follow established patterns and conventions
- Explain your reasoning
- Provide specific, actionable feedback
```

### Step 6: Write File and Confirm

Write the file using bash heredoc:

```bash
cat > "$AGENT_FILE" <<'AGENT_EOF'
{generated content from step 5}
AGENT_EOF
```

Then display:
```
Created agent: {name}
Location: {full path}
Usage: Invoke with "use the {name} agent to..."
```

## Examples

### Basic Project Agent

```bash
/create-agent code-reviewer Expert at reviewing code for best practices and common bugs
```

Creates: `.claude/agents/code-reviewer.md`

### User-Level Agent with Tools

```bash
/create-agent debugger Debugging specialist for test failures --user --tools=Read,Bash,Grep
```

Creates: `~/.claude/agents/debugger.md` with limited tools

### Agent with Specific Model

```bash
/create-agent docs-writer Technical documentation specialist --model=sonnet
```

Creates: `.claude/agents/docs-writer.md` using Sonnet model

## Implementation Notes

- Parse `$1` as name
- Join `$2 $3 $4...` as description
- Extract and remove flag patterns from description before using it
- Use `mkdir -p` to create directories safely
- Use bash heredoc for file creation
- All paths should be absolute in output

## Error Cases

- No arguments: "Usage: /create-agent <name> <description>"
- Invalid name format: "Agent name must be lowercase-kebab-case (e.g., 'my-agent')"
- Agent exists: "Agent already exists at {path}"
- Invalid flag values: "Invalid model '{value}'. Use: sonnet, opus, haiku, inherit"
