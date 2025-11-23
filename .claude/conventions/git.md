# Git Conventions

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or external dependencies |
| `ci` | CI configuration files and scripts |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

### Rules

- **Subject line**: Max 50 characters, imperative mood, no period
- **Body**: Wrap at 72 characters, explain *what* and *why* (not *how*)
- **Breaking changes**: Add `!` after type/scope or `BREAKING CHANGE:` in footer

### Examples

```
feat(auth): add OAuth2 login support

fix(api): handle null response from payment gateway

docs: update README with installation steps

refactor(utils)!: rename parseDate to formatDate

BREAKING CHANGE: parseDate function has been renamed
```

## Branch Naming

### Format

```
<type>/<ticket-id>-<short-description>
```

### Types

| Prefix | Purpose |
|--------|---------|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `hotfix/` | Urgent production fixes |
| `docs/` | Documentation updates |
| `refactor/` | Code refactoring |
| `test/` | Test additions/updates |
| `chore/` | Maintenance tasks |

### Rules

- Use lowercase and hyphens (kebab-case)
- Keep descriptions short but meaningful
- Include ticket/issue ID when applicable

### Examples

```
feature/AUTH-123-oauth-login
fix/BUG-456-null-pointer-exception
hotfix/payment-gateway-timeout
docs/update-api-reference
refactor/extract-validation-utils
```

## Pull Request Guidelines

### Title Format

Same as commit message subject:
```
<type>(<scope>): <description>
```

### Description Template

```markdown
## Summary
Brief description of changes

## Changes
- Change 1
- Change 2

## Test Plan
- [ ] Unit tests pass
- [ ] Manual testing completed

## Related Issues
Closes #123
```

## Git Workflow

1. Create branch from `main` using naming convention
2. Make atomic commits with conventional messages
3. Push and create PR with descriptive title/body
4. Squash merge to main (preserves clean history)
5. Delete branch after merge
