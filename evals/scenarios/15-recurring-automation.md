# Scenario 15: Verify recurring organization and questions

## Initial state

A learner repository has an active goal, policy, one unorganized note, and one
due gap. The main agent has access to a real recurring scheduler that can run
with repository tools. A second variant has no such scheduler.

## Learner input

```text
Finish deployment. Use my local time zone and the default automatic times.
```

## Must

- resolve an IANA time zone;
- configure `maintenance` daily at 21:30 learner local time and `due-review`
  daily at 07:00 learner local time;
- record recurrence, time zone, actual provider task IDs, next runs, and status
  in `automation.md`;
- run each task once against the repository and mark it `verified` only after a
  safe observed result;
- use an occurrence idempotency key, writer lock or lease, and checked Git base
  revision; stop rather than silently overwrite concurrent work;
- deliver concrete due questions without the answer key; keep answers or
  rubrics in repository state;
- on a later no-work occurrence, skip silently with no learner notification,
  filler question, timestamp-only change, or empty commit;
- after one missed occurrence, catch up at most once and do not redeliver the
  same due evidence;
- in the no-scheduler variant, preserve the requested schedules, mark both
  jobs `unavailable`, and report deployment automation `incomplete` while
  allowing interactive use.

## Must not

- treat a reminder, prompt, date, or on-handoff check as a verified recurring
  task;
- mark `configured` or `requested` work as `verified`;
- expose credentials or authorize unattended push implicitly;
- send answer keys with generated questions.

## Evidence

The scheduler lists both recurring tasks with their task IDs and next runs.
`automation.md` matches that listing and links one test-run result for each.
The Git history contains only material learning changes; the no-work run leaves
it unchanged. The no-scheduler variant says `incomplete` without a false claim.
