---
layout: default
title: 7. SDD
nav_order: 9
---

# Section 7: Specification-Driven Development

## What is Specification-Driven Development?

Specification-Driven Development (SDD) is a software development approach that emphasizes creating detailed, structured specifications before writing code. Unlike traditional development where requirements might be scattered across tickets, conversations, or just in developers' heads, SDD puts the specification at the center of the development process.

### When to Use SDD (and When Not To)

**SDD is NOT a silver bullet.** It's important to choose the right tool for the job:

- **For Simple Tasks**: Skip SDD entirely. Simple bug fixes, minor UI tweaks, or straightforward features don't need formal specifications. The overhead of SDD would slow you down without providing meaningful value.

- **For Medium to Complex Features**: This is where spec-kit shines. Features that involve multiple components, have unclear requirements, or need coordination across team members benefit greatly from the structured SDD approach.

- **For Very Large, Complex Projects**: Consider using the [BMAD METHOD](https://github.com/bmad-code-org/BMAD-METHOD) (note: wait for version v6). BMAD provides a more comprehensive framework for large-scale software architecture and development.

Use your judgment: if writing a specification feels like overkill, it probably is.

### Core Principles

1. **Specification First**: Before writing any code, create a comprehensive specification that describes what you're building, why you're building it, and how it should work.

2. **Single Source of Truth**: The specification serves as the authoritative reference for the feature, reducing miscommunication and ensuring everyone is aligned.

3. **Artifact-Driven Workflow**: Generate implementation artifacts (plans, tasks, tests) directly from the specification, maintaining consistency throughout the development lifecycle.

4. **Iterative Refinement**: Specifications are living documents that evolve through clarification, feedback, and implementation insights.

### Benefits of SDD

- **Clarity**: Forces you to think through edge cases and requirements before coding
- **Alignment**: Ensures stakeholders, designers, and developers share the same understanding
- **Documentation**: The specification becomes natural documentation for the feature
- **Better Estimates**: Clear specifications enable more accurate task breakdown and estimation
- **Reduced Rework**: Catching issues in the spec phase is much cheaper than fixing them in code
- **Onboarding**: New team members can understand features by reading specifications

## What is spec-kit?

[spec-kit](https://github.com/github/spec-kit) is a toolkit created by GitHub that provides templates, workflows, and commands to implement Specification-Driven Development. It's designed to work seamlessly with AI coding assistants like Claude Code, enabling a smooth workflow from specification to implementation.

### Key Features

**1. Structured Templates**

- Feature specification templates with frontmatter metadata
- Implementation plan templates
- Task breakdown templates
- Custom checklist templates

**2. Workflow Commands**
spec-kit provides slash commands that guide you through the SDD process:

- `/speckit.specify`: Create or update feature specifications
- `/speckit.clarify`: Identify underspecified areas and ask targeted questions
- `/speckit.plan`: Generate implementation plans
- `/speckit.tasks`: Create dependency-ordered task lists
- `/speckit.taskstoissues`: Convert tasks to GitHub issues
- `/speckit.implement`: Execute the implementation plan
- `/speckit.analyze`: Perform consistency checks across artifacts
- `/speckit.constitution`: Set up project principles and guidelines
- `/speckit.checklist`: Generate custom feature checklists

**3. Cross-Artifact Consistency**
spec-kit maintains consistency between your specification, plan, tasks, and code by enforcing relationships and dependencies between artifacts.

**4. GitHub Integration**
Native integration with GitHub issues and pull requests, allowing specifications to drive issue creation and track implementation progress.

### The spec-kit Workflow

The workflow is iterative, not linear. You can move forward, backward, and repeat commands as needed:

```
1. Functional Requirements
   /speckit.specify
        ↓
2. Edge Cases & Clarification
   /speckit.clarify
        ↓
3. Technical Design
   /speckit.plan
        ↓
4. Execution Plan
   /speckit.tasks
        ↓
5. Implement
   /speckit.implement
        ↓
6. Validate
   /speckit.analyze

(You can iterate and go back to any step as needed)
```

**Understanding Each Command:**

- **`/speckit.specify`**: Captures functional requirements - what the feature should do from the user's perspective
- **`/speckit.clarify`**: Explores edge cases, error scenarios, and ambiguities you might have missed
- **`/speckit.plan`**: Defines technical requirements - how to implement it, architecture decisions, technology choices
- **`/speckit.tasks`**: Creates a granular, dependency-ordered execution plan for implementation
- **`/speckit.analyze`**: Validates consistency across spec, plan, and tasks

**Important Notes:**

- **Iterate freely**: Run the same command multiple times until you're satisfied. Each iteration refines the output.
- **Move backward**: It's perfectly fine to go back to `/speckit.specify` after running `/speckit.plan` if you discover missing requirements.
- **Add context**: Every command accepts additional requirements and clarifications as input, allowing you to guide and refine the output.
- **Constitution required**: spec-kit needs a project constitution to make consistent decisions aligned with your project's principles.

## Building Software with spec-kit

### Step 1: Initialize Your Project

First, set up spec-kit in your project. For this project, we use `uv` (installed as part of the flox environment in `.flox/env`) for package management:

```bash
# Install spec-kit using uv
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Initialize spec-kit in your project
specify init

# Set up project constitution (REQUIRED - not optional!)
# Use /speckit.constitution command in Claude Code
```

The constitution will be created at `.specify/memory/constitution.md` and lives side-by-side with your `CLAUDE.md` file. It defines your project's principles, coding standards, and decision-making guidelines. spec-kit uses this to make consistent choices throughout the workflow.

### Step 2: Create a Feature Specification

The `/speckit.specify` command is flexible and accepts anything - from simple text to detailed descriptions. You don't need to write in Markdown format; just describe what you want to build:

**Simple input example:**

```
/speckit.specify Add a dark mode toggle to the settings page
```

**More detailed input example:**

```
/speckit.specify Add user authentication with email/password.
Users should be able to register, log in, and reset passwords.
Sessions should persist across browser restarts.
```

**With additional clarifications:**

```
/speckit.specify Add user authentication

Additional requirements:
- Use JWT tokens for authentication
- Password must be at least 8 characters
- Include rate limiting on login attempts
```

For larger features, spec-kit will generate structured Markdown with frontmatter, requirements, and success criteria. For smaller features, the output may be simpler. The format adapts to the feature size and complexity.

### Step 3: Clarify the Specification

Use `/speckit.clarify` to think through edge cases and identify ambiguities. You can run this command multiple times and provide additional context:

```bash
# Basic clarification
/speckit.clarify

# With additional focus areas
/speckit.clarify Focus on error handling and security concerns

# After reviewing initial questions
/speckit.clarify The password should have minimum 12 characters and require special characters
```

This will ask targeted questions about underspecified areas:

- What password requirements should we enforce?
- Should we support OAuth providers?
- What session duration should we use?
- How should we handle failed login attempts?
- What happens when the email is already registered?
- How do we handle concurrent login sessions?

Run this command as many times as needed until all edge cases are covered.

### Step 4: Generate an Implementation Plan

Once the spec is clear, generate a technical plan. This defines HOW to build it, not WHAT to build:

```bash
# Basic plan generation
/speckit.plan

# With technical constraints or preferences
/speckit.plan Use PostgreSQL for the database and bcrypt for password hashing

# After reviewing initial plan
/speckit.plan Actually, let's use Prisma ORM instead of raw SQL queries
```

This creates a `plan.md` with:

- Technical approach and architecture decisions
- Technology choices (frameworks, libraries, tools)
- Dependencies and integrations
- Risk assessment and mitigation strategies
- Testing strategy

You can iterate on the plan multiple times. If you realize the technical approach needs adjustment, run `/speckit.plan` again with refinements.

### Step 5: Break Down into Tasks

Convert the plan into a granular, dependency-ordered execution plan:

```bash
# Generate tasks
/speckit.tasks

# Refine task breakdown
/speckit.tasks Break down the authentication middleware task into smaller steps

# Add specific requirements
/speckit.tasks Make sure to include database migration tasks
```

This generates a `tasks.md` with dependency-ordered tasks:

- Set up database schema
- Create database migration
- Implement password hashing utility
- Create authentication middleware
- Build registration endpoint
- Build login endpoint
- Add session management
- Create password reset flow
- Write integration tests
- Update documentation

Tasks are ordered so dependencies come first. You can regenerate tasks multiple times to adjust granularity or add missing items.

### Step 6: Implement

Execute the implementation:

```bash
/speckit.implement
```

This processes tasks in dependency order, implementing the feature according to the specification.

### Step 7: Validate and Analyze

Check consistency across all artifacts to ensure everything aligns:

```bash
# Check all previous work
/speckit.analyze

# Re-run after making changes
/speckit.analyze
```

This validates:

- Spec defines all requirements that appear in the plan
- Plan addresses all spec requirements
- Tasks cover all plan items
- No contradictions between artifacts
- All dependencies are properly ordered

Run `/speckit.analyze` regularly, especially after updating any artifact. If issues are found, go back to the relevant command (`/speckit.specify`, `/speckit.plan`, or `/speckit.tasks`) and refine.

## Live Demonstration: Adding a Feature to Movie Watchlist

In this session, I will demonstrate the complete spec-kit workflow by adding a new feature to the Movie Watchlist application. The feature is defined in [GitHub Issue #4](https://github.com/revity-group/revity-agentic-dev-framework-app/issues/4).

### Interactive Participation

Before we begin the demonstration, I'd like to gather some feedback from you about your experience with specification-driven development approaches.

**Please participate in our quick poll by scanning the QR code below:**

![Poll QR Code](assets/images/poll.png)

Your input will help tailor the demonstration to address the most relevant challenges and questions about implementing SDD in real-world projects.

### Demo Outline

The demonstration will walk through:

1. **Reading the Issue**: Understanding the feature request from issue #4
2. **Creating the Specification**: Using `/speckit.specify` to transform the issue into a structured spec
3. **Clarifying Requirements**: Using `/speckit.clarify` to identify and resolve ambiguities
4. **Generating the Plan**: Using `/speckit.plan` to create an implementation strategy
5. **Breaking Down Tasks**: Using `/speckit.tasks` to create actionable work items
6. **Implementation**: Using `/speckit.implement` to build the feature
7. **Validation**: Using `/speckit.analyze` to ensure consistency

By the end of the demonstration, you'll see how spec-kit transforms a simple GitHub issue into a fully-implemented, tested feature with complete documentation and traceability.

## Best Practices

### Writing Good Specifications

- **Be Specific**: Avoid vague language like "should be fast" - use measurable criteria
- **Include Examples**: Show concrete examples of inputs, outputs, and user flows
- **Consider Edge Cases**: Think through error scenarios, empty states, and boundary conditions
- **Define Success**: Clear acceptance criteria that can be tested
- **Keep It Updated**: Treat specs as living documents that evolve with implementation

### Using spec-kit Effectively

- **Know When to Use It**: Don't use spec-kit for simple tasks. Save it for medium to complex features.
- **Set Up Constitution First**: This is required, not optional. Your constitution guides all spec-kit decisions.
- **Start Simple**: `/speckit.specify` accepts plain text. You don't need to write formal specs manually.
- **Iterate Freely**: Run commands multiple times. Refine until you're satisfied with the output.
- **Move Backward**: If `/speckit.plan` reveals missing requirements, go back to `/speckit.specify` and update it.
- **Add Context**: Every command accepts additional requirements and clarifications as input.
- **Think in Stages**:
  - `/specify` = functional requirements (WHAT)
  - `/clarify` = edge cases and scenarios
  - `/plan` = technical requirements (HOW)
  - `/tasks` = execution steps
  - `/analyze` = consistency check
- **Don't Skip Clarify**: Edge cases discovered in `/speckit.clarify` save debugging time later
- **Review Generated Artifacts**: AI output should be reviewed and refined, not blindly accepted
- **Analyze Regularly**: Run `/speckit.analyze` after updates to catch inconsistencies early

### Integration with AI Coding Assistants

spec-kit is designed to work with AI assistants like Claude Code:

- Provide context through specifications rather than repeated explanations
- Use slash commands to guide the AI through structured workflows
- Leverage AI to generate comprehensive plans and task breakdowns
- Let AI handle boilerplate while you focus on high-level decisions

## Resources

- [spec-kit GitHub Repository](https://github.com/github/spec-kit)
- [spec-kit Documentation](https://github.com/github/spec-kit/blob/main/README.md)
- [BMAD METHOD](https://github.com/bmad-code-org/BMAD-METHOD) - For very large, complex projects (wait for v6)
- Example specifications in `.claude/specs/` directory
- Project constitution in `.specify/memory/constitution.md`
- Install spec-kit: `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`
- Initialize spec-kit: `specify init`

## Summary

Specification-Driven Development with spec-kit brings structure and clarity to medium and complex software features. By starting with a clear specification and iteratively refining through spec-kit's workflow commands, you can:

- Reduce miscommunication and rework
- Think through edge cases before coding
- Generate consistent implementation artifacts
- Maintain traceability from requirements to code
- Leverage AI assistants more effectively
- Build features faster with higher quality

**Remember**: SDD is not a silver bullet. Use it for features that benefit from structured planning. For simple tasks, just write the code. For very large projects, consider the BMAD METHOD instead.

The live demonstration will show these principles in action, transforming issue #4 from a feature request into working code through an iterative, flexible workflow.
