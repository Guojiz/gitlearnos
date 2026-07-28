---
name: gitlearnos-setup
description: Create or migrate the minimum learner-owned GitLearnOS state while preserving existing files, configuring automation and privacy policy, and preparing the first useful organization, question-generation, or learning action for one main agent.
---

# GitLearnOS Setup

Follow `GITLEARNOS.md`. GitHub is one possible location for the public template
or a target remote; the learner repository may also be any remote or local Git
checkout.

## Boundary

Treat `Guojiz/GitLearnOS` or an authorized copy as the template and the
learner's Git repository as the target. Never place personal state in the
template.

## Capability-first setup

1. identify the target;
2. test actual read, write, source, and scheduling capability;
3. inspect existing files;
4. ask only for information tools cannot obtain;
5. preserve existing work.

## Minimum state

Create only what the first goal or input needs:

```text
AGENTS.md
gitlearnos.yml
learning-policy.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

Then create real state under only the required subject folders:

```text
subjects/<subject>/inbox/
subjects/<subject>/sources/
subjects/<subject>/models/
subjects/<subject>/knowledge-gaps/
subjects/<subject>/handoffs/
subjects/<subject>/reviews/
subjects/<subject>/events/
archive/
```

Do not add empty scaffolding.

## Setup order

1. capture the first goal or input and infer or confirm its subject;
2. create `gitlearnos.yml` from the example, copy the appropriate thin
   `templates/AGENTS.md` entry, and establish
   `learning-policy.md` with `safe-auto` unless the learner requests
   preview/manual;
3. create minimal profile and dashboard with one next action;
4. organize the first real input or gap;
5. generate questions only when useful or requested;
6. run an AI session only when the learner requests it;
7. verify that the agent can identify state, act, write, report, and honor undo boundaries.

## Migration

- inventory before moving;
- map existing notes to `subjects/<subject>/` goals, sources, models, gaps,
  events, or archive;
- treat legacy `sessions/` as `events/` when those files are useful learning
  records rather than complete chat logs;
- preserve paths that support learner habits or links;
- ask before broad moves or overwrites;
- migrate one active learning path first;
- route new state immediately, but move old single-subject paths gradually when link safety matters.

## Output

```text
Target:
Subject path:
Capabilities:
Policy:
Changed files:
First organized path:
Questions prepared:
Still missing:
Next action:
```
