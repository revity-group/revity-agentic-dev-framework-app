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

### Part 1: Combine claude code and your IDE

**Commands to demonstrate:**

- [ ] Install Claude code for vscode extension cmd + escape for running extension 
- [ ] Add start new terminal shortcut to vscode cmd+t (use commandline terminal)
- [ ] Show how to connect ID and that now it can pickup files opened in tab
- [ ] Show that you cna select line to add to context
- [ ] cmd+option+k to insert selected lines into context input 

---

### Part 2: Essential claude code shortcuts

- [ ] `claude --continue` to continue from prev session
- [ ] double tap on esc allows to choose previous commands
- [ ] `crtl+e` jump to the end . `ctrl+a` jump to beginning of line
- [ ] `ctrl+w` deleting a word

---

### Part 3: Targetting the proper context in claude code

- [ ] using `@` to include files in context
- [ ] update keybinding for insert at mentioned to open a file with cmd+p and then immidiiately add file to context with alt+t
- [ ] Demostrate how to include large files to context using repomix (makes it faster and avoid multiple reads)
- [ ] demostrate how to add this as a command to claude code 


### Part 4: Context window and costs 

- [ ] Run /context to see current context window size
- [ ] Explain a few things around context 
## Notes for Facilitator

- Remind participants to have their TMDB API key ready
- Encourage experimentation and questions
- Keep demos short and practical
- Use the backlog items in README.md as examples

---

## Next Steps (For Spec-Driven Development Workshop)

Hand off to colleague for spec-driven development training...
