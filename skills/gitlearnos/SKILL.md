---
name: gitlearnos
description: On each learner interaction, recognize useful learning events and route them in a learner-owned Git repository to the smallest GitLearnOS setup, organization, question, review, tutoring, source, model, or maintenance workflow. Consider this Skill when the learner asks a subject question, attempts an answer, shares a page or notes, reports feedback or results, or reveals a learning need—even without naming GitLearnOS or invoking a Skill.
---

# GitLearnOS Router

[中文](../../zh-CN/skills/gitlearnos/SKILL.md)

Read `GITLEARNOS.md` before acting. That protocol owns evidence, repository,
permission, automation, and Git behavior; this Skill only selects the smallest
workflow.

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

Skills are optional execution guides. `AGENTS.md`, project instructions, native
memory, or the input itself may activate this router on a surface where Skills
are unavailable. `templates/project-instructions.md` carries the compact
no-Skill router, and `templates/native-memory-pointer.md` carries the
cross-conversation activation pointer.

## Read minimum context

1. distinguish the public template and the learner repository;
2. detect actual read, write, Git, source, and scheduler capability;
3. read target `learning-policy.md`, dashboard, active subject goal, and only
   directly related evidence;
4. honor device, bandwidth, time, language, and delivery constraints with the
   smallest useful interaction;
5. infer the subject and ask only when a wrong write would otherwise occur;
6. load one primary Skill and a helper only when necessary.

## Route by intent or evidence

| Intent | Skill |
|---|---|
| create or migrate minimum state | `skills/gitlearnos-setup/SKILL.md` |
| record, organize, deduplicate, or reconcile feedback | `skills/gitlearnos-organize/SKILL.md` |
| generate learner questions or an external handoff | `skills/gitlearnos-question/SKILL.md` |
| administer an existing question and write back evidence | `skills/gitlearnos-review/SKILL.md` |
| live AI explanation or guided practice requested now | `skills/gitlearnos-session/SKILL.md` |
| source access, provenance, privacy, or completeness | `skills/gitlearnos-source/SKILL.md` |
| extract reusable understanding | `skills/gitlearnos-model/SKILL.md` |
| repair state, links, duplicates, or undo scope | `skills/gitlearnos-maintenance/SKILL.md` |

Do not turn note capture, teacher feedback, or preparation for human help into
an AI tutoring session.

## Finish

Return the receipt required by `GITLEARNOS.md`. Do not claim a write, commit,
scheduled run, source access, or demonstrated mastery that was not observed.
