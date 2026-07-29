# GitLearnOS — AceSAT Build for Impact

[中文](../zh-CN/docs/acesat-build-for-impact.md)

## Problem

Students in under-resourced public schools may have capable teachers and
useful free materials but lack continuous, individualized follow-through.
Practice results, class explanations, paper notes, and occasional tutoring are
fragmented. The next study session often starts without knowing which error
still matters, what help was already received, or whether improvement lasted.

## Agent

GitLearnOS turns one learner-owned Git repository into durable state for one
replaceable AI agent:

```text
real practice or teacher feedback
→ evidence-linked gap
→ smallest useful next question
→ preserved answer and support used
→ delayed independent check
→ reversible Git writeback
```

The agent does more than answer. Within learner-approved policy it organizes
evidence, selects the next task, adapts question count and delivery, stops
redundant reteaching after external help, prepares focused teacher handoffs,
and updates future checks. Long-term goals and high-impact actions still remain
under learner control.

## Demonstration

The working SAT demo follows a fictional student who shares a phone, limits
mobile data, studies in 20-minute blocks, and cannot rely on continuous paid
tutoring. From one cleaned vocabulary-in-context mistake, the agent:

1. preserves the learner's statement and its missing evidence;
2. creates a narrow knowledge gap rather than a broad ability label;
3. reuses local material and delivers one plain-text question;
4. writes back the answer, support used, feedback, and next check;
5. refuses to claim mastery or background automation without evidence.

Run it from [LIVE-DEMO.md](../LIVE-DEMO.md).

## Why it may help

- scarce teacher time is focused through short evidence-linked handoffs;
- the learner does not need to manage Git, folders, or a new learning app;
- free school, library, paper, teacher, and open resources remain usable;
- later questions target observed gaps instead of generating large generic
  worksheets;
- original answers and feedback remain inspectable and cannot be silently
  replaced by an AI summary.

These are intended effects, not measured outcomes. A school pilot should
measure delayed independent accuracy, repeated-error rate, review completion,
time to prepare teacher help, data usage per learning event, and student
control over stored records.

## Accessibility and cost boundary

The core is open source, text-first, local-Git compatible, and has no required
database, vector service, custom server, or always-on process. It supports
short asynchronous interactions, small incremental reads, existing local
materials, and teacher handoffs.

ChatGPT Chat or Work can perform the file and Git loop when the current local
project/session has verified repository access. Skills are optional; durable
project/repository instructions and memory keep daily interactions active. A
learner does not need GitHub for normal use. GitHub hosts the public
challenge submission; a remote is otherwise optional for user-chosen sync,
backup, collaboration, or publishing.

It is not zero-resource technology. A learner still needs some device access
and a capable AI runtime at the moment agent work is performed. Connectivity,
AI pricing, school policies, disability access, and Git setup must be tested
with real students rather than assumed away. A read-only or temporarily
offline situation is reported as pending work, never as completed automation.

## Technical implementation

- canonical agent contract: `GITLEARNOS.md`;
- one reusable Router Skill with on-demand operation references:
  `skills/gitlearnos/`;
- learner state: plain Markdown plus minimal YAML;
- versioning and undo: local or hosted Git;
- optional scheduling: `due-review` and `maintenance`, executed only by a real
  authorized runtime;
- evaluation: behavior scenarios that reject fabricated mastery, access,
  scheduling, and writeback.

No particular model, API, cloud platform, database, or Git host is required.

## Originality and build scope

The challenge entry is the Git-native v2 agent protocol, constrained-access SAT
demo, impact framing, and evaluation work developed during the challenge
period. The public Git history remains visible, including any earlier project
history; the submission does not present prior work as newly created.
