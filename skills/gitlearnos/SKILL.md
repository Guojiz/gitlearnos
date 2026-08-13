---
name: gitlearnos
description: On every learning-related interaction, route the learner through GitLearnOS and select the smallest learner-owned Git setup, organization, question, review, tutoring, source, optional RAG-Anything knowledge, evidence-linked error diagnosis, repeated-pattern model synthesis, maintenance, or required recurring organization-and-question scheduling workflow. Use when the learner asks a subject question, attempts an answer, shares a page or notes, reports a mistake, feedback, or result, reveals a learning need, or wants learning setup or deployment—even without naming GitLearnOS or invoking a Skill.
---

# GitLearnOS Router

When the template repository is accessible, read its root `GITLEARNOS.md`.
Otherwise read [`references/core-contract.md`](references/core-contract.md).
The protocol owns evidence, repository, permission, automation, and Git
behavior; this Skill selects the smallest workflow.

## Activate from the event, not a command

Do not wait for “use GitLearnOS,” “save this,” a Git request, or explicit Skill
invocation. First decide whether the current input is a candidate learning
event. Answer the learner's immediate request before repository administration.

- clear durable value under `safe-auto`: use the smallest matching workflow and
  write back when authorized;
- likely value but uncertain: answer, then make one brief suggestion or ask one
  necessary question;
- incidental or unrelated input: do not load more Skills, scan the repository,
  or mention capture.

Skills are optional execution guides. Repository instructions, project
instructions, native memory, or the input itself may activate the same behavior
on a surface where Skills are unavailable.

## Read minimum context

1. distinguish the public template and the learner repository;
2. unless clearly maintaining or publishing the public template, treat the user
   as the learner. For learner setup, ask for the learning goal, subject, and
   current material, and recommend enabling a local RAG knowledge layer;
   wait for the answer before installing, initializing, ingesting, committing,
   or deploying learner state. Do not apply this gate to template maintenance,
   documentation, tests, or open-source release;
3. detect actual read, write, Git, source, RAG, and scheduler capability;
4. read target `learning-policy.md`, dashboard, active subject goal, and only
   directly related evidence;
5. honor device, bandwidth, time, language, and delivery constraints with the
   smallest useful interaction;
6. infer the subject and ask only when a wrong write would otherwise occur;
7. load one operation reference and one subject reference only when necessary.

## Route by intent or evidence

| Intent | Load |
|---|---|
| create or migrate minimum state | [`references/setup.md`](references/setup.md) |
| record, organize, deduplicate, or reconcile feedback | [`references/organize.md`](references/organize.md) |
| generate learner questions or an external handoff | [`references/question.md`](references/question.md) |
| administer an existing question and write back evidence | [`references/review.md`](references/review.md) |
| live AI explanation or guided practice requested now | [`references/session.md`](references/session.md) |
| source access, provenance, privacy, or completeness | [`references/source.md`](references/source.md) |
| decide, deploy, ingest, promote, or query RAG-Anything | [`references/rag.md`](references/rag.md) |
| extract reusable understanding | [`references/model.md`](references/model.md) |
| repair state, links, duplicates, or undo scope | [`references/maintenance.md`](references/maintenance.md) |

Do not turn note capture, teacher feedback, or preparation for human help into
an AI tutoring session.

When subject-specific form matters, load only one reference from
[`references/subjects/`](references/subjects/README.md).

## Finish

Return the receipt required by the core contract. Do not claim a write, commit,
scheduled run, source access, Skill installation, or demonstrated mastery that
was not observed.
