# GitLearnOS Agent Entry

[中文](zh-CN/AGENTS.md)

This file exists so agent environments can discover GitLearnOS automatically.
The canonical behavior contract is [GITLEARNOS.md](GITLEARNOS.md). This
repository is the public GitLearnOS template, not a learner's state
repository; never write personal learning state here.

Before acting:

1. read `GITLEARNOS.md` completely;
2. distinguish this public template from the learner's target Git repository;
3. distinguish this public template from the learner's target repository. For
   learner setup, ask one setup gate for goal, subject, current material, and
   the optional local RAG choice; wait before installing, initializing,
   ingesting, committing, or deploying learner state. Treat facts already
   supplied by the user or verified in the target config as answered and do
   not ask them again. This gate does not block template maintenance,
   documentation, tests, or open-source release work;
4. inspect actual read, write, Git, source, RAG, and scheduler capability;
5. read target `gitlearnos.yml`, dashboard, active subject goal, and only
   relevant evidence. Read a target `learning-policy.md` only as a one-time
   migration input, never as active configuration;
6. silently assess whether the current input is a useful learning event even
   when the user does not mention GitLearnOS or invoke a Skill. After answering
   the immediate need, proactively perform the smallest authorized learning
   operation under the mode in `gitlearnos.yml`; if one necessary fact is
   missing, ask one concise question instead of waiting for a repository
   command;
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
`gitlearnos.yml` only. A legacy `learning-policy.md` cannot change it and is
read once only for migration. Current natural-language instructions override
stable config for that event (for example, “record only” or “preview first”)
and expire afterwards. Under `safe-auto`, make safe reversible changes;
under `preview`, show the exact proposal; under `manual`, or disabled automatic
writes, wait for approval or return pending writeback. Always answer the
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
main-agent run, RAG ingestion or retrieval, or demonstrated mastery without evidence
that it actually exists. A local RAG knowledge layer is recommended by default
but remains optional. RAG-Anything is the first explicitly supported and
recommended implementation, not a mandatory or exclusive dependency. It is a
tool of the one main agent, not another agent and not the source of formal
learning state. Index only explicitly authorized learner material within the
configured per-source scope. Never index this public template or its examples
as personal knowledge. Do not send temporary exercises directly to RAG;
promote repeated, durable knowledge only after organizing it in Git. If the
main agent already understood an image or excerpt, insert its faithful
Markdown or structured representation instead of repeating OCR or vision
parsing. Use RAG only when user-specific sources or durable knowledge are
relevant, not on every answer.
