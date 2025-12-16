/**
 * UserPromptSubmit Hook - Runs before Claude processes each user message
 *
 * Use cases:
 * - Inject dynamic context (time, environment info, etc.)
 * - Add project-specific context to every prompt
 * - Validate or transform user input
 *
 * Communication pattern:
 * - Output to stdout (console.log): Sent to Claude as additional context
 * - No JSON response needed for this hook type (unlike PostToolUse)
 */

// Capture current timestamp when the user submits their prompt
const now = new Date()

// Detect system timezone and locale dynamically from the environment
// Falls back to 'en-AU' if locale detection fails
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en-AU'

// Build context string with formatted date/time info
// This gives Claude awareness of when the conversation is happening
const context = `
[Timezone Context]
- Current time: ${now.toLocaleString(locale, { timeZone: timezone })}
- Timezone: ${timezone}
- Day: ${now.toLocaleDateString(locale, { weekday: 'long', timeZone: timezone })}
`

// console.log output is sent to Claude as context
console.log(context)
