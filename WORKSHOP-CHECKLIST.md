# Agentic Development Workshop Checklist

> Workshop facilitator guide for teaching Claude Code agentic development

## Pre-Workshop Setup (Before Participants Arrive)

- [ ] Ensure Claude Code is installed and accessible
- [ ] Test TMDB API key is working
- [ ] Verify the app runs locally (`bun dev`)
- [ ] Prepare demo environment
- [ ] Share repo link with participants
- [ ] Ask participants to use VScode for this workshop to keep things consistent

---

## Workshop Flow

### Part 1: Claude Code tips and tricks & shortcuts

**Connect IDE to Claude Code:**

- [ ] Install Claude code for vscode extension cmd + escape for running extension 
- [ ] Add start new terminal shortcut to vscode cmd+t (use commandline terminal)
- [ ] Show how to connect ID and that now it can pickup files opened in tab
- [ ] Show that you cna select line to add to context
- [ ] cmd+option+k to insert selected lines into context input

**A few useful shortcuts:**

- [ ] `claude --continue` to continue from prev session
- [ ] double tap on esc allows to choose previous commands
- [ ] `crtl+e` jump to the end . `ctrl+a` jump to beginning of line
- [ ] `ctrl+w` deleting a word

**Targeting the proper context in claude code:**

- [ ] using `@` to include files in context
- [ ] update keybinding for insert at mentioned to open a file with cmd+p and then immediately add file to context with alt+t
- [ ] Demonstrate how to include large files to context using repomix (makes it faster and avoid multiple reads)
- [ ] Demonstrate how to add this as a command to claude code 

---

### Part 2: Context window and costs

- [ ] Run /context to see current context window size
- [ ] Explain the different components of the context window and how MCPs affect the context window


### Part 3: CLAUDE memory (CLAUDE.md)

- Initialise CLAUDE.md file with the project overview and commands
- Explain how CLAUDE.md is used to guide Claude Code's behavior
- Demonstrate how to reference other files in CLAUDE.md using `@`


## Part n: Spec-Driven Development 

To be filled by @Pavel

---


