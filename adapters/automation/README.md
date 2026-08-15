# Automation Adapter

[中文](../../zh-CN/adapters/automation/README.md)

GitLearnOS stores portable intent in `gitlearnos.yml`; a scheduler or capable
agent performs it. `tasks.example.yml` is an example translation. Provider
expressions and credentials stay outside the learner repository.

## Portable configuration

The effective fields are `automation.time_zone`, `quiet_hours`,
`max_questions_per_due_run`, `delivery_channel`, and the two jobs below:

```yaml
automation:
  time_zone: Asia/Shanghai
  quiet_hours: "22:00-07:00"
  max_questions_per_due_run: 3
  delivery_channel: current-authorized-channel
  jobs:
    maintenance: {recurrence: daily, local_time: "21:30"}
    due-review: {recurrence: daily, local_time: "07:00"}
```

Legacy policy documents are migration-only and must not override this configuration.
The defaults are editable local times, not evidence that a scheduler exists.

## Two jobs

- `maintenance`: reconcile pending input, external feedback, stale views,
  contradictions, and repeated patterns.
- `due-review`: read due evidence and generate at most the configured number of
  fresh, answerable questions.

Daily means “check daily”, not “create content daily”. With no due or changed
evidence, return `skipped` without a question, notification, timestamp-only
commit, or duplicate delivery. Scheduled main-agent runs use one writer lock, inspect the current
Git revision, stop on a changed base, and catch up a missed occurrence at most
once. Never include answer keys in delivery or push unattended without explicit
private-remote authorization.

## Machine-readable scheduler receipt

Every external run that is claimed as observed must emit a JSON receipt with
this shape (for example `external/receipts/scheduler-<run-id>.json`):
The normative JSON Schema is [`external-receipt.schema.json`](external-receipt.schema.json).

```json
{
  "schema": "gitlearnos.external-receipt/v1",
  "kind": "scheduler",
  "provider": "local-cron",
  "task_id": "opaque-provider-task-id",
  "tz": "Asia/Shanghai",
  "recurrence": "daily",
  "run_id": "run-2026-08-15T07:00+08:00",
  "occurrence_key": "due-review/2026-08-15T07:00:00+08:00",
  "repo_revision": "0123456789abcdef",
  "result": "skipped",
  "delivery_status": "not-sent",
  "message_id": null,
  "observed_at": "2026-08-15T07:00:03+08:00"
}
```

The checker requires non-empty `provider`, `task_id`, `tz` (IANA),
`recurrence`, `run_id`, `occurrence_key`, and `repo_revision`; an explicit
`result`; and both `delivery_status` and `message_id` (use `null` when no
message was sent). A receipt is provider evidence, not a scheduler itself.
The local checker validates structure and never creates a task or contacts a
provider.

## Harness boundary

DeepSeek Harness **Schedule** is a session-local prompt/timer facility. It can
help a warm interactive session notice a task, but it cannot wake a cold
session, grant repository access, or prove a recurring main-agent run. A verified
background deployment requires a cold-capable scheduled invocation whose provider
receipt contains the fields above and whose run actually read the intended
repository. Harness text markers remain `reported-only`.

## Verification states

`requested` means approved and awaiting provisioning; `configured` means a
provider task exists but has not run; `verified` means the recurring entry and
one repository-capable run are both evidenced; `unavailable` means capability
inspection found no usable scheduler; `disabled` means the learner chose not to
run it and deployment remains incomplete. Keep these states in `automation.md`
only when supported by observed receipts.

Run the local structural check with:

```bash
node scripts/check-external-receipts.mjs external/receipts/*.json
```

The command reports structural validity and explicitly says that external
provider execution was not performed.
