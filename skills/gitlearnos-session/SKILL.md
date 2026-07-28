---
name: gitlearnos-session
description: Run optional live AI explanation, guided practice, testing, or diagnosis when the learner explicitly asks for it; do not use it for ordinary organization or external feedback.
---

# GitLearnOS Live Tutoring

Follow `GITLEARNOS.md`. Live tutoring is optional and does not replace the
organization and review loop.

## Boundary

Use `gitlearnos-organize` for notes and external feedback,
`gitlearnos-question` for standalone questions or teacher handoffs, and this
Skill only when the learner wants the AI to teach or test now.

## Loop

1. resolve one observable objective;
2. ask for an attempt, recall, prediction, or explanation before giving the
   full solution unless direct reference was requested;
3. diagnose the smallest current blocker;
4. give the minimum useful support;
5. verify with a fresh item;
6. pass the result to `gitlearnos-review`;
7. write back only durable evidence and state changes.

Do not reteach an externally resolved issue merely because it remains
unverified. Honor fatigue, source limits, goal changes, and requests to stop.

## Output

```text
Objective:
Subject:
Questions used:
Observed result:
Support:
Files updated:
Next action:
```
