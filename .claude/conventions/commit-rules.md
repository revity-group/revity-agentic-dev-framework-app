# Commit Rules

Review the changes above and commit using conventional commit format:

```text
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

Scope: Use folder/feature name (e.g., `auth`, `api`, `ui`). Omit if change is broad.

For breaking changes, add \`\`!\`\` after type: `feat(api)!: remove deprecated endpoint`

If changes are unrelated, split into logical commits. Otherwise, one commit is fine.

Never mention AI / Claude in the commit message.

Prefer one line commit message if feasible. If not, use multiple lines to describe the changes. but keep it under 50 words.