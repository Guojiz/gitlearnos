# Adaptive Memory and Learner Profile

GitLearnOS binds memory to the learning repository.

The goal is not to force every AI platform to have the same memory feature. The goal is to keep the learner state portable, inspectable, and adaptable across tools.

## Memory layers

```text
Git repository
→ source of truth for learning state, history, files, indexes, learner-profile.md, reviews, and handoff notes

learner-profile.md
→ compact repository-level learner memory

Native AI memory
→ GitLearnOS activation pointer, stable preferences, and durable learner summary when the platform supports it

Project instructions
→ stable operating rules and fixed materials

Project sources
→ large textbooks, PDFs, scans, media, and long-lived reference files

External/local memory tools
→ optional enhanced retrieval for desktop agents, Claude Code, Codex, local models, or long-running workflows

Current chat
→ temporary workspace only
```

## Active and passive memory

Native AI memory is relatively active: the model may surface it automatically during future sessions.

The Git repository is more passive: the AI must read or search the repository to recover the state.

Both matter.

```text
Active memory
→ helps the model notice GitLearnOS and stable preferences without being prompted

Passive repository memory
→ gives inspectable, versioned, source-grounded learning state
```

The AI should keep the two aligned without pretending they are the same thing.

## Source of truth rule

The Git repository remains the source of truth.

Native AI memory, project instructions, and external memory tools may accelerate retrieval, but they should not silently override repository files.

```text
If memory conflicts with the chosen Git repository, trust repository evidence
first.
Then propose a memory update.
```

## What belongs in native AI memory

Use native memory only for stable information:

- long-term learning goals;
- stable preferences;
- preferred explanation style;
- durable constraints;
- repeated mistake patterns;
- repository operating preferences;
- stable privacy boundaries;
- that GitLearnOS is installed and should consider implicit learning events;
- the active project and learner-repository pointer.

Do not store fast-changing or sensitive state there by default.

This activation role matters most when a capable everyday Chat surface does not
expose Skills. Memory wakes up the behavior; `AGENTS.md` or project instructions
define it; the repository supplies current evidence.

Use the ready-to-adapt
[`templates/native-memory-pointer.md`](../templates/native-memory-pointer.md)
entry. It includes the implicit-event signals, answer-first boundary, real
target, policy preference, and source-of-truth rule. Do not copy full Skill
procedures into memory. Put the compact no-Skill operation router in
[`templates/project-instructions.md`](../templates/project-instructions.md)
instead.

## What belongs in project sources

Use a persistent project source area or authorized local folder for:

- large textbooks and PDFs;
- scan or image collections;
- lecture media and long-lived reference files;
- materials that should be available across related conversations but should
  not be committed to Git.

The Git repository should keep the source locator, access state, inspected
excerpt, and derived learning record.

## What belongs in learner-profile.md

Use `learner-profile.md` for the current inspectable learner state:

- current goals;
- active subjects;
- strong areas;
- active weak points;
- repeated mistake patterns;
- preferred explanation style;
- memory sync notes;
- recent progress;
- next priorities;
- adaptive routing keywords.

This file should be updated by the Organizer + Critic + Revision routine.

## What belongs in external memory tools

External memory tools are optional.

They are useful when the user works with:

- Claude Code;
- Codex CLI;
- Cursor or another IDE;
- local agents;
- long-running desktop workflows;
- large conversation histories;
- local-first retrieval requirements.

External memory is best used for recall and retrieval, not as the canonical learning-state editor.

Good use:

```text
retrieve old conversations
recover past decisions
search long local histories
load relevant context into the current agent session
```

Bad use:

```text
replace the Git repository as source of truth
hide learning state inside a private memory database
pretend all agents share the same memory
store sensitive material without user choice
```

## MemPalace-style local memory

A MemPalace-style memory layer can be treated as an optional enhanced memory backend.

Use it when the learner wants local-first recall for desktop or code-agent workflows.

Recommended boundary:

```text
MemPalace-style memory
→ local recall layer for conversations, project history, and old decisions

GitLearnOS
→ learning operating layer and source of truth

learner-profile.md
→ compact learner-state anchor

Native AI memory
→ stable preference cache
```

Do not make any external memory backend mandatory.

## Self-adaptive memory check

Before deciding how to remember something, the AI should ask:

```text
1. Is this stable or temporary?
2. Is it private or public-safe?
3. Should it be inspectable in the chosen Git repository?
4. Should it be summarized into native AI memory?
5. Should it only stay in the current chat?
6. Is an external local memory tool available?
7. Would storing this create stale or misleading memory later?
```

## Memory update workflow

When meaningful learning state changes:

1. update the relevant repository files;
2. update `learner-profile.md` if the change is durable;
3. update or suggest native memory only for the activation pointer, stable
   preferences, or repeated patterns;
4. verify the retained activation pointer and target when the runtime permits;
5. report memory as `saved`, `suggested`, `unavailable`, or `unknown`;
6. if an external memory tool exists, let it index or recall supporting history;
7. report what changed and what was not changed.

Never turn a proposed memory sentence into a success claim. Memory updates and
future recall may be delayed. A later ordinary subject question that does not
name GitLearnOS or a Skill is the meaningful continuity check.

## Prompt pattern

```text
Identify your memory environment first.

Report:
- runtime:
- native memory: yes / no / unknown
- project instructions: yes / no / unknown
- project sources: yes / no / unknown
- implicit activation: yes / suggest / no
- Git repository access: write / read / pasted excerpt / none
- external memory tool: yes / no / unknown

Then decide where each piece of information belongs:
- Git source of truth
- learner-profile.md
- native AI memory
- project instructions
- external memory retrieval
- current chat only

Do not silently store or overwrite memory. If uncertain, ask or mark as pending.
```

## Rule of thumb

```text
Git remembers the system.
learner-profile.md remembers the learner.
Native AI memory wakes the system and remembers stable preferences.
Project Sources hold large reusable material.
External memory retrieves old context.
Current chat does the current work.
```
