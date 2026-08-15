# GitLearnOS Evidence Summary

Use this route when the learner asks for a summary, status snapshot, or compact
handoff of existing learning state. Read `gitlearnos.yml`, the dashboard, the
active goal, and only canonical records linked from that goal.

## Boundary

Summaries are derived views. Preserve source, event, gap, model, and review
IDs and canonical paths; never replace their evidence or claim mastery from a
summary. Include unresolved `conflicts`, missing evidence, and the next
trigger when they change action.

## Output shape

```yaml
summary_id: summary-<stable-slug>
subject:
goal:
as_of:
canonical_records:
  - id:
    path:
    status:
state_machine_position: event | gap | model-draft | model-active | planned | transfer-attempted | mastery-learning | mastery-demonstrated
evidence:
  - id:
    path:
    kind:
conflicts: []
next_check:
next_check_reason:
next_action:
```

Do not create a new knowledge record for a one-off summary unless it is an
authorized handoff or the learner explicitly asks to persist it. A persisted
summary must link with `depends_on` to every canonical record it compresses and
must be revised when any dependency's `version` changes.

## Receipt

Use the unified core receipt fields, including `Changed files: none` when the
summary is read-only.
