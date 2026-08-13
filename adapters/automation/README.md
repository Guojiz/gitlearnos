# Automation Adapter

[中文](../../zh-CN/adapters/automation/README.md)

GitLearnOS stores portable intent. A scheduler or capable agent performs it.
[`tasks.example.yml`](tasks.example.yml) is the minimal portable definition.
Every learner deployment assigns both jobs a recurring local time and IANA time
zone. Provider-specific expressions and credentials remain outside Git; the
learner repository records actual state in `automation.md`.

## Two portable jobs

The canonical mapping is fixed:

- recurring organization = `maintenance`, default daily at 21:30 local time;
- recurring question generation = `due-review`, default daily at 07:00 local
  time.

The learner may change both times and delivery preferences. Daily means “check
daily,” not “create content daily.”

### `due-review`

At run time:

1. open the current dashboard and due review links;
2. read the active goal, linked evidence, and recent questions;
3. generate a small set of fresh, answerable questions;
4. deliver the questions in the current channel;
5. write back only after an answer or material state change;
6. report what actually ran.

The output is not merely “remember to review.”
If no evidence is due, finish `skipped` without a question, delivery, or commit.
Never deliver the answer key in the question channel.

### `maintenance`

Inspect unprocessed input, waiting external feedback, stale dashboard links,
contradictory derived state, and due work. Make only safe reversible repairs;
queue uncertain work without guessing.
With no pending input or material state change, finish `skipped` without a
notification or timestamp-only commit.

The initial verification skip may be captured in the deployment commit. Later
no-work skips stay in provider logs and do not update Git by themselves.

## Provision and verify

For each job:

1. resolve the learner's IANA time zone, local time, quiet hours, catch-up
   preference, question channel, and maximum question count;
2. create the provider's recurring task with repository-capable tools;
3. record it as `configured` with its opaque provider task ID and next run;
4. run one real test occurrence against the intended repository;
5. record `verified` only when the worker safely completes or skips and the
   scheduler still shows the recurrence.

Both jobs must be `verified` for deployment automation to be complete. A
prompt-only reminder or on-handoff check leaves the requested schedule visible
but reports deployment automation as `incomplete`.

## Run safety

- derive one idempotency key from job ID and scheduled occurrence;
- acquire a single writer lock or lease and inspect the Git base revision;
- stop on concurrent change; do not automatically rebase, force-push, or
  overwrite;
- catch up a missed occurrence at most once and deduplicate due delivery;
- create at most one commit and only for material state change;
- keep answers out of notifications and credentials out of Git and logs;
- do not push unattended unless the learner separately authorized the intended
  private remote.

## Execution modes

| Mode | Meaning |
|---|---|
| immediate | completed in the current interaction |
| on-handoff | fallback check when a capable agent resumes; not a verified recurring schedule |
| background worker | a real scheduled run with repository access |
| prompt-only reminder | a handoff; no repository work may be claimed |

ChatGPT Automations, cron, CI, and other schedulers may implement the same two
jobs when they can actually access the repository and tools. Provider-specific
schedules stay outside learner state; portable intent, requested local time,
status, and evidence stay in Git.
