# Native AI Platform Deployment

This guide covers ChatGPT and Claude as native daily learning platforms for GitLearnOS.

It does not cover Claude Code. Claude Code is a coding agent and belongs in the OpenHanako deployment/debugging path.

## Core rule

Use only one active learning platform at a time.

```text
one learner
→ one active native AI platform
→ one learning state layer
→ one handoff path
```

Do not let ChatGPT and Claude both update the same learner profile, knowledge gaps, reviews, or dashboard.

## State layer rule for native platforms

For ChatGPT and Claude, the default state layer should be a Git target repository.

```text
best default for native platforms
→ Git target repository

possible but not automatic
→ local git repository
→ local git + Obsidian vault
```

A local path is valid only if the runtime can actually read and write local files, or if the AI provides exact file contents / patches and the user applies them manually.

Do not write instructions that imply ChatGPT or Claude can directly edit a local Obsidian vault unless that specific runtime has local file access.

## Shared GitLearnOS loop

Both ChatGPT and Claude should run the same loop:

```text
source
→ model
→ knowledge gap
→ personalized practice
→ review result
→ learner-profile.md
→ next review
```

The platform may remember stable preferences, but the durable learning state should remain inspectable in the chosen state layer.

## ChatGPT deployment

Use ChatGPT when the learner wants the smoothest mobile/web daily learning workflow and strong persistent personalization.

### Choose Chat or Work

Use **Chat** for everyday learning when the current project/session has verified
repository access:

- asking or answering one subject question;
- sharing one page, screenshot, or short note;
- recording teacher feedback or a practice result;
- receiving one next-step suggestion and a small safe writeback.

Do not require Skills on this path. Project instructions, repository
`AGENTS.md`, native memory, and the learning event itself should activate
GitLearnOS. On accounts where Chat does not consume limited Work task credits,
this also preserves Work for larger jobs; verify current plan behavior instead
of promising it universally.

Use **Work** for guided setup, large source intake, multi-file organization,
maintenance, substantial reviews, or scheduled workflows. Use **Codex** when
the learner or maintainer needs visible Git operations, migrations, tests, or
technical review.

OpenAI currently documents Git operations for local projects and shared project
context across related chats. A particular Chat or Work session must still
verify actual file and repository access.

### Project source rule

Create or select one persistent ChatGPT Project for the learner. Put large
textbooks, PDFs, scan collections, media, and long-lived reference files in its
**Sources** section when authorized. Chat and Work conversations in that project
can use the shared sources and instructions. Keep compact state, locators,
selected excerpts, and learning history in the Git repository.

### Setup instruction

Adapt and paste the complete
[`templates/project-instructions.md`](../templates/project-instructions.md)
content into the ChatGPT Project instructions. Do not paste only its link: the
daily Chat may not have repository or Skill access when it needs the fallback.
Fill in the actual target, policy, large-source location, and any stable learner
constraints.

### Memory rule

Adapt
[`templates/native-memory-pointer.md`](../templates/native-memory-pointer.md),
request the update with learner permission, and verify the retained activation
pointer and target. Report `saved`, `suggested`, `unavailable`, or `unknown`.

Do not store temporary tasks, raw private notes, stale gaps, or one-off practice results as permanent memory.

Memory is a wake-up pointer, not the full system. Required behavior remains in
project instructions or `AGENTS.md`; changing evidence remains in Git. If memory
is disabled, tell the learner that future standalone chats may not recognize
GitLearnOS unless they start inside the configured project or repository.

Official references:

- [Projects and chats](https://learn.chatgpt.com/docs/projects)
- [Memories](https://learn.chatgpt.com/docs/customization/memories)
- [Use ChatGPT](https://learn.chatgpt.com/docs/use-chatgpt)
- [Skills and plugins](https://learn.chatgpt.com/docs/skills-and-plugins)

### Scheduled prompt boundary

If ChatGPT scheduled prompts do not have live repository tools, they are handoff starters only.

```text
This is a GitLearnOS handoff starter. If you do not have live repository access, do not claim repository work is done. Tell me what to inspect next and what command or prompt to run in a tool-enabled chat.
```

## Claude deployment

Use Claude when the learner wants project-style organization, long-context reading, writing, artifacts, and careful drafting.

### Setup instruction

```text
You are helping me run GitLearnOS in Claude.

Use my chosen state layer as the source of truth. Prefer a Git target repository unless I explicitly choose a local-first workflow and you have actual local file access. Claude project context, artifacts, and memory are working surfaces, not the canonical state.

Before acting, identify your runtime, memory/project capability, file access, repository access, and permission boundary.

Follow this loop:
source → model → knowledge gap → personalized practice → review result → learner-profile.md → next review.

Do not invent missing sources. Do not claim file or repository edits unless you can name the changed files.

Use artifacts for drafts, visual explanations, tables, small apps, or temporary teaching materials. Persist important learning state back to learner-profile.md, sources/, models/, knowledge-gaps/, reviews/, or dashboard.md.

If you cannot write to the state layer, give exact file contents or patches for me to apply manually.
```

The same portable rule applies to any other native agent: place mandatory
behavior in its durable project/repository instructions, use native memory only
as an activation and preference cache, keep large sources in its project file
area or an authorized local folder, and keep inspectable learning state in Git.

### Artifact rule

Artifacts are useful for drafts, visual explanations, comparison cards, mini practice, and writing revisions.

Artifacts should not become the only place where learning state lives. If an artifact creates durable learning information, write or propose the state-layer update.

## Switching between ChatGPT and Claude

Switch only with a deliberate handoff:

```text
1. Read dashboard.md and learner-profile.md.
2. Read recent models, knowledge gaps, and reviews.
3. Write agents/handoff-notes/latest.md.
4. Stop the old platform.
5. Start the new platform from the handoff note.
```

Do not keep both platforms active on the same learning state.

## Relationship to OpenHanako

OpenHanako is not a replacement for ChatGPT or Claude as native web/mobile AI platforms.

It is the optional desktop enhanced path for local files, desks, Skills, scheduled tasks, bridge channels, browser/desktop actions, and limited multi-agent workflows.

Use Claude Code, Codex, Cursor, or other code agents only to deploy or debug OpenHanako, then run the desktop learning workflow inside OpenHanako itself.
