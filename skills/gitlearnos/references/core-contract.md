# GitLearnOS Core Contract

Use this compact contract when the template repository's canonical
`GITLEARNOS.md` is unavailable. It is sufficient for an installed Skill; the
canonical source still wins when accessible.

## Activation and authority

On each learner interaction, silently consider whether a question, attempted
answer, page, note, feedback, result, correction, changed goal, or repeated
difficulty has durable value. Answer the immediate need first. Do not save
incidental conversation or anything the learner says not to store.

Read `gitlearnos.yml` as the only learner configuration, authorization, and capability declaration.
Do not infer authority from a second file. If it is absent or malformed, use
`manual` and report that state rather than guessing:

- `safe-auto`: make only small, reversible, clearly useful writes;
- `preview`: show proposed changes without writing;
- `manual`: wait for explicit approval before writing.

Ask before deletion, overwriting preserved evidence, broad restructuring,
changing a long-term goal or configuration, publishing, visibility changes, external
sending, secrets, or sensitive identity.

## Canonical learning state machine

Every durable learning path is an explicit, linkable state transition:

```text
event (observed evidence)
  → gap (open / needs-check / resolved)
  → model draft (plausible, not promoted)
  → model active (promotion evidence satisfies the rule)
  → review planned (fresh question persisted)
  → transfer attempted (delayed + independent result)
  → mastery learning | demonstrated
```

`event`, `gap`, `model`, and `review` records each have a stable machine-
readable `id` and canonical `path`. Derived records link with `depends_on` and
`composes_with`; replacements use `supersedes`; model revisions carry a
monotonically increasing `version`. `conflicts` records evidence that blocks a
promotion or mastery transition. A dashboard row, score without its answer,
explanation, or external resolution alone is never a state transition.

## Evidence and mastery

- Preserve learner answers, original notes, and external feedback.
- Correct preserved material with a new linked record, not a silent rewrite.
- AI summaries, models, gaps, dashboards, and plans may change with evidence.
- Important conclusions link traceable evidence; missing evidence stays
  `unknown` or `needs-verification`.
- `demonstrated` requires delayed independent success and transfer when the
  goal requires it. Reading, completion, immediate imitation, external
  resolution, and supported success remain `learning` or unassessed.
- Explanation, summary, model creation, and RAG retrieval never establish
  mastery. Preserve the learner's actual judgment and result. Treat a proposed
  missing fact or broken reasoning link as a revisable diagnosis. A surface
  error is a signal, not a knowledge gap: keep competing hypothesis classes,
  use a discriminating probe, and do not write a supported gap until
  alternatives are split or share an intervention. Falsified hypotheses stay
  in the record. New evidence that contradicts prior mastery opens a
  contradiction inquiry instead of only lowering a score.


## Minimum read and write

Read `gitlearnos.yml`, the root dashboard, the active subject goal, and only
related evidence. Keep state under `subjects/<subject>/`; choose one canonical
owner for cross-subject material and link instead of copying. Keep large
originals in an authorized source area; Git stores compact state, locators,
selected evidence, and history.

Before writing, inspect current Git state and preserve unrelated work. Prefer
one meaningful learning event per commit. Repeated input updates or links
existing state instead of producing duplicates. Push only with an authorized
remote.

## Review timing and automation honesty

When no date is specified, use deterministic local defaults and record the
reason: new gap or incorrect/supported result = next local day; partial result
or external resolution = three local days; independent correct result without
transfer = seven local days; transfer check = seven local days after the
attempted review. If event time or time zone is unknown, use `noSignal`, never a
guessed date.

Immediate work happens in the current interaction. Background work exists only
when a real repository-capable scheduler was created. Assign IANA time zone and
local recurrence to `maintenance` (default 21:30) and `due-review` (default
07:00). Record requested schedule, mode, and delivery preferences in
`gitlearnos.yml`; record observed task IDs, next runs, and test evidence in
`automation.md`. Without real entries and a safe observed test, automation is
`incomplete`. With no due evidence or material change, return `skipped` without
content, notification, timestamp churn, or a commit.

## Dashboard queue and presentation

`dashboard.md` is a generated view, never a second source of truth. Queue rows
may contain only canonical IDs and repository paths. Recompute order only when
evidence, due dates, dependencies, importance, weakness, or a goal changes.
Use this deterministic precedence: unsatisfied prerequisites; overdue/today
planned reviews; due-soon reviews; upcoming reviews; open gaps; then new work.
Within a bucket blend leverage (`importance × weakness`) and gentleness; break
ties by subject variety, then stable ID. Do not reorder on a no-op maintenance
run.

Write `Panel: expand` only when opening the queue is the helpful next action;
otherwise write `Panel: collapse`. A learner's manual toggle wins until the
agent records a material `queue_revision` or an urgent due item appears.
Expand/collapse is presentation state, never learning state.

## Receipt

After any write-capable operation, report exactly these fields (use `none` or
`unknown` rather than omitting one):

```text
Mode:
Subject:
Organized:
Questions:
Changed files:
Evidence:
Automation actually completed:
Skill installation:
Next action:
Undo:
```
