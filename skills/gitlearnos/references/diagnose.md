# GitLearnOS Differential Diagnosis

Follow the Router's core contract. This reference defines how an agent turns
an error signal into a revisable hypothesis set. It does not replace
`organize.md`, `session.md`, `question.md`, or `review.md`.

Load this reference when the current event is an *unexpected* mistake, a
stuck attempt after a genuine try, or new evidence that contradicts prior
mastery.

Do **not** enter differential diagnosis for ordinary new learning
(“I have not studied derivatives yet—please teach me”). That is expected
not-yet-learned material: route to `tutor` / `organize`, not `diagnose`.

Native DeepSeek Harness: when this path is required, call `learning_route`
with explicit `operations: ["diagnose", ...]` so the Host does not rely on
regex alone. Gap lifecycle updates use `learning_apply` with
`action: "update"` and `expectedContentSha256` of the current file content.

## Goal

Do not record a surface error as a knowledge gap. Diagnose first.

```text
signal
→ competing hypotheses
→ discriminating probe
→ best-supported diagnosis or remaining uncertainty
→ targeted intervention only when teaching is requested or justified
→ independent delayed transfer check
→ corroborate, falsify, or revise the learner model
```

A diagnosis is an evidence-linked hypothesis, not a fact. An agent that
likes to ask follow-ups and an agent that likes to explain immediately must
still obey the same write barrier.

## Constitution

1. Do not only answer; diagnose when the failure is unexpected.
2. Do not only record the error; explain the error.
3. Do not trust the first judgment; try to falsify it.
4. Do not declare mastery without independent evidence.
5. Do not probe for its own sake. A question that does not split remaining
   hypotheses is not a diagnostic question.
6. Prefer teaching when the learner is clearly in expected new-learning
   territory; over-diagnosis is a protocol failure.

## Hypothesis layers (not a forced eight-way exclusive pick)

Classes may co-occur. Prefer a primary class plus optional mechanism and
model-relation notes.

**Knowledge / skill**

| Class | Meaning |
|---|---|
| `concept-unestablished` | the target object is not stably represented |
| `prerequisite-missing` | an earlier concept required by this step is missing |
| `procedure-unavailable` | the procedure is not currently usable (say *forgotten* only with prior mastery evidence) |

**Task / execution**

| Class | Meaning |
|---|---|
| `calculation-error` | concept and steps are present; arithmetic or execution failed |
| `language-misread` | the item was parsed incorrectly |
| `incidental` | fatigue, misread numeral, or one-off slip |

**History / generalization**

| Class | Meaning |
|---|---|
| `transfer-failure` | the prototype works; the variation does not |
| `mastery-overestimated` | prior `demonstrated` or high confidence was too optimistic |

Example record shape:

```text
primary: transfer-failure
possible mechanism: prerequisite-missing
model relation: mastery-overestimated
```

Do not collapse the set to the learner's first complaint. “I cannot find the
maximum” is a signal that may involve several layers above.

## Discriminating probes

The form of a question does not matter; whether the answer reduces
hypothesis uncertainty does.

Generic metacognitive questions such as “where are you stuck?” do **not**
count as diagnostic probes *unless* the answer actually discriminates among
the live hypotheses. When they do discriminate, they are valid probes.

Rules:

- qualitative before computational when that split is available;
- prefer a micro-item over empty metacognitive self-report;
- default adaptive strategy is about 1–3 probes (not a hard protocol
  invariant—depth depends on age, subject, and risk);
- stop probing when remaining classes share the same next intervention,
  the learner requests teaching/stop, or further probes cost more than they
  are likely to clarify.

Example. For “I cannot find the maximum of this quadratic,” ask first
whether `y = -2x^2 + 4x + 1` opens up or down without computing. An “up”
answer supports a link failure between `a` and opening direction; a correct
“down” answer rules that class out and the next probe should split vertex
meaning from procedure availability from calculation.

## Stop probing vs write supported diagnosis

These are **two different gates**.

**Stop probing** when any of:

- remaining live hypotheses would not change the next intervention;
- the learner asks to be taught or to stop;
- further probes are unlikely to pay for their cost.

**Write a `supported` diagnosis** only when:

- a specific hypothesis has positive discriminating evidence; **and**
- reasonable alternatives that would imply a *different* teaching action
  have been ruled out or substantially weakened.

Consequences:

- “remaining hypotheses share one intervention” → may stop asking; write at
  most `suspected` (or a shared intervention plan), **not** `supported`.
- “probe budget exhausted” → may stop asking; **never** upgrades a
  hypothesis to `supported` by itself.
- Ruling out a single weak class among many does **not** pass the write
  barrier for `supported`.

Incidental slips stay events. Retracted hypotheses stay in the record as
`falsified`. Deleting a wrong tag is worse than leaving a denied one.

## Knowledge-gap grain

The grain of a written gap is the **best-supported blocker** (or supported
explanation), not the first surface complaint and not a metaphysical
“root cause.” Prefer language like `best-supported blocker`,
`supported diagnosis`, or `supported explanation` over `confirmed root cause`.

## Diagnosis lifecycle

Track process status (`open` / `needs-check` / `resolved`) separate from
interpretation:

```text
anomaly → suspected → diagnosing → supported
        → intervening → retesting
        → corroborated | falsified | revised
```

Use these interpretation states in the gap or event:

- `anomaly`: a signal exists;
- `suspected`: hypotheses are open; not yet a mastery verdict;
- `diagnosing`: a probe is in flight;
- `supported`: one diagnosis now has positive evidence and competing
  intervention-changing alternatives are weakened;
- `intervening`: targeted teaching or practice is underway;
- `retesting`: an independent item is planned or in progress;
- `corroborated`: delayed independent transfer still supports the diagnosis
  (prefer this word over `confirmed`);
- `falsified`: later evidence rejected the diagnosis;
- `revised`: the diagnosis was rewritten under controlled update.

Never treat `suspected` as `demonstrated` or as a reason to drop mastery.

Controlled updates of an existing gap/model/review file must use
`learning_apply` with `action: "update"`, the same canonical id/path,
`expectedContentSha256` of the current utf8 content, exact `baseRevision`, and no
uncommitted local edits on the target. History of falsified states stays in
the file body; do not invent a second id to “overwrite” the old judgment.

## Falsification

Every diagnostic hypothesis must remain retractable. If later evidence
contradicts it:

1. set interpretation to `falsified`;
2. record the contradicting evidence and date;
3. stop using that cause for question selection or mastery change;
4. keep the history; do not delete the tag.

Example. The agent suspected a missing percent-base concept. A later probe
shows the learner can rewrite the base and only misread a numeral. The
correct record is: the hypothesis was proposed and later falsified. Silence
is worse than a retracted tag.

## Contradiction with prior mastery

When new evidence conflicts with `demonstrated` or a previously strong
belief, do not only lower mastery. Open competing classes:

- forgetting (only with prior positive evidence);
- increased complexity;
- failed transfer after a parameter, representation, or context change;
- overestimated prior mastery (narrow samples);
- incidental state.

Use one discriminating probe, then revise. A mastery value is a belief with
a duty to seek disconfirming evidence.

## Relation to other operations

- `organize.md` owns durable writeback and the write barrier;
- `session.md` owns live tutoring; it must diagnose before a full
  explanation unless the learner asked for the solution or the material is
  clearly new learning;
- `question.md` owns persisted `diagnostic` probes and later transfer
  checks;
- `review.md` owns scoring; a passed immediate check never upgrades
  mastery;
- `model.md` still requires two linked observations or an explicit method
  before promotion.

## Output

When this workflow runs, include in the ordinary receipt:

```text
Diagnosis:
Hypotheses remaining:
Ruled out:
Stop-probe gate: held / passed
Supported-write gate: held / passed
Interpretation:
Falsified:
Next probe or intervention:
```
