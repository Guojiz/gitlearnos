---
name: gitlearnos-setup
description: Create or migrate the minimum learner-owned GitLearnOS state while preserving existing files, configuring initiative, memory, automation, and privacy policy, and preparing one main agent to recognize future learning events without an explicit GitLearnOS or Skill invocation.
---

# GitLearnOS Setup

[中文](../../zh-CN/skills/gitlearnos-setup/SKILL.md)

Follow `GITLEARNOS.md`. GitHub is one possible location for the public template
or a target remote; the learner repository may also be any remote or local Git
checkout.

## Boundary

Treat `Guojiz/GitLearnOS` or an authorized copy as the template and the
learner's Git repository as the target. Never place personal state in the
template.

## Capability-first setup

1. explain the recommended three-layer arrangement in plain language;
2. identify the target;
3. test actual read, write, Git, source, memory, project-instruction, Skill, and
   scheduling capability;
4. inspect existing files;
5. guide the learner through only the choices or actions tools cannot complete;
6. preserve existing work.

```text
project sources or an authorized local source folder
→ large textbooks, PDFs, scans, media, and reference collections

learner Git repository
→ compact structured state, evidence locators, questions, answers, and history

native memory when available
→ activation pointer and stable preferences
```

Prefer a persistent ChatGPT Project's **Sources** section for large learning
files when that is the active platform. Chat and Work conversations in the
project can then use the shared project context. On another agent, choose its
equivalent project file area or an authorized local source folder. Do not put
large originals in Git merely because the repository is available.

## Durable activation

Install the behavior on the smallest durable surfaces the runtime actually
supports:

1. always place the learner `AGENTS.md` in the target repository;
2. use project instructions when they apply across the learner's chats;
3. when native memory is enabled and permitted, store only that GitLearnOS is
   active, the target repository or project, proactive-assistance preference,
   and stable learner preferences;
4. install or expose the router Skill when supported, but never make explicit
   Skill invocation the only activation path.

Explain the result to the learner. In particular, tell them which future
surfaces can notice questions, answers, photographed material, notes, feedback,
and results automatically. If memory, Skills, Git, or remote sync are
unavailable, say so and preserve the behavior through the remaining surfaces.

Guide setup one unavoidable step at a time. Do not dump a long platform
checklist or ask the learner to create files the agent can create. Recommend a
default, explain the tradeoff briefly, complete safe work, and verify the result
before moving on.

For ChatGPT, distinguish verified capability by surface. A local project may
provide files and Git while an ordinary Chat surface may hide technical Git
details or not expose Skills. Chat may still be a useful daily entry when the
target repository and persistent instructions are available. Work is better for
larger multi-step organization or maintenance. Do not promise a particular
credit treatment; plan and workspace limits may differ.

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
2. establish the persistent project/source area and place or link large
   learning files there when available and authorized;
3. create `gitlearnos.yml` from the example, copy the appropriate thin
   `templates/AGENTS.md` entry, and establish
   `learning-policy.md` with `safe-auto` unless the learner requests
   preview/manual;
4. configure and report the durable activation surfaces;
5. create minimal profile and dashboard with one next action;
6. organize the first real input or gap;
7. generate questions only when useful;
8. run an AI session only when the learner requests it;
9. verify with an implicit trigger that the agent can identify state, act,
   write, report, and honor undo boundaries without requiring a Skill name.

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
Project or source workspace:
Activation surfaces:
Memory:
Changed files:
First organized path:
Questions prepared:
Still missing:
Next action:
```
