---
name: gitlearnos-maintenance
description: Audit and safely repair a learner-owned GitLearnOS repository for stale dashboards, broken links, duplicate events, policy drift, unsupported mastery, overdue checks, unresolved handoffs, non-idempotent automation, and safe undo needs.
---

# GitLearnOS Maintenance

Follow `GITLEARNOS.md`. This Skill may repair deterministic state but may not
invent evidence or rewrite preserved learner records.

## Audit order

1. `learning-policy.md` and actual runtime capability;
2. root dashboard, subject index, and active subject goal;
3. unprocessed inbox and waiting handoffs inside the active subject;
4. active gaps and resolution/mastery separation;
5. planned, due, and unscored questions;
6. source/model links;
7. duplicate, stale, orphaned, or excessive state.

## High-value checks

- dashboard duplicates state instead of linking;
- subject-specific state sits at the root or in the wrong subject folder;
- duplicate copies of one event exist across subjects;
- teacher-resolved work still appears as an AI teaching task;
- resolution is mistaken for demonstrated mastery;
- a generated set appears complete without an attempt;
- questions are generic, duplicate, or lack a rubric;
- a repeated input created duplicate files;
- an automation is claimed but only a prompt or date exists;
- safe-auto repeatedly asks for low-risk confirmation;
- personal raw material or identity is retained beyond policy;
- the learner cannot tell what changed or undo an agent event.

## Direct repair

Under `safe-auto`, fix clear links, duplicate views, stale dashboard state, deterministic dates, obsolete noncritical tasks, and contradictions directly. Preserve provenance and user content.

Ask before deletion, broad restructuring, rewriting notes, changing policy, publishing, visibility changes, sensitive identity, secrets, or license changes.

For undo, identify the exact latest agent-created event or atomic commit, verify it does not include unrelated user work, then use the safest reversible mechanism available. If scope is mixed, stop and ask.

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
