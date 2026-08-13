# GitLearnOS Maintenance

Follow the Router's core contract. This reference may repair deterministic
state but may not invent evidence or rewrite preserved learner records.

When invoked as the required recurring `maintenance` job, use the configured
local time and scheduler state from `learning-policy.md` and `automation.md`.
No pending input or material change means `skipped`: do not notify, modify a
last-run timestamp, or commit.

## Audit order

1. `learning-policy.md` and actual runtime capability;
2. root dashboard, subject index, and active subject goal;
3. unprocessed inbox and waiting handoffs inside the active subject;
4. active gaps and resolution/mastery separation;
5. planned, due, and unscored questions;
6. source/model links;
7. repeated problem evidence waiting for synthesis or transfer checks;
8. duplicate, stale, orphaned, or excessive state.

## High-value checks

- dashboard duplicates state instead of linking;
- subject-specific state sits at the root or in the wrong subject folder;
- duplicate copies of one event exist across subjects;
- teacher-resolved work still appears as an AI teaching task;
- resolution is mistaken for demonstrated mastery;
- a generated set appears complete without an attempt;
- questions are generic, duplicate, or lack a rubric;
- a repeated input created duplicate files;
- same-pattern observations remain copied or isolated instead of linked;
- a model was promoted from one ambiguous event or has no evidence links;
- an AI diagnosis is presented as learner-reported fact;
- an answer template merely copies one worked solution;
- a promoted model has no fresh transfer check or never changes later action;
- an automation is claimed but only a prompt or date exists;
- safe-auto repeatedly asks for low-risk confirmation;
- personal raw material or identity is retained beyond policy;
- the learner cannot tell what changed or undo an agent event.
- required recurring organization or question generation has no explicit
  local time, IANA time zone, provider task ID, or verification evidence;
- two scheduler sources can deliver the same due occurrence;

## Direct repair

Under `safe-auto`, fix clear links, duplicate views, stale dashboard state, deterministic dates, obsolete noncritical tasks, and contradictions directly. Preserve provenance and user content.

Ask before deletion, broad restructuring, rewriting notes, changing policy, publishing, visibility changes, sensitive identity, secrets, or license changes.

For undo, identify the exact latest agent-created event or atomic commit, verify it does not include unrelated user work, then use the safest reversible mechanism available. If scope is mixed, stop and ask.

For a scheduled run, derive an idempotency key from `maintenance` and the
scheduled occurrence, acquire one writer lock or lease, and compare the Git
base revision immediately before writing. Stop on concurrent change. Catch up
a missed occurrence at most once. Create at most one commit and only when
learning state materially changes.

## Output

```text
Repository health:
Subject routing issues:
Organization issues:
Question issues:
Automation issues:
Changed files:
Unresolved decisions:
Next action:
```
