# GitLearnOS Reusable Model

Follow the Router's core contract. A model is editable AI-derived state, never
original evidence.

## Model test

A useful model answers:

- When should I recognize it?
- What should I do?
- Why does it work?
- When does it not apply?
- What common error does it prevent?
- How can a fresh task verify transfer?
- Which linked observations support it, and what would revise it?

## Workflow

Resolve the subject first and write the model under `subjects/<subject>/models/`. Link across subjects only when genuinely reusable; keep one canonical owner.

```text
grounded source or observed event
→ identify repeated structure
→ name the model
→ write recognition cues
→ write the shortest reliable answer structure
→ extract only supported derived conclusions
→ record limits and traps
→ design a transfer check
→ link any knowledge gap
→ set review state
```

## Promotion basis

Use `draft` for a plausible structure that still needs another observation or
learner check. Promote to `active` when either:

- at least two linked observations support the same recognition-and-action
  pattern; or
- the learner, a teacher, or an authoritative source explicitly contributes a
  reusable method.

Do not count repeated copies of one event as independent support. Record the
linked evidence, conflicting examples, and the reason for promotion. An answer
template is a decision sequence, not a copied worked solution. A derived
conclusion must state its conditions and evidence; do not invent a convenient
shortcut from incomplete material.

Ask the learner for their reasoning when it is necessary to test the diagnosis
or make the model theirs. AI-generated synthesis remains editable derived
state. Creating, activating, or ingesting a model does not demonstrate that the
learner can recognize or use it.

## Evidence boundary

The existence of a good model file does not mean the learner has mastered it.
Keep model quality separate from learner evidence. Use review or event records
for observed performance.

Do not create a permanent model from one ambiguous or incomplete event unless it has clear future value; keep it as a draft or gap instead.

After refinement, generate or link a sufficiently fresh transfer check. Use
its later result to revise the model, diagnosis, and next action. A model that
does not change later recognition, action, or question selection is a summary,
not a completed learning loop.

## Output

```text
Model created or refined:
Subject path:
Grounding source:
Promotion basis and evidence links:
Linked gap:
Transfer check:
RAG status: not-needed / pending-authorization / unavailable / inserted
Files updated:
```
