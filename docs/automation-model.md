# Automation Model

[中文](../zh-CN/docs/automation-model.md)

The canonical behavior is in [GITLEARNOS.md](../GITLEARNOS.md). Runtime intent
comes from `gitlearnos.yml`; provider mapping and receipt fields are in the
[Automation Adapter](../adapters/automation/README.md).

## Portable intent

The two required recurring jobs default to:

```text
maintenance, daily at 21:30 in automation.time_zone
→ reconcile input, waiting feedback, stale views, contradictions, and patterns

due-review, daily at 07:00 in automation.time_zone
→ read due evidence and generate concrete answerable questions
```

The learner may change `automation.time_zone`, quiet hours, delivery channel,
question cap, recurrence, and local times in `gitlearnos.yml`. Legacy policy
documents must not be consulted to override them.

Daily is a check cadence, not a promise to produce work. No due or changed
evidence means `skipped` with no content, notification, timestamp-only commit,
or duplicate delivery. The scheduled main-agent run uses an idempotency key and writer lock,
inspects the current Git base revision, stops on a concurrent change, and
catch-ups at most once.

## Evidence boundary

An external run is `verified` only when a real provider supplies a
machine-readable scheduler receipt containing provider, task ID, IANA time
zone (`tz`), recurrence, run ID, occurrence key, repository revision, result, delivery
status, and message ID. The local receipt checker verifies structure only; it
does not create, run, or contact schedulers. Text in `automation.md`, a date,
prompt, or Harness panel is always `reported-only`.

DeepSeek Harness Schedule is session-local and cannot wake a cold session. It is
not proof of a cold-capable repository invocation. See the adapter for the
exact boundary and local check command.
