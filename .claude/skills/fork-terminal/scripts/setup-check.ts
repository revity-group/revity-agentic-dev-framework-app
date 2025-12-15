#!/usr/bin/env bun
/**
 * Setup Check - Verifies dependencies for fork-terminal skill
 *
 * Usage: bun run setup-check.ts
 */

import { $ } from "bun";

interface Dependency {
  name: string;
  command: string;
  installCmd: string;
  required: boolean;
}

const dependencies: Dependency[] = [
  {
    name: "Homebrew",
    command: "brew --version",
    installCmd: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
    required: true,
  },
  {
    name: "Claude Code",
    command: "claude --version",
    installCmd: "brew install claude-code",
    required: false,
  },
  {
    name: "Gemini CLI",
    command: "gemini --version",
    installCmd: "brew install gemini-cli",
    required: false,
  },
  {
    name: "Codex CLI",
    command: "codex --version",
    installCmd: "brew install codex",
    required: false,
  },
];

async function checkCommand(command: string): Promise<boolean> {
  try {
    await $`sh -c ${command}`.quiet();
    return true;
  } catch {
    return false;
  }
}

async function checkAccessibility(): Promise<boolean> {
  // Try a simple AppleScript that requires accessibility
  const testScript = `
    tell application "System Events"
      return name of first process
    end tell
  `;
  try {
    await $`osascript -e ${testScript}`.quiet();
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("Fork Terminal - Setup Check");
  console.log("════════════════════════════\n");

  // Platform check
  if (process.platform !== "darwin") {
    console.log("❌ Platform: This skill only works on macOS");
    console.log("   Your platform:", process.platform);
    process.exit(1);
  }
  console.log("✅ Platform: macOS detected\n");

  // Bun check (if we got here, Bun is working)
  console.log("✅ Bun: Installed (you're running this script)\n");

  // Check dependencies
  console.log("Checking dependencies...\n");

  const missing: Dependency[] = [];
  const installed: string[] = [];

  for (const dep of dependencies) {
    const exists = await checkCommand(dep.command);
    if (exists) {
      console.log(`✅ ${dep.name}: Installed`);
      installed.push(dep.name);
    } else {
      console.log(`❌ ${dep.name}: Not found`);
      missing.push(dep);
    }
  }

  // Check accessibility
  console.log("\nChecking Accessibility permissions...");
  const hasAccessibility = await checkAccessibility();
  if (hasAccessibility) {
    console.log("✅ Accessibility: Granted\n");
  } else {
    console.log("❌ Accessibility: Not granted\n");
  }

  // Summary
  console.log("────────────────────────────");
  console.log("Summary\n");

  if (missing.length === 0 && hasAccessibility) {
    console.log("🎉 All dependencies satisfied! You're ready to use fork-terminal.\n");
    process.exit(0);
  }

  // Show what needs to be done
  const requiredMissing = missing.filter((d) => d.required);
  const optionalMissing = missing.filter((d) => !d.required);

  if (requiredMissing.length > 0) {
    console.log("Required dependencies missing:\n");
    for (const dep of requiredMissing) {
      console.log(`  ${dep.name}:`);
      console.log(`    ${dep.installCmd}\n`);
    }
  }

  if (optionalMissing.length > 0) {
    console.log("Optional (install at least one agent):\n");
    for (const dep of optionalMissing) {
      console.log(`  ${dep.name}:`);
      console.log(`    ${dep.installCmd}\n`);
    }
  }

  if (!hasAccessibility) {
    console.log("Accessibility permissions required:\n");
    console.log("  1. Open System Settings");
    console.log("  2. Go to Privacy & Security → Accessibility");
    console.log("  3. Enable access for Cursor (or your terminal app)\n");
  }

  // Quick install command
  if (optionalMissing.length > 0 && !requiredMissing.some((d) => d.name === "Homebrew")) {
    console.log("Quick install all agents:");
    console.log("  brew install claude-code gemini-cli codex\n");
  }

  process.exit(1);
}

main();
