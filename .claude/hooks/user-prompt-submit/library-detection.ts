/**
 * LibraryDetection Hook - Detects technology mentions and injects Context7 instructions
 *
 * Dynamically reads dependencies from the project's package manifest file
 * (package.json, requirements.txt, Cargo.toml, etc.) and detects when users
 * mention those libraries in their prompts.
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface DependencyFile {
  filename: string
  parser: (content: string) => string[]
}

// Supported dependency files for different ecosystems
const DEPENDENCY_FILES: DependencyFile[] = [
  // JavaScript/TypeScript
  {
    filename: 'package.json',
    parser: (content: string) => {
      try {
        const pkg = JSON.parse(content)
        return [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.devDependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
        ]
      } catch {
        return []
      }
    },
  },
  // Python
  {
    filename: 'requirements.txt',
    parser: (content: string) => {
      return content
        .split('\n')
        .map((line) => line.split(/[=<>!~[\]]/)[0]?.trim() ?? '')
        .filter((pkg) => pkg && !pkg.startsWith('#') && !pkg.startsWith('-'))
    },
  },
  {
    filename: 'pyproject.toml',
    parser: (content: string) => {
      const deps: string[] = []
      // Match dependencies in [project.dependencies] or [tool.poetry.dependencies]
      const depMatch = content.match(/dependencies\s*=\s*\[([\s\S]*?)]/g)
      if (depMatch) {
        for (const match of depMatch) {
          const pkgs = match.match(/"([^"]+)"|'([^']+)'/g)
          if (pkgs) {
            deps.push(
              ...pkgs
                .map((p) => p.replace(/["']/g, '').split(/[=<>!~[\]]/)[0])
                .filter((p): p is string => p !== undefined)
            )
          }
        }
      }
      return deps
    },
  },
  // Rust
  {
    filename: 'Cargo.toml',
    parser: (content: string) => {
      const deps: string[] = []
      const inDeps =
        content.match(/\[dependencies]([\s\S]*?)(?=\[|$)/)?.[1] || ''
      const matches = inDeps.matchAll(/^(\w[\w-]*)\s*=/gm)
      for (const match of matches) {
        if (match[1]) deps.push(match[1])
      }
      return deps
    },
  },
  // Go
  {
    filename: 'go.mod',
    parser: (content: string) => {
      const deps: string[] = []
      const matches = content.matchAll(/^\s*(\S+)\s+v[\d.]+/gm)
      for (const match of matches) {
        // Extract package name from full path (e.g., github.com/gin-gonic/gin -> gin)
        if (match[1]) {
          const parts = match[1].split('/')
          const lastPart = parts[parts.length - 1]
          if (lastPart) deps.push(lastPart)
        }
      }
      return deps
    },
  },
  // Ruby
  {
    filename: 'Gemfile',
    parser: (content: string) => {
      const deps: string[] = []
      const matches = content.matchAll(/gem\s+['"]([^'"]+)['"]/g)
      for (const match of matches) {
        if (match[1]) deps.push(match[1])
      }
      return deps
    },
  },
  // PHP
  {
    filename: 'composer.json',
    parser: (content: string) => {
      try {
        const pkg = JSON.parse(content)
        return [
          ...Object.keys(pkg.require || {}),
          ...Object.keys(pkg['require-dev'] || {}),
        ].map((dep) => dep.split('/').pop() ?? dep)
      } catch {
        return []
      }
    },
  },
  // .NET
  {
    filename: '*.csproj',
    parser: (content: string) => {
      const deps: string[] = []
      const matches = content.matchAll(/PackageReference\s+Include="([^"]+)"/g)
      for (const match of matches) {
        if (match[1]) deps.push(match[1])
      }
      return deps
    },
  },
]

function getProjectDependencies(): string[] {
  const cwd = process.cwd()
  const allDeps: string[] = []

  for (const { filename, parser } of DEPENDENCY_FILES) {
    // Handle glob patterns like *.csproj
    if (filename.includes('*')) {
      // Skip glob patterns for now - would need fs.readdirSync
      continue
    }

    const filePath = join(cwd, filename)
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath, 'utf-8')
        const deps = parser(content)
        allDeps.push(...deps)
      } catch {
        // Silently skip files we can't read
      }
    }
  }

  return [...new Set(allDeps)]
}

// Common words to ignore - too generic to be meaningful
const IGNORED_WORDS = new Set([
  'js',
  'ts',
  'react',
  'vue',
  'angular',
  'node',
  'ui',
  'lib',
  'core',
  'utils',
  'util',
  'tools',
  'tool',
  'dev',
  'cli',
  'api',
  'app',
  'web',
  'plugin',
  'plugins',
  'config',
  'types',
  'type',
  'common',
  'shared',
])

function extractKeywords(name: string): string[] {
  // Extract meaningful keywords from package name
  // e.g., "@tanstack/react-query" -> ["tanstack", "query"]
  // e.g., "next" -> ["next"]
  // e.g., "@radix-ui/react-dialog" -> ["radix", "dialog"]

  const withoutAt = name.replace(/^@/, '')
  const parts = withoutAt.split(/[/\-_.]/) // Split on common separators

  return parts
    .map((p) => p.toLowerCase())
    .filter((p) => p.length >= 3) // Ignore very short parts
    .filter((p) => !IGNORED_WORDS.has(p)) // Ignore common words
}

function detectTechnologies(prompt: string): string[] {
  const dependencies = getProjectDependencies()
  const promptLower = prompt.toLowerCase()
  const detected: string[] = []

  for (const dep of dependencies) {
    const keywords = extractKeywords(dep)

    // Match if ANY keyword from the package name appears in the prompt
    const isMatch = keywords.some((keyword) => {
      const pattern = new RegExp(`\\b${keyword}\\b`, 'i')
      return pattern.test(promptLower)
    })

    if (isMatch) {
      detected.push(dep)
    }
  }

  return [...new Set(detected)]
}

async function getUserPrompt(): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
    return data.prompt || ''
  } catch {
    return ''
  }
}

// Main
const userPrompt = await getUserPrompt()
const detectedTechs = detectTechnologies(userPrompt)

if (detectedTechs.length > 0) {
  console.log(`
[Library/Technology Detection]
Technologies mentioned: ${detectedTechs.join(', ')}

IMPORTANT: U MUST Use Context7 MCP for up-to-date documentation before implementing:
1. Call mcp__context7__resolve-library-id to get the library ID
2. Call mcp__context7__get-library-docs with the resolved ID for current docs

Skip Context7 only if:
- The question is purely conceptual (no API details needed)
- You've already fetched docs for this library in this conversation
- The user explicitly asks not to look up documentation

*ALWAYS APPLY THIS STEP`)
}
