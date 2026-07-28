# Automation Model

[中文](../zh-CN/docs/automation-model.md)

The canonical behavior is in [GITLEARNOS.md](../GITLEARNOS.md). Provider
mapping is in the [Automation Adapter](../adapters/automation/README.md).

The portable base defines two jobs:

```text
due-review
→ read due evidence and generate concrete answerable questions

maintenance
→ reconcile input, waiting feedback, stale views, and contradictions
```

An interactive agent always performs immediate work and on-handoff checks when
capable. Background work exists only when a real scheduler has repository
access. A reminder or date is not a completed worker run.

Do not create many platform-specific task definitions inside learning state.
Keep learning intent in Git and translate schedules through an adapter.
