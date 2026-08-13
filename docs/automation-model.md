# Automation Model

[中文](../zh-CN/docs/automation-model.md)

The canonical behavior is in [GITLEARNOS.md](../GITLEARNOS.md). Provider
mapping is in the [Automation Adapter](../adapters/automation/README.md).

The portable base defines two required recurring jobs:

```text
maintenance, default daily at 21:30 learner local time
→ reconcile input, waiting feedback, stale views, contradictions, and patterns

due-review, default daily at 07:00 learner local time
→ read due evidence and generate concrete answerable questions
```

The learner may change both times. Store the IANA time zone, requested local
times, quiet hours, catch-up choice, and delivery preference in
`learning-policy.md`; store observed scheduler state in `automation.md`.

Both jobs must be `verified` for deployment automation to be complete. This
requires a real recurring scheduler entry plus one observed repository-capable
test run. A reminder, date, prompt, configured-but-untested task, or on-handoff
check does not satisfy the requirement.

No due or changed evidence means `skipped` with no content, notification, or
commit. Scheduled workers use one idempotency key and writer lock, stop on a
changed Git base, hide answer keys from delivery, catch up at most once, and do
not push unattended without separate private-remote authorization.

Do not create many platform-specific task definitions inside learning state.
Keep learning intent in Git and translate schedules through an adapter.
