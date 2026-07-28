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

### Setup instruction

```text
You are helping me run GitLearnOS in ChatGPT.

Use my chosen state layer as the source of truth. Prefer a Git target repository. ChatGPT memory is an active preference cache, not the canonical learning repository.

Before acting, identify your runtime, memory capability, file access, repository access, and permission boundary.

Follow this loop:
source → model → knowledge gap → personalized practice → review result → learner-profile.md → next review.

Do not invent missing sources. Do not claim file or repository edits unless you can name the changed files.

If you cannot write to the state layer, give exact file contents or patches for me to apply manually.
```

### Memory rule

Store only stable preferences:

```text
GitLearnOS is the user's AI-assisted learning system.
The chosen state layer is the source of truth.
learner-profile.md stores the inspectable learner profile.
Practice should come from recent models and active knowledge gaps.
When memory conflicts with the state layer, trust the state layer first and suggest a memory update.
```

Do not store temporary tasks, raw private notes, stale gaps, or one-off practice results as permanent memory.

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
