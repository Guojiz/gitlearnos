# GitLearnOS Question Generation

Follow the Router's core contract. This reference refines question selection
and persistence; it does not redefine mastery or write authority.

## Goal

Generate the next useful questions, not generic volume. Support two first-class outputs:

1. questions for the learner to answer;
2. questions the learner can take to an external helper.

When invoked as the required recurring `due-review` job, use the configured
local time, time zone, quiet hours, channel, and maximum count from
`gitlearnos.yml` and the verified scheduler state from `automation.md`.
No due evidence means `skipped`: do not create filler questions, notify, or
commit.

## Implicit triggers

A learner's subject question is both an immediate request and possible evidence.
Answer or guide the learner as requested, then decide whether it reveals a
durable gap, a useful source, or a reason for a fresh check. Do not manufacture
a quiz after every casual question.

When a clear active goal and target repository exist, a useful next question
may be generated and persisted under `safe-auto` without waiting for “quiz me.”
When relevance or desired difficulty is uncertain, offer one precise next
question or ask one necessary clarification. Respect “answer only,” “no
review,” and fatigue. When the learner requests “only send the question,” send
only the stem and purpose; keep the answer key/rubric in the canonical planned
review without teaching, scoring, or revealing it.

## Read

```text
active goal
+ subject path
+ relevant source or model
+ linked knowledge gap
+ recent attempted questions and support level
+ learner constraints: count, time, format, difficulty
```

If a required source is unavailable, ask for the minimum excerpt or label the result as general-knowledge generation.

Every persisted set receives a stable `review-<slug>` ID, canonical path,
`version`, `depends_on` links to goal/gap/model/event records, and
`composes_with` links when it intentionally combines reviews.

## Choose a purpose

- `diagnostic`: split remaining hypothesis classes; a probe must reduce
  uncertainty, not ask empty “why”;
- `practice`: strengthen a method;
- `variation`: change number, representation, or surface form;
- `transfer`: apply the idea in a new context;
- `review`: delayed retrieval;
- `exam`: approximate required conditions;
- `handoff`: ask a teacher, tutor, peer, or another agent.


Do not mix purposes without stating why.

## One-tap confirmation vs a full set

A one-tap confirmation (see `session.md`) is the lightweight close of a live
explanation, not a persisted question set. When a wrong distractor provides
useful evidence for a likely confusion, promote that one point to a full
`diagnostic` set and persist the observation plus its hypothesis; otherwise
record only the tap result in the review record and do not manufacture extra
questions.

## Generate learner questions

For each persisted set, record the goal, grounding, questions, answer or
success condition, and status. Add track, need, difficulty, time, selection
rationale, or novelty only when they improve later administration:

```yaml
purpose:
subject:
grounded_in:
target_goal:
target_gap:
track: school | self-study | mixed
need: current-course | remediation | exam | exploration | advance | project | research | skill
difficulty:
estimated_time:
selection_reason:
novelty:
questions:
answer_key_or_rubric:
status: planned
```

Rules:

- prefer 1–5 focused questions unless the learner requests a larger set;
- vary structure, not only numbers;
- do not copy the exact worked example for verification;
- use subject-appropriate responses: solution, proof, code, explanation, recall, comparison, critique, or creation;
- include enough answer key or rubric for a later agent to score consistently;
- keep answers hidden until an attempt unless requested;
- persist assigned, attempted, or reusable sets only.

When the question is actually delivered or assigned in the current response,
it is not a transient draft. Under effective `safe-auto` with write and Git
access, before finishing the response:

1. write the complete set under `subjects/<subject>/reviews/` with status
   `planned`, keeping the answer key or rubric in the file but out of the
   learner-facing question;
2. link it from the target gap and update repeated-evidence counts when the
   learner's current statement is a new observation of an existing pattern;
3. refresh `dashboard.md` and record a truthful due or on-handoff check when no
   scheduler exists;
4. stage every changed file and commit the complete assignment as one
   reversible learning event.

Do not leave an assigned question only in chat when these capabilities exist.
Under `preview` or `manual`, return the exact pending writeback instead of
claiming persistence.

### Track adaptation

- `school`: match taught scope, teacher method, required notation, and assessment format; label any advanced shortcut that differs from the current requirement;
- `self-study`: include conceptual depth, open explanation, creation, project work, and broader transfer when useful;
- `mixed`: repair the prerequisite for a school goal while preserving the learner's broader self-study path.

### Need and subject adaptation

- factual learning: retrieval, discrimination, explanation, delayed recall;
- mathematics and science: derivation, problem solving, proof, representation,
  transfer, and discrimination among plausibly confusable problem types;
- language: comprehension, production, correction, conversation, style;
- programming: implementation, tests, debugging, review, explanation;
- reading and research: claim extraction, evidence comparison, critique, synthesis, open questions;
- projects and practical skills: milestones, constrained tasks, demonstrations, artifact rubrics, retrospectives.

Use 0–3 only when observable performance fits that scale. Otherwise define a test, rubric, milestone, or other explicit success condition.

## Generate an external question pack

Create under `subjects/<subject>/handoffs/` with:

- destination or channel, without unnecessary identity;
- goal and source locator;
- original problem or safe reference;
- learner attempt;
- exact blocker;
- focused questions for the helper;
- requested kind of feedback;
- feedback and reconciliation fields.

Keep the linked gap in the v2 resolution vocabulary:

- use `open` while the question is merely routed;
- use `needs-check` when feedback or later verification is pending;
- record destination, delivery, and response progress in the handoff file.

Refresh the dashboard without copying handoff progress into a second gap state.

## Adapt from evidence

- incorrect or highly supported performance: reduce scope and diagnose;
- partial performance: use a close variation or small transfer;
- independent success: use delayed retrieval or broader transfer;
- external resolution without demonstrated mastery: generate an optional short check, not a full reteaching set;
- repeated success: reduce frequency and avoid redundant items.

When a model was synthesized from repeated problems, test recognition as well
as execution. Change structure, representation, or context—not only numbers—so
the learner must choose the relevant model. Mix a confusable neighboring type
when the evidence shows that choosing the correct approach is the gap. Keep
practice narrow enough to remain productive; interleaving is not a reason to
overwhelm a learner who cannot yet execute the base method.

Question generation does not itself prove learning. Leave unattempted sets `planned`.
For scheduled delivery, send only the question text and rationale; keep the
answer key or rubric in authorized repository state for later scoring. Use an
idempotency key for the scheduled occurrence and due evidence so catch-up and
on-handoff execution cannot deliver the same set twice. Stop on a concurrent
Git change rather than rebasing or overwriting.

When no date is specified, use the core defaults: next local day for a new gap
or incorrect/supported result, three days for partial or external resolution,
seven days for independent success without transfer, and seven days after a
transfer attempt. Store the ISO date and reason; an unknown time zone is
`noSignal`.

## Output

```text
Question type:
Subject path:
Count:
Grounded in:
Target:
Difficulty and time:
Files updated:
Status: planned / handoff-ready
Automation actually completed:
Skill installation:
Next action:
Undo:
```
