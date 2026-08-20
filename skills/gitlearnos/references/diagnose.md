# GitLearnOS Differential Diagnosis

Follow the Router's core contract. This reference defines how an agent turns
an error signal into a revisable hypothesis set. It does not replace
`organize.md`, `session.md`, `question.md`, or `review.md`.

Load this reference when the current event is a mistake, a stuck attempt, a
self-report of not knowing, or new evidence that contradicts prior mastery.

## Goal

Do not record a surface error as a knowledge gap. Diagnose first.

```text
signal
→ competing hypotheses
→ discriminating probe
→ supported root cause or remaining uncertainty
→ targeted intervention only when teaching is requested or justified
→ independent delayed transfer check
→ confirm, falsify, or revise the learner model
```

A diagnosis is standing protocol, not a model personality. An agent that
likes to ask follow-ups and an agent that likes to explain immediately must
still obey the same write barrier.

## Constitution

1. Do not only answer; diagnose.
2. Do not only record the error; explain the error.
3. Do not trust the first judgment; try to falsify it.
4. Do not declare mastery without independent evidence.
5. Do not probe for its own sake. A question that does not split remaining
   hypotheses is not a diagnostic question.

## Competing hypotheses

Keep more than one live class until evidence splits them. Stable identifiers:

| Class | Meaning |
|---|---|
| `concept-unestablished` | the target object is not stably represented |
| `prerequisite-missing` | an earlier concept required by this step is missing |
| `procedure-forgotten` | the concept is present; the steps are not |
| `calculation-error` | concept and steps are present; arithmetic or execution failed |
| `language-misread` | the item was parsed incorrectly |
| `incidental` | fatigue, misread numeral, or one-off slip |
| `transfer-failure` | the prototype works; the variation does not |
| `mastery-overestimated` | prior `demonstrated` or high confidence was too optimistic |

Do not collapse the set to the learner's first complaint. “I cannot find the
maximum” is a signal that may be any of the classes above.

## Discriminating probes

Empty “why” or “where are you stuck” questions almost never reduce
uncertainty. Ask a smallest item that splits the remaining set.

Rules:

- qualitative before computational when that split is available;
- prefer a micro-item over metacognitive self-report;
- budget two or three probes;
- stop when remaining classes share the same next action
  (`intervention-invariant`);
- stop if the learner asks to be taught, is fatigued, or says not to quiz;
- persist a `diagnostic` probe that will be answered later through
  `question.md`; a live probe in tutoring may stay in the session until
  writeback.

Example. For `y = -2x^2 + 4x + 1`, asking whether the parabola opens up or
down splits `concept-unestablished` from `calculation-error` and
`procedure-forgotten` before any vertex formula is discussed.

## Write barrier

Do not create or update a knowledge gap as a supported root cause from a
surface symptom unless at least one of these holds:

1. at least one competing class has been ruled out by a probe or by the
   learner's visible work;
2. remaining classes imply the same intervention;
3. the probe budget is exhausted and one class dominates.

Otherwise:

- keep a compact event;
- set `diagnosis_status` to `unknown` or `agent-hypothesis`;
- record the competing list;
- if a gap file already exists, mark interpretation `suspected`, not
  supported.

The grain of a written gap is the supported root cause, not the first
complaint. A gap titled “cannot find quadratic maxima” is usually the wrong
object.

One-off `incidental` or `calculation-error` results stay events. They become
gaps only when a later distinct observation contradicts the incidental
reading.

## Interpretation lifecycle

Keep resolution (`open` / `needs-check` / `resolved`) separate from
interpretation:

```text
anomaly → suspected → diagnosing → supported
        → intervening → retesting
        → confirmed | falsified | revised
```

Use these interpretation states in the gap or event:

- `anomaly`: a signal exists;
- `suspected`: hypotheses are open; not yet a mastery verdict;
- `diagnosing`: a probe is in flight;
- `supported`: one root cause now dominates;
- `intervening`: targeted teaching or practice is underway;
- `retesting`: an independent item is planned or in progress;
- `confirmed`: delayed independent transfer still supports the cause;
- `falsified`: later evidence rejected the cause;
- `revised`: the root cause was rewritten.

Never treat `suspected` as `demonstrated` or as a reason to drop mastery.

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

- forgetting;
- increased complexity;
- failed transfer after a parameter, representation, or context change;
- overestimated prior mastery (narrow samples);
- incidental state.

Use one discriminating probe, then revise. A mastery value is a belief with
a duty to seek disconfirming evidence.

## Relation to other operations

- `organize.md` owns durable writeback and the write barrier;
- `session.md` owns live tutoring; it must diagnose before a full
  explanation unless the learner asked for the solution;
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
Write barrier: held / passed
Interpretation:
Falsified:
Next probe or intervention:
```
