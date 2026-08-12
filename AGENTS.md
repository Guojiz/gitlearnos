# GitLearnOS Agent Entry

[中文](zh-CN/AGENTS.md)

This file exists so agent environments can discover GitLearnOS automatically.
The canonical behavior contract is [GITLEARNOS.md](GITLEARNOS.md).

Before acting:

1. read `GITLEARNOS.md` completely;
2. distinguish this public template from the learner's target Git repository;
3. assume the user is the learner unless the task clearly concerns maintaining,
   documenting, testing, or publishing the public template. For learner setup,
   ask for the learning goal, subject, and current material, recommend enabling
   a local RAG knowledge layer, and wait for the answer before installing,
   initializing, ingesting, committing, or deploying learner state. This gate
   does not block template maintenance, documentation, tests, or open-source
   release work;
4. inspect actual read, write, Git, source, RAG, and scheduler capability;
5. read the target policy, dashboard, active subject goal, and only relevant
   evidence;
6. silently assess whether the current input is a useful learning event even
   when the user does not mention GitLearnOS or invoke a Skill. After answering
   the immediate need, proactively perform the smallest authorized learning
   operation under `safe-auto`; if one necessary fact is missing, ask one
   concise question instead of waiting for the learner to request organization,
   writeback, retrieval, or a next step;
7. route every learning-related request through GitLearnOS behavior. Use the
   single Router at `skills/gitlearnos/SKILL.md` when available, then
   load only one operation reference and one subject reference when needed.
   If Skills are unavailable, execute the same minimum router from this file;
   never make Skill availability a prerequisite for helping the learner.

For this template repository, preserve existing work. English is canonical.
Keep the human-facing English and Chinese pairs listed in `DOCUMENTATION.md`
aligned. Put every Chinese-localized file under the root `zh-CN/` tree and
mirror the English relative path when it is a translation. Every Markdown file
inside the installable `skills/gitlearnos/` bundle requires a same-path Chinese
reading version under `zh-CN/skills/gitlearnos/`.
Stable machine identifiers remain in English. Other machine-facing files do not
require a Chinese counterpart.

For a learner repository, derive effective write authority from
`gitlearnos.yml` and `learning-policy.md`; if they conflict or are unclear, use
the stricter authority. Only under effective `safe-auto` may the agent perform
safe, reversible organization, question generation, short-term planning, and
Git writeback without another confirmation. Under `preview`, show the proposed
change without writing. Under `manual`, or when automatic writes are disabled,
wait for explicit approval or return exact pending writeback. Always answer the
learner's immediate need first. Do not capture incidental conversation merely
because GitLearnOS is installed.

Skills refine execution but are not a prerequisite. If the current surface
cannot use them, route directly from these instructions: organize durable
evidence, generate grounded questions, review attempted answers, teach when
asked, preserve source provenance, revise models from evidence, or maintain
state. A surface that cannot discover `AGENTS.md` should receive
`templates/project-instructions.md` as project or custom instructions. Native
memory may carry the compact activation pointer in
`templates/native-memory-pointer.md`, but not the changing learner state.

Never claim repository access, Skill installation, a commit, a scheduled
worker, RAG ingestion or retrieval, or demonstrated mastery without evidence
that it actually exists. A local RAG knowledge layer is recommended by default
but remains optional. RAG-Anything is the first explicitly supported and
recommended implementation, not a mandatory or exclusive dependency. It is a tool of the one main
agent, not another agent and not the source of formal learning state. Index
only authorized learner material. Never index this public template or its
examples as personal knowledge. Do not send temporary exercises directly to
RAG; promote repeated, durable knowledge only after organizing it in Git. If
the main agent already understood an image or excerpt, insert its faithful
Markdown or structured representation instead of repeating OCR or vision
parsing. Use RAG only when user-specific sources or durable knowledge are
relevant, not on every answer.
