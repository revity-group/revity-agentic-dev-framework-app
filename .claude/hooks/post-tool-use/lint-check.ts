/**
 * PostToolUse Hook - Runs after Claude Code uses a tool (Edit, Write, Bash, etc.)
 *
 * Communication pattern:
 * - Input: Claude pipes hook context as JSON to stdin
 * - Output: Hook writes JSON response to stdout with `decision` and optionally `reason`
 *
 * Why Bun?
 * - Fast startup: Executes TypeScript directly without compilation
 * - Built-in APIs: Clean ergonomic APIs for stdin/stdout and process spawning
 */
import type { PostToolUseHookInput } from '@anthropic-ai/claude-agent-sdk'

// Read the JSON payload that Claude Code pipes via stdin
// Contains info about what tool was used, working directory, etc.
const input: PostToolUseHookInput = await Bun.stdin.json()

// Run linting synchronously in the project directory
// This checks if code still passes linting after Claude made changes
const result = Bun.spawnSync(['bun', 'lint'], { cwd: input.cwd })

// If linting fails, block the action and report errors back to Claude
if (result.exitCode !== 0) {
  const stdout = result.stdout.toString()
  const stderr = result.stderr.toString()
  const output = [stdout, stderr].filter(Boolean).join('\n').trim()

  // Output JSON with decision: 'block' tells Claude Code the action was problematic
  // The reason is shown to Claude so it can fix the lint errors
  await Bun.write(
    Bun.stdout,
    JSON.stringify({
      decision: 'block',
      reason: `Linting failed. Please fix errors:\n\n${output}`,
    })
  )
  process.exit(0) //JSON output is only processed when the hook exits with code 0. If your hook exits with code 2 (blocking error), stderr text is used directly—any JSON in stdout is ignored. For other non-zero exit codes, only stderr is shown to the user in verbose mode (ctrl+o).
}

// If linting passes, no JSON response needed - Claude continues normally
console.log('✅ Lint passed')
