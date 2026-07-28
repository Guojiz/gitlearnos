# GitLearnOS

**[Quickstart: give one request to your AI →](QUICKSTART.md)**

[中文](zh-CN/README.md) ·
[Website](https://guojiz.github.io/gitlearnos/) ·
[Documentation map](DOCUMENTATION.md) ·
[Protocol](GITLEARNOS.md)

![GitLearnOS overview](docs/assets/gitlearnos-map.svg)

**GitLearnOS gives an AI a learner-owned Git memory: organize real learning,
generate targeted questions, and write useful results back automatically.**

Learning may happen with teachers, class, paper, books, practice platforms,
projects, peers, or AI. GitLearnOS does not move all learning into one app. One
replaceable main agent connects the useful evidence and next actions inside the
learner's own Git repository.

Git stays in the background. The learner does not need to manage folders,
commits, branches, or a Git hosting service during normal learning.

## The learning loop

```text
goal and real learning input
→ automatic organization with traceable evidence
→ targeted question from the current gap
→ learner answer or external feedback
→ later independent check
→ updated state and one reversible Git commit
```

The primary success condition is observable improvement through answering and
rechecking—not merely a tidy collection of notes.

## Three core capabilities

| Capability | Result |
|---|---|
| Automatic organization | notes, mistakes, teacher feedback, and platform results become linked evidence and one next action |
| Targeted questions | questions use the goal, source, current gap, and recent performance instead of random worksheet volume |
| Automated writeback | safe changes, due checks, answers, and feedback are committed and reported without making the learner maintain files |

Live AI tutoring is optional. A learner may work mainly with a human teacher
and use GitLearnOS for continuity, questions, and review.

## Build for impact

The [AceSAT working demo](LIVE-DEMO.md) follows a fictional public-school
student with limited data, a shared phone, short study periods, and no paid
tutoring continuity. The agent uses an existing practice summary, chooses one
high-value SAT question, preserves the answer, updates the next check, and
prepares evidence that a teacher can inspect.

The demo is deliberately text-first and local-Git compatible. It does not
require a custom app, always-on server, database, large download, or background
scheduler. It still requires access to a capable AI runtime; GitLearnOS reduces
overhead but does not pretend that devices, connectivity, or AI access are
universally available.

- [Run the three-minute demo](LIVE-DEMO.md)
- [Read the one-page impact statement](docs/acesat-build-for-impact.md)
- [Inspect the completed SAT fixture](examples/en/demo-sat-lite/)

## What you need

One main AI agent that can read and write a Git repository.

In ChatGPT Work and other environments with built-in file and Git operations,
a persistent local worktree is enough for most learning workflows. The
learner does not need a GitHub account or remote repository.

The target may be:

- a local Git repository;
- a standard remote Git repository;
- GitHub, GitLab, Gitea, or another Git host.

GitHub is a convenient path, not a core dependency. A database, vector store,
server, custom app, multi-agent runtime, and OpenSpace are also optional.

This project is published on GitHub because the challenge requires a GitHub
submission. That submission requirement is separate from how a learner uses
GitLearnOS. Add a remote only for chosen backup, cross-device sync,
collaboration, or publishing.

## Start with one subject

Send this to a write-capable agent:

```text
Use https://github.com/Guojiz/GitLearnOS as the GitLearnOS template.
My learning Git repository or local checkout is: <target>
Subject: <subject>
Goal: <goal>
Current material or learning event: <input>

Read GITLEARNOS.md and START-HERE.md first. Use
skills/gitlearnos/SKILL.md when Skills are supported. Detect actual repository,
Git, source, and scheduling capability. Use safe-auto: organize useful
evidence, generate targeted questions when they serve the goal, and commit safe
reversible writeback. Preserve original answers, notes, and external feedback.
Do not store the full conversation or claim mastery without delayed independent
evidence. Finish with changed files, actual automation, the next action, and
the undo boundary.
```

The agent should initialize only the current subject and the files needed now.
See the complete [Quickstart](QUICKSTART.md).

## One repository, subject folders

```text
gitlearnos.yml
AGENTS.md
learning-policy.md
dashboard.md
learner-profile.md
subjects/
└── math/
    ├── goals/
    ├── sources/
    ├── models/
    ├── knowledge-gaps/
    ├── handoffs/
    ├── reviews/
    └── events/
```

Git does not preserve empty folders. The agent creates each optional folder on
first real use.

## Truth before completeness

- Original answers, notes, and external feedback are preserved.
- Corrections become new linked records instead of silent rewrites.
- AI summaries, models, gaps, and plans may be revised.
- Important conclusions link evidence; missing evidence remains unknown.
- Ordinary chat and hidden reasoning are not stored.
- External resolution and independent mastery remain separate.

The dashboard is a current view, not a second source of truth.

## Automation that acts

The portable base defines two operations:

- `due-review`: read due evidence and deliver concrete answerable questions;
- `maintenance`: reconcile input, waiting feedback, stale views, and
  contradictions.

An interactive agent performs immediate work and checks due items when it
resumes. Background work requires a real external scheduler with repository
access. A reminder alone is not completed repository work.

See [Automation adapters](adapters/automation/README.md).

## Skills and subject methods

Start with [skills/gitlearnos/SKILL.md](skills/gitlearnos/SKILL.md). The core
Skills route setup, organization, question generation, review, source handling,
models, optional tutoring, and maintenance.

Optional subject Skills refine mathematics, language, or programming task forms
without changing the evidence and ownership contract. OpenSpace may later
evaluate generic Skills through an [optional integration](integrations/openspace/README.md);
it is not required.

## Evaluation

GitLearnOS uses documented end-to-end scenarios rather than exact AI text
matching. The v2 acceptance cases cover bootstrap, note organization, teacher
feedback, due questions, answer writeback, non-fabrication, idempotency, and a
complete local-Git workflow.

See [Evaluation](evals/README.md).

Existing repositories can move gradually with
[the v2 migration guide](MIGRATION-v2.md); old evidence does not need a
one-time bulk relocation.

## Examples

- [Teacher feedback to delayed mathematics review](zh-CN/examples/demo-zhongkao-lite/)
- [SAT Reading and Writing](examples/en/demo-sat-lite/)
- [Research reading](examples/en/demo-research-reading-lite/)

## Project status

This branch develops the Git-native v2 protocol.

MIT License. See [LICENSE](LICENSE).
