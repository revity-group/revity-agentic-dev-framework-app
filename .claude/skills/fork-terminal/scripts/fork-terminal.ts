#!/usr/bin/env bun
/**
 * Fork Terminal - Opens a new terminal tab in Cursor (macOS only)
 *
 * Uses Cmd+T to open a new terminal tab and executes the given command.
 *
 * Usage:
 *   bun run fork-terminal.ts "claude"
 *   bun run fork-terminal.ts "gemini 'Analyze this codebase'"
 */

import { $ } from "bun";

async function forkTerminal(command: string): Promise<boolean> {
  if (process.platform !== "darwin") {
    console.error("This script only supports macOS");
    return false;
  }

  const escapedCommand = command.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  const applescript = `
    tell application "Cursor"
      activate
    end tell
    delay 0.3
    tell application "System Events"
      keystroke "t" using {command down}
      delay 5
      keystroke "${escapedCommand}"
      keystroke return
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

async function main() {
  const command = process.argv[2];

  if (!command) {
    console.error("Usage: bun run fork-terminal.ts <command>");
    console.error('Example: bun run fork-terminal.ts "claude"');
    process.exit(1);
  }

  const success = await forkTerminal(command);

  if (success) {
    console.log(`Forked Cursor terminal with command: ${command}`);
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
