# GitLearnOS Organize

Follow the evidence, ownership, write-authority, and Git rules in
the Router's core contract. This reference only defines the organization
workflow.

## Goal

Turn one natural-language learning event into the smallest correct durable state change. The learner describes what happened; do not ask them to choose repository paths.

## Implicit triggers

Consider this workflow when a learner:

- sends a page, screenshot, worksheet, handwritten note, or book excerpt;
- reports what a teacher, tutor, class, peer, or platform said;
- shares a mistake, correction, result, useful method, or changed deadline;
- asks a subject question whose context has durable value for an active goal.

Do not delay the immediate answer just to organize files. Under `safe-auto`,
make the smallest write after answering when subject, value, privacy, and target
are clear. If the material is private or its role is uncertain, suggest capture
briefly or ask one necessary question. Do not store the full image or original
file unless authorized; a faithful note, locator, and inspected excerpt may be
enough.

If the model cannot see an image, do not invent its content or a diagnosis from
it; prefer an available multimodal or vision-capable helper model, then a local
OCR or parser, then asking for the text, or route the original to an authorized
parser. Record a low-confidence transcription as a locator with
`needs-transcription`, not as inspected content.

## Read

1. `learning-policy.md` when present;
2. root `dashboard.md` and the active subject entry;
3. the goal and candidate gaps, sources, models, handoffs, and reviews under `subjects/<subject>/`;
4. the input or authorized original.

Do not scan unrelated subjects.

## Normalize the event

Record only what is needed. `occurred_at`, `subject`, `channel`, `summary`, and
`linked_goal` are the portable minimum. Add the remaining fields only when they
change future work:

```yaml
occurred_at:
subject:
channel: teacher | class | tutoring | paper | book | platform | exam | peer | ai | other
track: school | self-study | mixed
need: current-course | remediation | exam | exploration | advance | project | research | skill
event_type: note | mistake | question | handoff | external-feedback | result | resolution | correction
source_availability:
summary:
linked_goal:
linked_gap:
evidence_type: reported | source-supported | demonstrated | not-assessed
privacy:
next_action:
```

For a problem-solving event, add only the fields that the available work can
support:

```yaml
situation_fingerprint:
learner_judgment:
outcome: incorrect | partial | correct | not-assessed
support_used:
diagnosis_status: unknown | learner-reported | agent-hypothesis | source-supported
missing_information:
reasoning_break:
execution_error:
recognition_cues:
same_pattern_as:
```

Keep the learner's judgment and outcome as evidence. Treat
`missing_information`, `reasoning_break`, and `execution_error` as revisable
diagnoses. When the learner's original decision is unavailable, do not infer
why they made it.

Use a concise activity record only when the event materially changes state. Do not store full transcripts or hidden reasoning.

## Organize

```text
identify provenance
→ infer or confirm subject
→ find existing state
→ deduplicate
→ link rather than copy
→ update resolution and next action
→ link repeated situations by cue, concept, and error mechanism
→ extract or refine a model only when reusable evidence supports it
→ refresh dashboard
```

One exercise does not automatically need its own permanent event, gap, or
model. Keep a useful one-off mistake as a compact event or review record. When
another distinct observation matches the same situation fingerprint, link it
to the existing gap and update the evidence count instead of creating a second
gap. Use a stable semantic fingerprint, not the exact problem wording or
numbers.

Promote a model when at least two linked observations support the same
structure, or when the learner, a teacher, or an authoritative source explicitly
provides a reusable method. Record the promotion basis and conflicting
evidence. Model creation never upgrades mastery and never requires RAG.

Use:

- `subjects/<subject>/inbox/` for input that cannot yet be normalized;
- `subjects/<subject>/sources/` for provenance and feedback records;
- `subjects/<subject>/knowledge-gaps/` for problem lifecycle;
- `subjects/<subject>/models/` for durable reusable understanding;
- `subjects/<subject>/handoffs/` for external question and feedback packs;
- `subjects/<subject>/events/` for material cross-channel activity evidence.

If an event spans subjects, choose one primary owner and link the secondary subject. Do not duplicate the same event. Ask only when ambiguity would change the canonical location.

## Reconcile school and self-study

- link one concept, model, or gap to multiple goals instead of duplicating it;
- preserve school deadlines and teacher constraints;
- preserve a visible self-study next action when policy reserves time for it;
- classify self-study that repairs a school prerequisite as `mixed`;
- never silently convert a learner-chosen self-study goal into a school-only task list.

## Do not over-normalize

Not every input is a knowledge gap. It may be a source to revisit, project milestone, open research question, successful strategy, teacher requirement, artifact feedback cycle, or one-off note. Choose state and evidence that match the need.

## External help lifecycle

Use `open`, `resolved`, or `needs-check` for current resolution. When reading an
older repository, preserve its historical value and map it without inventing a
new mastery state:

```text
candidate / active / routed                 → open
awaiting-feedback / needs-verification      → needs-check
resolved-externally / resolved-with-ai      → resolved
verified / archived                         → resolved
```

When the learner says a teacher resolved an issue:

1. accept the operational resolution;
2. record the teacher feedback as reported or source-supported;
3. link the prior handoff and gap;
4. update or create a reusable model only when justified;
5. remove obsolete AI-explanation next actions;
6. schedule verification only when policy permits;
7. do not claim demonstrated mastery without delayed independent evidence.

If the learner says “no review,” record no verification and stop.

## Safe automation

Under `safe-auto`, perform low-risk writes directly and return one receipt. Ask only when input is ambiguous enough to change the wrong goal/gap, or when an action crosses deletion, privacy, visibility, broad-rewrite, or policy boundaries.

When the learner reports that the same mistake happened again, treat that
statement as a new observation when its date or interaction is distinct: append
or link the evidence, update the existing gap's linked-observation count, and
avoid creating a duplicate gap. If you also deliver a question, follow
`question.md` and persist the assigned `planned` review, dashboard change, and
complete commit; an in-chat question alone does not finish the organization
operation under `safe-auto`.

Make repeated input idempotent by matching date, channel, source locator,
linked item, and normalized summary. For repeated problem patterns, also match
subject, target concept, recognition cues, and error mechanism. A maintenance
rerun with no new evidence should create no file and no empty commit.

## Output

```text
Organized:
Subject path:
Linked state:
Resolution change:
Questions generated: none / link
Changed files:
Evidence type:
Next action:
Undo:
```
