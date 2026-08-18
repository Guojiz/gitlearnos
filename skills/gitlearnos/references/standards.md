# GitLearnOS Standards — Learning Judgment

Follow the Router's core contract. This reference encodes the judgment layer
that every other operation consults when the decision is not obvious from its
own reference: what matters, what doesn't, what quality looks like, and when to
archive. It does not redefine protocol rules.

## When to apply

Load this reference when:

- deciding whether observed input is worth recording as a learning event;
- prioritizing what to review, check, or teach next across multiple candidates;
- judging whether a learning record meets the quality bar;
- deciding to trim noise from records or archive old knowledge.

Do not load it for every small operation. Consult it only when the
operation-specific reference does not already answer the judgment question.

## Prioritization order

Use this order when allocating attention, ordering the dashboard queue, or
choosing what to teach next. Higher rank wins.

1. **Misconception that blocks later learning** — the learner thinks X is Y,
   not merely "doesn't know X yet." A wrong answer with a clear confusion
   outranks a missing fact.
2. **Overdue or due-today planned reviews** — past their date or due today.
3. **Due-soon planned reviews** — within the configured window.
4. **Open gaps with fresh evidence** — new observations since the last check.
5. **Upcoming reviews** — planned but not due soon.
6. **New work without urgency** — a fresh gap or model draft with no deadline.

Within a bucket: blend urgency × leverage (how much it unlocks); apply
gentleness (no two hard items back-to-back); break ties by subject variety,
then stable ID. Do not reorder on a no-op run.

## Quality gate

Before recording a learning event, ask four questions. All four must pass.

1. **Conclusion**: is there a durable takeaway — something learned, confirmed,
   or found wrong?
2. **Evidence**: is there a linked source, observation, or answer?
3. **Change**: does this change a gap, model, review, or next action?
4. **Consent**: did the learner ask not to store it?

**Skip** when: it's incidental chat, duplicates existing state (update that
instead), is only the reasoning process, or the learner said no.

**When uncertain**: record a minimal event with `evidence_type: not-assessed`
and `next_action: needs-clarification`. Don't build a gap-model-review chain
from uncertain material.

## Trim discipline

A learning record is the **conclusion and its evidence**, not the process that
produced it.

### Remove

- **Chain-of-thought**: "first I considered X, then tried Y" → keep only the
  conclusion.
- **Change narratives**: "updated from v3 to v4 because..." → Git has the
  history; the record only needs the current version.
- **Temporary context**: "during today's session we discussed..." → the
  `occurred_at` field captures when.
- **Decorative prose**: "interestingly," "it is worth noting that" → cut.
- **Agent self-report**: "after reviewing the evidence, the agent
  determined..." → the record IS the determination.

### Keep

- **Invariants**: the stable understanding gained or revised.
- **Pre/post conditions**: what must be true before/after applying it.
- **Linked evidence**: IDs and paths to source material.
- **Gaps**: what is still unconfirmed, wrong, or missing.
- **Conflicts**: evidence that contradicts or limits the understanding.

### Test

Read the record back. If it starts with "but first…" or "after considering…",
trim more. If you can answer "what was learned, from what evidence, what still
needs work" without a narrative prefix, it's clean.

## Archive lifecycle

Judge by **future reuse value**, not age.

| State | Condition | Action |
|---|---|---|
| **Active** | Linked to an open gap, a review within 30 days, or an unresolved conflict | Keep in rotation |
| **Periodic** | Demonstrated once, not yet transferred; review in 30–90 days | Keep, slow rotation |
| **Permanent** | Demonstrated + transferred; model `active`; no conflicts | Keep, stop reviewing |
| **Delete** | One-off noise; fully superseded; never linked to any gap or review | Remove |

### Promotion rules

- Active → Periodic: all linked reviews passed independently, 30 days with no
  new observation of the same gap.
- Periodic → Permanent: demonstrated + transferred, model is `active`, no
  unresolved conflicts.
- Permanent → Active: a new conflicting observation, or a linked model
  regresses to `draft`.
- → Delete: was never linked to any gap, review, or model; or fully superseded
  by a replacement with a `supersedes` link.

Never delete a record that is linked from an active gap, review, or model.
Unlink first, then delete.

## Anti-patterns

Reject these. They look like work but don't improve learning.

**Recording noise**: chat logs as events; full transcripts instead of
normalized records; every minor slip as a separate gap (wait for a pattern).

**Fake mastery signals**: treating AI explanation as learner understanding;
promoting a model from one observation; marking external resolution as
`demonstrated`.

**Churn**: filler questions when nothing is due (`skipped` is valid); dashboard
reordering on a no-op run; duplicate records instead of updating the existing
one.

**Premature structure**: a full gap-model-review chain from one casual question;
promoting a model before a transfer attempt; archiving as "mastered" without
delayed independent evidence.

## Pre-review minimal checks

Before administering a review, check only what's relevant:

1. **Due?** Check the planned date. Not due and no urgent reason → skip.
2. **Linked to what?** Read only the linked gap, model, and previous
   attempts — not the whole subject.
3. **Success condition?** Score against the saved answer key or rubric, not
   general knowledge.
4. **What changed?** Only new evidence on the same gap since last attempt.

Don't scan all subjects, re-read the full dashboard, generate new questions
while scoring, or reorder the queue on a no-op run.

## Output

```text
Standards applied:
Quality gate: passed | skipped (reason)
Trim decision: none | fields removed
Archive decision: none | active→periodic | periodic→permanent | →delete
Next action:
```