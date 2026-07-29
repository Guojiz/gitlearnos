# GitLearnOS Source Handling

Follow the Router's core contract. Original evidence is preserved; a correction
becomes a new linked record rather than a silent rewrite.

## Implicit source recognition

A page photo, screenshot, pasted paragraph, worksheet, or remembered teacher
comment is a candidate source. Handle the learner's immediate question first,
then record the smallest useful provenance when policy and access permit.
Distinguish what was visibly inspected from what is merely reported. Do not
store an original image, copyrighted page, identity, or sensitive metadata
unless authorized.

## Source states

- `full`: complete authorized source inspected;
- `excerpt`: bounded portion inspected;
- `summary-only`: summary exists, original unavailable;
- `local-only`: original remains outside current access;
- `missing`: referenced but unavailable;
- `uncertain`: provenance or completeness unclear.

## Workflow

Resolve the subject first and store the record under `subjects/<subject>/sources/`. If one source spans subjects, choose a primary owner and link it from the secondary subject rather than duplicating the source record.

```text
input arrives
→ identify channel, provenance, access, and privacy
→ link goal and existing gap/handoff
→ record only what was inspected or reported
→ separate source fact, learner report, and interpretation
→ choose organization, model extraction, or question generation
```

For teacher feedback, record whether it is the learner's recollection, a note excerpt, or an inspectable original. Do not require the teacher's identity unless useful and authorized.

## Integrity

- never reconstruct unavailable wording, figures, answer choices, data, or citations;
- never relabel a summary as a full source;
- treat remembered content as evidence of a learning event, not necessarily the original;
- keep private and copyrighted originals out of public repositories;
- store only the minimum excerpt needed;
- label general-knowledge questions when no source grounds them.

## Output

```text
Channel:
Subject path:
Source state:
Linked items:
Changed files:
Missing material:
Safe next operation:
```
