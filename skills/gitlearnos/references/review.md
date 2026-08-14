# GitLearnOS Review

Follow the Router's core contract. Use `question.md` to create a new set; use
this reference after a planned question is due or the learner answers.

## Implicit answer recognition

An answer may arrive in another conversation as text, an image, a calculation,
code, or a brief statement with no review command. Use memory or repository
links to identify the likely pending question, but never force a match. If one
clear pending item exists, score and write it back under policy. If several
items could match, ask one short question. If none match, treat it as a new
learning event rather than inventing provenance.

A text-only model that cannot see an image answer must not score or fabricate
that answer; prefer an available multimodal or vision-capable helper model to
transcribe it, then ask for the text or route the original to an authorized
parser. Treat a low-confidence transcription as not-yet-scored.

## Read

Resolve the subject. Before creating any event, search
`subjects/<subject>/reviews/` for `planned` question sets and compare the
learner's answer with their question text, purpose, and dates. If exactly one
set matches, write the answer back to that review record; do not create a new
event as a substitute. If several sets plausibly match, ask one short
disambiguating question. Only use the organize flow when no planned review
matches.

For the matched set, read its linked goal, source or model, gap, question
purpose, saved answer key, rubric, test, or success condition, and recent
attempts. Evaluate against that saved criterion rather than only the agent's
own subject knowledge. Do not reveal answers before an attempt unless
requested.

## Record

At minimum preserve:

- the learner's original answer or faithful response record;
- whether the answer was independent;
- support used;
- result and useful feedback;
- transfer result when required;
- the next check or an explicit no-review choice.

Use an existing subject rubric, test, milestone, or 0–3 scale when it helps.
Otherwise use plain `incorrect`, `partial`, `correct`, or `not-assessed`.

## Feedback diagnosis

For a meaningful mathematics, science, or other problem-solving attempt, use
the learner's visible work and, when necessary, ask one focused question:

1. What judgment or choice did the learner actually make, and was its outcome
   correct?
2. If it failed, what observable missing information, broken reasoning link,
   confused distinction, or execution error best explains the failure?
3. Does this evidence match an existing situation and revise its recognition
   cue, answer structure, limit, or trap?

The third item is a GitLearnOS synthesis check, not a quotation attributed to
an external learning-method source. Label an unconfirmed cause as
`agent-hypothesis`; keep it `unknown` when the answer cannot be observed. Give
the learner an opportunity to state their own reasoning before replacing it
with an AI diagnosis.

A wrong multiple-choice distractor is already a precise diagnosis: it names the
exact confusion ("similar vs congruent") without asking the learner to describe
it. Record which distractor was chosen and link it to the gap's error
mechanism.

## Mastery

- exposure or completion does not prove mastery;
- an externally resolved question does not prove independent mastery;
- supported or immediate performance remains `learning`;
- use `demonstrated` only after delayed independent success, including transfer
  when the goal requires it.

## Writeback

1. append the answer and feedback to the matched review record without
   replacing original evidence, and change `planned` only to the truthful
   attempted or assessed state;
2. record the judgment, outcome, support, and diagnosis confidence;
3. link same-pattern evidence and update the linked gap;
4. refine a model only when the promotion rule is met;
5. generate or link a fresh check when it serves the goal;
6. refresh the dashboard;
7. update the learner profile only for repeated durable patterns;
8. create background scheduling only through a real scheduler;
9. stage every file changed by this review, including root views such as
   `dashboard.md`, and commit the complete review as one reversible learning
   event.

An unattempted generated set remains `planned`.

## Output

```text
Review status:
Subject:
Result:
Independence and support:
Files updated:
Next review or check-on-handoff:
Automation actually completed:
Skill installation:
Next action:
Undo:
```
