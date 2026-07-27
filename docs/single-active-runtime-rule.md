# Single Active Runtime Rule

GitLearnOS strongly recommends using one active learning runtime at a time.

Do not run ChatGPT, Claude, OpenHanako, Codex, Claude Code, Obsidian agents, and other tools as parallel learning authorities unless there is a deliberate handoff.

Multiple platforms at the same time create drift:

```text
native memory drift
+ private agent context drift
+ duplicate practice generation
+ conflicting learner-profile updates
+ inconsistent reviews / dashboard
+ unclear source of truth
```

## Recommended rule

```text
one learner
→ one active learning runtime
→ one learning state layer
→ one handoff path
```

## Good setups

### Lightweight setup

```text
ChatGPT
→ daily learning runtime

Git target repository
→ source of truth for learning state

local files
→ protected original materials
```

### Claude native setup

```text
Claude
→ daily learning runtime

Git target repository
→ source of truth for learning state

Claude Project / Artifacts
→ working surfaces, not the durable state
```

### Desktop setup

```text
OpenHanako / HanaAgent
→ daily desktop learning runtime

local git + Obsidian or a Git repository
→ learning state layer

local files / desk files
→ protected original materials
```

### Deployment setup

```text
Claude Code / Codex / Cursor
→ deploy or debug OpenHanako only

OpenHanako
→ becomes the active desktop learning runtime after deployment
```

## Local and hosted Git state layers

For every runtime, the learner's chosen Git repository is the state layer.
GitHub may be a convenient remote when a connector is available, but it is not
the protocol default.

A local git repository or Obsidian vault is valid only when the active runtime can actually access local files, or when the user manually applies exact patches from the AI.

For OpenHanako, a local git repository or local git + Obsidian can be the real state layer after the user grants file access.

## Portable access channels

OpenHanako messaging or social integrations can improve portability.

Treat them as input and notification channels, not as separate learning state authorities.

```text
portable channel
→ quick input and notification

OpenHanako
→ active agent runtime

local git / Obsidian / GitHub
→ learning state layer
```

Important learning results should still be written back to the chosen state layer.

## Feature budget rule

OpenHanako has many features. Do not enable everything by default.

```text
Usually useful:
- memory
- local file or desk access
- selected Skills
- GitLearnOS Maintainer
- Source and Model Extractor
- Practice and Review Coach

Enable only when needed:
- scheduled tasks
- portable channel integrations
- extra subagents
- Critic agent
- screenshots or vision

Avoid by default:
- broad file access
- too many agents
- uncontrolled scheduled rewrites
- parallel platform workflows
```

The Maintainer should be the final writer to the state layer. Other agents prepare or review work so multi-agent drift stays contained.

## Handoff rule

If switching platforms, do a deliberate handoff:

```text
1. Read current dashboard and learner-profile.
2. Read recent models, knowledge gaps, and reviews.
3. Write a handoff note.
4. Stop the old runtime.
5. Start the new runtime from the handoff note.
```

Never let two runtimes update the learning state at the same time.
