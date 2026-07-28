# Filesystem Design

[中文](../zh-CN/docs/filesystem-design.md)

The canonical location rules are in [GITLEARNOS.md](../GITLEARNOS.md). This
page explains the design without defining a second structure.

```text
root
→ policy, learner profile, cross-subject dashboard

subjects/<subject>/
→ goals, sources, models, gaps, handoffs, reviews, useful events
```

Files and folders appear only when real learning state needs them. The learner
describes the event, not a path; the agent routes it automatically.

Original evidence is preserved. AI-derived files may be revised and must point
back to evidence. The dashboard is a generated view. Ordinary conversation and
temporary drafts stay out of the repository.

See [Subject Folder Model](subject-folder-model.md) for examples.
