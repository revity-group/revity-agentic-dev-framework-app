#!/usr/bin/env bun
/**
 * Fork Terminal - Opens a new terminal tab in Cursor (macOS only)
 * Also supports detecting running agents and injecting messages into them.
 *
 * Usage:
 *   bun run fork-terminal.ts "claude --print 'task'"    # Spawn new terminal
 *   bun run fork-terminal.ts --inject gemini "task"     # Inject into running gemini
 *   bun run fork-terminal.ts --list                     # List running agents
 */

import { $ } from "bun";

interface RunningAgent {
  name: string;
  pid: number;
  tty: string | null;
}

async function findRunningAgents(): Promise<RunningAgent[]> {
  const agents: RunningAgent[] = [];
  const agentPatterns = [
    { name: "gemini", pattern: "gemini" },
    { name: "codex", pattern: "codex" },
    { name: "claude", pattern: "claude" },
  ];

  for (const agent of agentPatterns) {
    try {
      // Find processes matching the agent pattern
      const result =
        await $`ps aux | grep -E "[${agent.pattern[0]}]${agent.pattern.slice(1)}" | grep -v "fork-terminal"`.text();
      const lines = result.trim().split("\n").filter(Boolean);

      for (const line of lines) {
        const parts = line.split(/\s+/);
        const pid = parseInt(parts[1], 10);
        if (!isNaN(pid)) {
          // Try to get the TTY for this process
          let tty: string | null = null;
          try {
            const ttyResult = await $`ps -o tty= -p ${pid}`.text();
            tty = ttyResult.trim() || null;
          } catch {
            // TTY not found
          }

          agents.push({ name: agent.name, pid, tty });
        }
      }
    } catch {
      // No matching processes found
    }
  }

  return agents;
}

async function injectIntoAgent(
  agentName: string,
  message: string
): Promise<boolean> {
  if (process.platform !== "darwin") {
    console.error("This script only supports macOS");
    return false;
  }

  const agents = await findRunningAgents();
  const targetAgent = agents.find(
    (a) => a.name.toLowerCase() === agentName.toLowerCase()
  );

  if (!targetAgent) {
    console.error(`No running ${agentName} agent found.`);
    console.log("Running agents:", agents.length > 0 ? agents : "none");
    return false;
  }

  console.log(`Found running ${agentName} (PID: ${targetAgent.pid})`);

  const escapedMessage = message.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  // Use AppleScript to find the terminal with the agent and inject the message
  // Use clipboard paste for reliability instead of keystroke
  const applescript = `
    set the clipboard to "${escapedMessage}"
    tell application "Cursor"
      activate
    end tell
    delay 0.5
    tell application "System Events"
      tell process "Cursor"
        -- Paste from clipboard (much more reliable than keystroke)
        keystroke "v" using command down
        delay 0.2
        keystroke return
      end tell
    end tell
  `;

  try {
    await $`osascript -e ${applescript}`.quiet();
    console.log(`Injected message into ${agentName}: ${message}`);
    return true;
  } catch (error) {
    const errorMsg = String(error);
    if (errorMsg.includes("1002") || errorMsg.includes("not allowed")) {
      console.error("Error: Accessibility permissions required.");
      console.error(
        "Grant permission in: System Settings → Privacy & Security → Accessibility"
      );
    } else {
      console.error("Error injecting message:", error);
    }
    return false;
  }
}

async function forkTerminal(command: string): Promise<boolean> {
  if (process.platform !== "darwin") {
    console.error("This script only supports macOS");
    return false;
  }

  const escapedCommand = command.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  // Use clipboard paste for reliability instead of keystroke
  const applescript = `
    set the clipboard to "${escapedCommand}"
    tell application "Cursor"
      activate
    end tell
    delay 0.3
    tell application "System Events"
      keystroke "t" using {command down}
      delay 2
      tell process "Cursor"
        keystroke "v" using command down
        delay 0.2
        keystroke return
      end tell
    end tell
  `;

  try {
    await $`osascript -e ${applescript}`.quiet();
    return true;
  } catch (error) {
    const errorMsg = String(error);
    if (errorMsg.includes("1002") || errorMsg.includes("not allowed")) {
      console.error("Error: Accessibility permissions required.");
      console.error(
        "Grant permission in: System Settings → Privacy & Security → Accessibility"
      );
    } else {
      console.error("Error spawning terminal:", error);
    }
    return false;
  }
}

/**
 * Special spawn for Gemini: starts `gemini` in interactive mode,
 * waits for it to initialize, then injects the message.
 */
async function forkGeminiTerminal(message: string): Promise<boolean> {
  if (process.platform !== "darwin") {
    console.error("This script only supports macOS");
    return false;
  }

  console.log("Starting Gemini in interactive mode...");

  // Step 1: Open new terminal and run `gemini` (no arguments = interactive mode)
  const applescriptSpawn = `
    set the clipboard to "gemini"
    tell application "Cursor"
      activate
    end tell
    delay 0.3
    tell application "System Events"
      keystroke "t" using {command down}
      delay 2
      tell process "Cursor"
        keystroke "v" using command down
        delay 0.2
        keystroke return
      end tell
    end tell
  `;

  try {
    await $`osascript -e ${applescriptSpawn}`.quiet();
    console.log("Gemini starting, waiting 10 seconds for initialization...");
  } catch (error) {
    const errorMsg = String(error);
    if (errorMsg.includes("1002") || errorMsg.includes("not allowed")) {
      console.error("Error: Accessibility permissions required.");
      console.error(
        "Grant permission in: System Settings → Privacy & Security → Accessibility"
      );
    } else {
      console.error("Error spawning Gemini terminal:", error);
    }
    return false;
  }

  // Step 2: Wait 10 seconds for Gemini to initialize
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Step 3: Inject the message into Gemini
  console.log("Injecting message into Gemini...");
  const escapedMessage = message.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  const applescriptInject = `
    set the clipboard to "${escapedMessage}"
    tell application "Cursor"
      activate
    end tell
    delay 0.5
    tell application "System Events"
      tell process "Cursor"
        keystroke "v" using command down
        delay 0.2
        keystroke return
      end tell
    end tell
  `;

  try {
    await $`osascript -e ${applescriptInject}`.quiet();
    console.log(`Injected message into Gemini: ${message}`);
    return true;
  } catch (error) {
    const errorMsg = String(error);
    if (errorMsg.includes("1002") || errorMsg.includes("not allowed")) {
      console.error("Error: Accessibility permissions required.");
      console.error(
        "Grant permission in: System Settings → Privacy & Security → Accessibility"
      );
    } else {
      console.error("Error injecting into Gemini:", error);
    }
    return false;
  }
}

async function listRunningAgents(): Promise<void> {
  const agents = await findRunningAgents();

  if (agents.length === 0) {
    console.log("No running AI agents detected.");
    console.log("\nSupported agents: claude, gemini, codex");
    return;
  }

  console.log("Running AI Agents:");
  console.log("──────────────────");
  for (const agent of agents) {
    console.log(`  ${agent.name.padEnd(10)} PID: ${agent.pid}`);
  }
  console.log("\nTo inject a message:");
  console.log(
    '  bun run fork-terminal.ts --inject <agent> "your message here"'
  );
}

function printHelp(): void {
  console.log(`
Fork Terminal - Spawn terminals or inject into running agents

Usage:
  fork-terminal.ts <command>                    Spawn new terminal with command
  fork-terminal.ts --inject <agent> "message"   Inject message into running agent
  fork-terminal.ts --list                       List running AI agents
  fork-terminal.ts --help                       Show this help

Examples:
  fork-terminal.ts "claude --print 'Fix the bug'"
  fork-terminal.ts --inject gemini "Analyze the codebase"
  fork-terminal.ts --inject codex "Write tests for hooks/"
  fork-terminal.ts --list

Supported agents: claude, gemini, codex
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  if (args[0] === "--list" || args[0] === "-l") {
    await listRunningAgents();
    process.exit(0);
  }

  if (args[0] === "--inject" || args[0] === "-i") {
    if (args.length < 3) {
      console.error("Usage: fork-terminal.ts --inject <agent> <message>");
      console.error('Example: fork-terminal.ts --inject gemini "your task"');
      process.exit(1);
    }
    const agentName = args[1];
    const message = args.slice(2).join(" ");
    const success = await injectIntoAgent(agentName, message);
    process.exit(success ? 0 : 1);
  }

  // Default: spawn new terminal
  const command = args.join(" ");

  // Check if this is a Gemini command - use special spawn flow
  const geminiMatch = command.match(
    /^gemini\s+(?:-i\s+)?["']?(.+?)["']?$|^gemini\s+(.+)$/i
  );
  if (geminiMatch) {
    const message = geminiMatch[1] || geminiMatch[2];
    const success = await forkGeminiTerminal(message);
    if (success) {
      console.log(`Forked Gemini terminal with message: ${message}`);
      process.exit(0);
    } else {
      process.exit(1);
    }
  }

  // For all other commands, use standard fork
  const success = await forkTerminal(command);

  if (success) {
    console.log(`Forked Cursor terminal with command: ${command}`);
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
