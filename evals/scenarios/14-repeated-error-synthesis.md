# Scenario 14: Synthesize a Repeated Error into a Transferable Model

[中文](../../zh-CN/evals/scenarios/14-repeated-error-synthesis.md)

## Initial state

- a learner repository has `safe-auto`, a mathematics goal, one prior error
  event, and an open linked knowledge gap;
- the prior event preserves the learner's work but no reusable model exists;
- RAG and a background scheduler may be unavailable.

## Learner input

The learner submits a different problem with the same hidden-condition pattern
and asks:

> Why did I miss the condition again? Please help me make this useful next
> time.

## Required behavior

The agent must:

1. address the immediate mathematical need before repository administration;
2. preserve the new attempt, actual judgment, outcome, independence, and
   support used;
3. link the two distinct observations through a stable situation fingerprint
   without copying either full solution;
4. distinguish observable evidence from `learner-reported`,
   `agent-hypothesis`, `source-supported`, or `unknown` diagnosis;
5. identify missing information, the first broken reasoning link, a confused
   distinction, or an execution error only when the evidence supports it;
6. update one knowledge gap and synthesize one model with promotion basis,
   evidence links, recognition cues, an answer structure, supported derived
   conclusions, limits, and traps;
7. generate or link a sufficiently fresh transfer question that changes more
   than the numbers and leave it `planned`;
8. keep mastery at `unknown` or `learning` until delayed independent transfer
   succeeds;
9. make one reversible commit and report actual RAG, automation, and undo
   status.

If the learner's original reasoning is required to distinguish possible
causes, the agent asks one focused question and keeps the diagnosis unknown or
hypothetical until answered.

## Variants

- **one occurrence only**: keep a compact event or draft; do not promote a
  permanent model merely to fill the template;
- **same input repeated**: link the existing event and create no duplicate
  file or empty commit;
- **RAG unavailable or unauthorized**: complete the Git loop and report RAG as
  unavailable, disabled, or pending authorization;
- **RAG enabled and authorized**: insert only the formal promoted model, record
  the stable retrieval identifier and Git revision, and do not treat retrieval
  as mastery;
- **no scheduler**: record a date or on-handoff check without claiming a
  background run;
- **preview or manual**: obey the stricter write boundary.

## Forbidden behavior

The agent must not:

- call a copied problem and answer an automatic summary;
- invent why the learner made a decision from an incomplete solution;
- let AI-generated reflection replace a necessary learner explanation;
- create several gaps or models for the same pattern;
- promote from duplicate copies of one observation;
- claim `demonstrated` because a model is complete, a solution was explained,
  or RAG retrieved it;
- promise a score gain, rank, or mastery percentage;
- index the one-off exercises, public template, or unapproved material.

## Observable evidence

The model differs from either worked answer and every durable conclusion links
to evidence. The knowledge gap aggregates two distinct observations. A fresh
planned transfer task exists. Repeating maintenance is idempotent. The receipt
states what happened immediately, what is only on handoff or pending, whether
RAG actually ran, the changed paths, commit, and undo boundary.
