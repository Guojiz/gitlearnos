# Recurring Automation Status

> This records observed scheduler state, not credentials or a substitute for
> provider configuration. Effective intent (time zone, quiet hours, delivery,
> and job times) lives in `gitlearnos.yml`. Update this file only from a
> machine-readable external receipt or an explicit unavailable/disabled
> decision. Text here is always `reported-only`.

Deployment automation: `incomplete` / `verified`
Learner time zone:
Quiet hours:
Unattended private-remote push: `disabled` / `authorized`

## `maintenance` — recurring organization

- State: `requested` / `configured` / `verified` / `unavailable` / `disabled`
- Recurrence:
- Local time:
- Provider:
- Provider task ID:
- Next run:
- Last verified run:
- Last result: `completed` / `skipped` / `failed` / `unknown`
- Receipt path or external receipt ID:
- Delivery status:
- Message ID (or `null` when not sent):

## `due-review` — recurring question generation

- State: `requested` / `configured` / `verified` / `unavailable` / `disabled`
- Recurrence:
- Local time:
- Provider:
- Provider task ID:
- Next run:
- Last verified run:
- Last result: `completed` / `skipped` / `failed` / `unknown`
- Delivery channel:
- Receipt path or external receipt ID:
- Delivery status:
- Message ID (or `null` when not sent):

## Run contract

Each provider receipt must contain `provider`, `task_id`, `tz`,
`recurrence`, `run_id`, `occurrence_key`, `repo_revision`, `result`,
`delivery_status`, and `message_id`. Use one idempotency key and writer lock;
stop if the Git base revision changes. No due or changed evidence means
`skipped` with no question, message, or commit. Catch up once at most and never
redeliver a due item. Keep credentials and provider expressions outside Git.

Run the local structural check with:

```bash
node scripts/check-external-receipts.mjs external/receipts/*.json
```

The checker does not contact a scheduler or prove that a provider ran; it only
reports whether receipt documents have the required shape.
