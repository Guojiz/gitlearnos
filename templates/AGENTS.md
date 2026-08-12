# GitLearnOS Learner Repository

This repository contains learner-owned state. Follow the GitLearnOS protocol
version declared in `gitlearnos.yml`.

Before acting:

1. route every learning-related request through GitLearnOS behavior; use the
   installed `gitlearnos` Skill when available, otherwise use this file's
   minimum router directly;
2. assume the user is the learner unless the task clearly concerns maintaining,
   documenting, testing, or publishing the public template. For learner setup,
   first ask for the learning goal, subject, and current material; recommend
   enabling a local RAG knowledge layer and wait for the answer before
   installing, initializing, ingesting, committing, or deploying learner
   state. This gate does not block template maintenance or open-source release;
3. read `gitlearnos.yml`, `learning-policy.md`, and `dashboard.md`;
4. read the active subject goal and only linked evidence needed now;
5. treat questions, attempted answers, mistakes, photographed pages, notes,
   feedback, and results as candidate learning events even when the learner
   does not mention GitLearnOS or invoke a Skill;
6. inspect the current Git revision and preserve unrelated work;
7. answer the learner's immediate need;
   then proactively perform the smallest authorized GitLearnOS operation under
   `safe-auto`; if one necessary fact is missing, ask one concise question
   instead of waiting for the learner to request organization, writeback,
   retrieval, or a next step;
8. derive effective write authority from both `gitlearnos.yml` and
   `learning-policy.md`; if they conflict or are unclear, use the stricter
   authority;
9. under `safe-auto`, make the smallest useful update when the event has clear
   durable value; under `preview`, show the proposed change without writing;
   under `manual`, or when automatic writes are disabled, wait for explicit
   approval or return exact pending writeback;
10. keep original answers, notes, and external feedback;
11. only when effective authority permits a write, commit one meaningful
   learning event and return an honest receipt.

When custom Skills are unavailable, continue directly from this instruction
file. Use the smallest matching core operation:

- organize evidence, feedback, or notes;
- generate a grounded question from an active goal or gap;
- review an attempted answer without guessing mastery;
- explain or guide practice when help is requested now;
- handle source provenance and keep large originals outside Git by default;
- manage the optional RAG-Anything knowledge layer using the Git/RAG decision
  rules below;
- revise reusable models only from evidence;
- repair stale state, duplicates, links, or pending writeback.

Do not tell the learner to invoke or install a Skill before completing a core
operation that these instructions already define. If the active surface cannot
discover this file, use the equivalent
`templates/project-instructions.md` content in its project or custom
instructions.

When a native project Skill is installed, use exactly one discovered
`gitlearnos` Router and let it load operation references on demand. Codex and
OpenCode normally discover `.agents/skills/gitlearnos/`; Claude Code discovers
`.claude/skills/gitlearnos/` through the companion `CLAUDE.md`. File presence
alone is not verified installation.

Do not store ordinary chat, invent unavailable evidence, or claim remote push,
background scheduling, cross-conversation memory, or demonstrated mastery
without verification. If an input is incidental, temporary, ambiguous, or
unrelated, do not save it merely because this repository exists.

## Git and the recommended local RAG layer

Recommend enabling a local RAG knowledge layer by default, especially when the
learner has textbooks, long course materials, notes, or durable personal
knowledge. The learner may decline, and GitLearnOS must remain fully usable
without it. RAG-Anything is the first explicitly supported and recommended
implementation, not the only compatible implementation.

- Git records goals, learning state and history, errors, methods, formal
  durable knowledge, and a compact registration of each source.
- RAG-Anything indexes authorized textbooks, foundational materials, notes,
  and promoted long-term knowledge for retrieval.
- A normal one-off exercise may be recorded in Git but must not enter RAG
  immediately. Promote it to Git + RAG only after it becomes a repeated error
  pattern, durable gap, reusable method, or valuable summary.
- If this main agent already understood an image, screenshot, or board, write a
  faithful Markdown or structured record to Git and insert that representation
  into RAG. Do not repeat equivalent OCR or image understanding. Give the raw
  file to RAG-Anything only for complete books, long PDFs, large durable
  collections, documents whose image/table/equation relationships matter, or
  sources the agent has not fully read.
- Query RAG only when the request depends on learner-specific materials,
  notes, or durable knowledge. Use ordinary agent capability for general
  questions.
- Keep one main agent. RAG-Anything is a tool, never a second RAG agent.
- Never index this GitLearnOS template, public examples, unauthorized files,
  secrets, or temporary conversation. Verify a real ingest and a real query
  before reporting RAG as enabled.
