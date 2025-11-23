---
description: Smart commit - analyze changes and create logical commits
---

Analyze my git state and help me create clean, logical commits.

## Conventions

@.claude/conventions/git.md

## Current State

**Staged changes:**
!git diff --staged --stat

**Unstaged changes:**
!git diff --stat

**Untracked files:**
!git ls-files --others --exclude-standard

## Your Task

1. Review what's staged vs unstaged
2. Decide: should these be one commit or split into multiple logical commits?
3. If splitting makes sense, tell me what to stage/unstage
4. Once we agree, write the commit message(s) following the conventions above
5. Execute the commit(s)

NOTE: always skip any mentions of Claude Code or any other AI assistant in the commit message. keep it below 50 characters and in imperative mood.