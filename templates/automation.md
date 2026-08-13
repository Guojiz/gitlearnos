# Recurring Automation Status

> This records verified scheduler state, not credentials or a substitute for
> provider configuration. Update it only from observed scheduler and run
> evidence. A deployment test may update this file in the deployment commit.
> Later no-work skips remain in provider logs until a material learning change
> is committed; never create a Git change only to record `skipped` or a time.

Deployment automation: `incomplete` / `verified`
Learner time zone:
Quiet hours:
Unattended private-remote push: `disabled` / `authorized`

## `maintenance` — recurring organization

- State: `requested` / `configured` / `verified` / `unavailable` / `disabled`
- Recurrence: `daily`
- Local time: `21:30`
- Provider:
- Provider task ID:
- Next run:
- Last verified run:
- Last materially recorded or verification run result: `completed` / `skipped` / `failed` / `unknown`
- Verification evidence:

## `due-review` — recurring question generation

- State: `requested` / `configured` / `verified` / `unavailable` / `disabled`
- Recurrence: `daily`
- Local time: `07:00`
- Provider:
- Provider task ID:
- Delivery channel:
- Next run:
- Last verified run:
- Last materially recorded or verification run result: `completed` / `skipped` / `failed` / `unknown`
- Verification evidence:

## Run contract

State meanings: `requested` = approved and awaiting provisioning;
`configured` = created but untested; `verified` = scheduler entry plus observed
repository-capable test; `unavailable` = capability inspection found no usable
scheduler; `disabled` = learner explicitly disabled it and deployment remains
incomplete.

- One idempotency key per job and scheduled occurrence.
- One writer lock or lease; stop if the Git base revision changes.
- No due or changed evidence means `skipped`: no question, message, or commit.
- Catch up a missed occurrence at most once and never redeliver a due item.
- Deliver questions without answer keys.
- Keep credentials and provider expressions outside Git.
