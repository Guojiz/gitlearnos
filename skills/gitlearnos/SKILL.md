---
name: gitlearnos
description: Use on any learning-related interaction, including subject questions, attempted answers, shared study material, mistakes, feedback, results, or learning-system setup, even when GitLearnOS is not named. Route through the smallest authorized GitLearnOS workflow, organize learner-owned Git evidence by stable knowledge point, and require verified RAG for complete deployment.
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
   as the learner. For learner setup, ask for the learning goal, subject,
   current material, authorized source boundary, RAG storage location, and
   model/provider constraints; a complete deployment requires verified RAG;
   reuse facts supplied by the user or verified in target configuration. Ask
   only for the next missing fact and wait before the dependent setup action.
   Once setup choices are answered, unavailable RAG does not block authorized
   Git learning writes. Do not apply this gate to template maintenance,
   documentation, tests, or open-source release;
3. detect actual read, write, Git, source, RAG, and scheduler capability;
4. read target `gitlearnos.yml`, dashboard, active subject goal, and only
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
| diagnose an error, stuck attempt, or mastery contradiction | [`references/diagnose.md`](references/diagnose.md) |
| generate learner questions or an external handoff | [`references/question.md`](references/question.md) |
| administer an existing question and write back evidence | [`references/review.md`](references/review.md) |
| live AI explanation or guided practice requested now | [`references/session.md`](references/session.md) |
| source access, provenance, privacy, or completeness | [`references/source.md`](references/source.md) |
| classify knowledge points; deploy, ingest, promote, query, delete, or rebuild RAG | [`references/rag.md`](references/rag.md) |
| extract reusable understanding | [`references/model.md`](references/model.md) |
| summarize linked evidence or prepare a compact handoff | [`references/summarize.md`](references/summarize.md) |
| repair state, links, duplicates, or undo scope | [`references/maintenance.md`](references/maintenance.md) |
| apply quality standards, trim noise, or manage knowledge lifecycle | [`references/standards.md`](references/standards.md) |

Do not turn note capture, teacher feedback, or preparation for human help into
an AI tutoring session. A mistake, stuck attempt, or clash with prior mastery
loads `diagnose.md` before a full explanation or a supported knowledge-gap
write. Expected not-yet-learned requests (“please teach me X; I have not studied
it”) stay on tutor/organize—do not open a full differential diagnosis.

On DeepSeek Harness native tools, pass `learning_route` with explicit
`operations: ["diagnose", ...]` when diagnosis is required. Evolve an existing
gap with `learning_apply` `action: "update"` and matching `expectedContentSha256`;
naive same-id overwrites remain refused.

Operation routing applies to the action actually taken, not only the learner's
opening words. If an organize or live-tutoring response assigns a question for
later answer, load `question.md` before finishing and complete its persistence
and receipt steps. A question left only in chat is not a completed assignment
under `safe-auto` when write and Git access exist.

When subject-specific form matters, load only one reference from
[`references/subjects/`](references/subjects/README.md).

If the learner says “only send the question” (or equivalent), use the
question-intent branch: send only the question stem and purpose, keep the
answer key/rubric in the canonical planned review, and do not teach, score, or
reveal the answer. If a one-tap confirmation is answered while no `planned`
review exists, create one canonical `review` record with `origin: one-tap` and
`status: attempted`; never drop the result into chat-only state.

## Finish

Return the receipt required by the core contract. Do not claim a write, commit,
scheduled run, source access, Skill installation, or demonstrated mastery that
was not observed.

Save Git evidence before RAG synchronization; report persistence, synchronization,
and mastery separately. For a required retrieval or synchronization step, route
to `references/rag.md` next; do not preload it on every learning event. Daily
retrieval needs no known answer, and setup acceptance uses `verify`.
