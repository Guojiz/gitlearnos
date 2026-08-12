# Quickstart

[中文](zh-CN/QUICKSTART.md)

## You need

- one AI agent that can read and write a Git repository;
- one local or remote target repository;
- one persistent project/source area for large learning files when available;
- one subject, goal, or current learning event.

For learner deployment, the agent must read the protocol completely, assume the
user is the learner, ask for the learning goal, subject, and current material,
and recommend enabling a local RAG knowledge layer. It must wait for the learner's answer before
installing, initializing, ingesting, committing, or deploying.
This gate does not apply to maintaining, documenting, testing, or publishing
the public template.

The agent may initialize a new local Git repository when its environment
supports that operation. A GitHub account is not required.

OpenAI documents Git operations for local projects, but ChatGPT capability
still varies by surface and authorization. Test the current Chat, Work, or
Codex session. Use Chat for small daily learning events when it has repository
access; use Work for guided setup, large imports, and multi-file maintenance.
Skills are helpful but not required.

Some accounts separate Chat from limited Work task credits. The current account
UI is authoritative; GitLearnOS must not promise universal credit treatment.

Put large textbooks, PDFs, scan collections, media, and long-lived references
in the ChatGPT Project **Sources** area or another persistent project/local
source folder. Keep compact learning state and source locators in Git. A remote
is only needed when the learner chooses sync, collaboration, backup, or
publishing.

When enabled, RAG-Anything indexes authorized foundational materials, notes,
and promoted durable knowledge. Git remains the formal source of truth. Do not
send one-off exercises to RAG, repeat OCR the main agent already completed, add
a separate RAG agent, or query RAG for every answer.

## Install durable behavior once

The setup agent should configure every available layer instead of treating a
Skill as the installation:

1. place [`templates/AGENTS.md`](templates/AGENTS.md) in the learner repository;
2. when Claude Code is the main agent, also adapt
   [`templates/CLAUDE.md`](templates/CLAUDE.md);
3. install the complete [`skills/gitlearnos/`](skills/gitlearnos/) folder in
   the main agent's documented native project location and verify that the
   runtime lists `gitlearnos`;
4. adapt and install
   [`templates/project-instructions.md`](templates/project-instructions.md) in
   the AI project's instructions or equivalent custom-instruction field;
5. with permission, adapt
   [`templates/native-memory-pointer.md`](templates/native-memory-pointer.md),
   request the memory update, and verify what was retained.

Default native paths are:

| Main agent | Project path |
|---|---|
| Codex | `.agents/skills/gitlearnos/` |
| Claude Code | `.claude/skills/gitlearnos/` |
| OpenCode | `.agents/skills/gitlearnos/` |

Use one native copy for the chosen main agent. See the
[cross-agent installation map](adapters/agents/README.md#skill-discovery-by-agent).

The project/custom instructions include the minimum organize, question, review,
teach, source, model, and maintenance router, so everyday learning still works
when Skills are not exposed. Memory only wakes this behavior and points to the
target; Git remains the source of truth.

## Send one request

```text
Use https://github.com/Guojiz/GitLearnOS as the GitLearnOS template.
My learning Git repository or local checkout is: <target>

Read GITLEARNOS.md and START-HERE.md completely. Before changing anything, ask
me for my learning goal, subject, and current material. Recommend enabling a
local RAG knowledge layer, using RAG-Anything as the first supported option.
Wait for my answer before any learner
installation, initialization, ingestion, commit, or deployment. Then use
the complete skills/gitlearnos/ folder when Skills are supported. Detect the
main agent, install the folder in its documented native project location, and
verify that its Skill list exposes gitlearnos; a copied source file is not
proof. Do not depend on explicit Skill invocation. Guide me through setup one
necessary step at a time. Use project Sources or an authorized local folder for
large learning files. Configure durable project/repository instructions and,
when available, native memory so future questions, attempted answers,
photographed pages, notes, feedback, and results are recognized as candidate
learning events without me naming GitLearnOS. Detect actual repository, Git,
memory, source, and scheduling capability. Use safe-auto: answer my immediate
need, organize useful evidence, suggest or generate targeted questions when
they serve the goal, and commit safe reversible writeback. Preserve original
answers, notes, and external feedback. Do not store the full conversation or
claim mastery without delayed independent evidence. Finish with activation
surfaces, verified Skill status, changed files, actual automation, the next
action, and the undo boundary.
```

Do not manually create the GitLearnOS folder tree when the agent can do it.

## Minimum first result

```text
AGENTS.md
gitlearnos.yml
learning-policy.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

Only the current subject and real files should exist. Sources, models, gaps,
handoffs, reviews, and events appear on first use.

The main agent may also add one native Skill folder. Claude Code additionally
adds the thin `CLAUDE.md` adapter. These are runtime files, not learner state.

The setup agent should also report:

```text
Daily surface: Chat / Work / other
Project or source workspace:
Repository:
Automatic instructions:
Project/custom instructions:
Memory: saved / suggested / unavailable / unknown
Skills: installed / source-only / unavailable / unknown
Remote backup or collaboration:
```

## Everyday requests

```text
Organize these class notes and give me two fresh questions about the part I
still cannot do.
```

```text
Prepare my unresolved geometry issue as a question pack for tomorrow's tutor.
```

```text
My teacher resolved it. Save this feedback, stop the old reteaching task, and
check me again later with a new problem.
```

```text
Record this only. Do not generate questions or schedule a review.
```

```text
Undo the last learning update.
```

The learner states the event and intent, not repository paths.

After setup, the learner should not need to say “use GitLearnOS.” A normal
question, attempted answer, or uploaded page may be enough:

```text
Why is the third step in this solution valid?
```

```text
Here is today's class-note photo. What did I misunderstand?
```

The agent answers first, then silently decides whether a small durable update is
useful. It does not save every casual conversation.

## Success check

Setup is working when the agent can:

- identify the active goal, evidence, due work, and one next action;
- explain why a generated question serves the current gap;
- preserve original evidence while revising AI interpretation;
- write and commit safe changes without asking the learner to manage Git;
- recognize a useful learning event in a later conversation without a Skill
  name when configured memory or project instructions are available;
- keep large sources in the project/source area and compact state in Git;
- say exactly what automation and repository work actually ran;
- complete the same loop in local Git without GitHub.

Without write access, the agent should return exact pending writeback and say
clearly that the repository did not change.
