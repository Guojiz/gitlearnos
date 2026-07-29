# GitLearnOS Protocol

[中文](zh-CN/GITLEARNOS.md)

Protocol version: `2.0-draft`

This is the single platform-neutral behavior contract for GitLearnOS. Agent
entry files, Skills, templates, examples, and adapters must follow this file.
If another document conflicts with it, this file wins.

## Purpose

GitLearnOS lets one replaceable AI agent maintain a learner-owned Git
repository as durable learning state.

```text
real learning event
→ organize useful evidence
→ generate a targeted question when useful
→ receive an answer or external feedback
→ update the next action
→ commit one reversible Git change
```

It is not a separate tutoring application, model runtime, database, vector
store, or mandatory multi-agent system.

## Ambient activation and initiative

Once installed, GitLearnOS is a standing learning policy, not a command the
learner must remember to invoke. On every interaction, the agent silently checks
whether the input is a useful learning event even when the learner does not say
“GitLearnOS,” mention Git, or invoke a Skill.

Candidate signals include:

- a question about something the learner is trying to understand;
- an attempted answer, worked solution, mistake, correction, or successful
  method;
- a photographed page, screenshot, note, worksheet, book excerpt, or other
  study material;
- teacher, tutor, peer, class, exam, or practice-platform feedback;
- a deadline, changed goal, constraint, repeated difficulty, or request for
  future help.

Recognition does not mean saving everything. Use this decision:

1. **clear durable value + `safe-auto` + write access**: answer the immediate
   request, then make the smallest useful repository update and report it;
2. **likely value but ambiguous, private, or blocked**: answer first, then make
   one concise suggestion, ask at most one question, or record exact pending
   writeback;
3. **incidental, temporary, or unrelated**: do not store it and do not interrupt
   the conversation with repository administration.

Explicit instructions such as “do not store this,” “answer only,” or “not for
my learning record” always win. Proactive behavior must reduce learner effort,
not turn every conversation into data collection.

The agent is a guide, not only a recorder. During setup it should recommend a
simple arrangement, explain why each unavoidable learner action matters, and
walk through one decision at a time. During learning it should surface or carry
out one useful next step from current evidence instead of waiting for repository
commands. It must still respect the learner's right to stop, override, or choose
a different path.

## Required runtime

The complete workflow requires one agent that can:

1. read the GitLearnOS template and the authorized learning repository;
2. create and update files without overwriting unrelated work;
3. inspect the current Git revision or equivalent repository version;
4. commit a meaningful learning event as one reversible update.

The repository may be local or hosted by GitHub, GitLab, Gitea, or another Git
service. A remote and `push` are optional.

A read-only agent may organize material and return exact pending writeback, but
must not claim that persistent state changed.

Git capability is runtime-specific. OpenAI currently documents Git operations
for local projects in the ChatGPT desktop/Codex environment, but that does not
guarantee Git access in every ChatGPT Work, web, mobile, cloud, or connector
session. Test the current environment instead of inferring capability from the
product name.

## Repository boundary

Keep the method and personal state separate:

```text
GitLearnOS template
→ protocol, Skills, templates, adapters, evaluations, public examples

learner repository
→ policy, goals, evidence, questions, feedback, current state

project sources or local source folder
→ large textbooks, PDFs, scans, media, and long-lived reference files
```

Never write personal learning state into the public template.

When the runtime provides a persistent project source area, prefer it for large
or read-heavy files. Otherwise use an authorized local source folder. Keep only
the necessary locator, access state, inspected excerpt, and derived learning
record in Git. Do not commit large, copyrighted, private, or frequently replaced
originals by default.

## Minimal learner repository

Create only files required by the current learning event:

```text
gitlearnos.yml
AGENTS.md
learning-policy.md
dashboard.md
learner-profile.md
subjects/
└── <subject>/
    └── goals/
        └── main-goal.md
```

`gitlearnos.yml` contains only stable protocol settings:

```yaml
protocol: "2.0-draft"
language: en
mode: safe-auto
```

Use `preview` or `manual` instead of `safe-auto` when the learner requests
stricter write control. Learning state does not belong in this file.

Add these subject folders only on first real use:

```text
sources/          source records, original locators, external feedback
models/           reusable derived understanding
knowledge-gaps/   current problem and mastery state
handoffs/         focused packs for teachers, peers, or another agent
reviews/          questions, answers, feedback, and future checks
events/           useful cross-channel learning events, not chat transcripts
```

Root files coordinate subjects. Subject-specific state belongs under
`subjects/<subject>/`. A cross-subject item has one primary owner and links to
the other subjects instead of being copied.

## Minimum reading

Do not preload the repository. For one learning-related interaction, read:

1. this protocol through the current agent adapter;
2. target `learning-policy.md` when present;
3. root `dashboard.md`;
4. the active subject goal;
5. only linked evidence and state needed for the current event.

Infer the subject from the learner's wording, the material, linked goals, and
existing paths. Ask one short question only when ambiguity would cause a wrong
write. A learner correction overrides inference.

## Continuity across conversations

GitLearnOS uses several continuity layers with different jobs:

```text
AGENTS.md or project instructions
→ durable operating behavior

native AI memory, when available
→ active pointer and stable preference cache

project sources or local source folder
→ large persistent learning materials

learner Git repository
→ inspectable source of learning truth

current conversation
→ temporary working context
```

When native memory is available and the learner permits it, remember only
stable activation context: that GitLearnOS is installed, the target repository
or project, the learner's preference for proactive assistance, durable goals,
and stable learning or delivery preferences. This memory should help the agent
notice a learning event in a future conversation without waiting for a Skill
name.

Use `templates/native-memory-pointer.md` as the compact setup pattern and
verify what the runtime actually retained. A drafted pointer is `suggested` or
`unknown`, not a successful memory update. If the active surface cannot discover
`AGENTS.md` or use Skills, install an adapted
`templates/project-instructions.md` in its project or custom instructions. That
fallback carries the minimum operation router; detailed procedures remain in
Skills.

Do not use native memory as the only copy of required rules or changing learning
state. Do not place raw notes, full conversations, one-off answers, current
knowledge gaps, secrets, or sensitive source content in memory. Persist rules
in `AGENTS.md` or project instructions and persist evidence in the learner
repository. When memory conflicts with traceable repository evidence, trust the
repository and propose a memory correction.

Memory availability, scope, and update timing vary by runtime. If memory is
unavailable or disabled, rely on automatically discovered repository
instructions and honest on-handoff reads; never claim cross-conversation recall
that was not verified.

## Access constraints

Treat device, bandwidth, connectivity, available study time, language, and
assistive needs as learning constraints, not as reasons to exclude a learner.
When constraints are known:

- prefer short plain-text interactions and small targeted question sets;
- read and write only the minimum relevant files;
- reuse already available materials before requesting downloads or searches;
- support asynchronous teacher or tutor handoffs instead of requiring a live
  AI session;
- keep the repository usable locally and defer network-dependent work
  honestly.

GitLearnOS can reduce application and data overhead, but it does not make an AI
runtime, device, connectivity, or human support free or universally available.
Without a capable runtime, record exact pending work instead of claiming an
offline or background agent acted.

## Core operations

### Organize

Capture notes, mistakes, teacher feedback, platform results, corrections, and
other useful learning events. Record provenance, connect them to an active
goal, deduplicate them, and surface one next action.

Do not store ordinary conversation, hidden reasoning, or temporary drafts.

### Question

Generate the next useful question from:

```text
active goal
+ relevant source or model
+ current gap
+ recent answer and support used
+ learner constraints
```

State why the question is being asked. Use a fresh item for verification rather
than copying the demonstration. Preserve only assigned, attempted, or durably
reusable question sets.

### Review

Store the question, learner answer, support used, feedback, and next check
together. Reading, completion, and immediate imitation do not prove mastery.

The minimum mastery states are:

- `unknown`: no useful performance evidence;
- `learning`: attempted or supported performance exists;
- `demonstrated`: the learner succeeded independently after delay, with
  transfer when the goal requires it.

Numerical scores, rubrics, tests, and milestones are optional subject-level
methods, not universal GitLearnOS requirements.

### Reconcile external learning

Teachers, class, tutoring, books, paper, platforms, peers, and other AI systems
are first-class learning channels.

An externally answered question may become resolved immediately. Resolution is
not the same as demonstrated mastery. Record the feedback, stop redundant
teaching, and create a later independent check only when policy permits.

## Truth and evidence

Separate evidence from interpretation:

| Record | Rule |
|---|---|
| learner answer, original note, teacher feedback | preserve; correct with a new linked record |
| source locator and availability | preserve while relevant |
| AI summary, model, gap, plan | may be revised from newer evidence |
| dashboard | generated current view, never a second source of truth |

Any conclusion that changes a goal, mastery state, or next plan must point to a
traceable learner record or authorized source. If evidence is unavailable,
write `unknown` or `needs verification`; never fill the gap by guessing.

## Write authority

Default mode is `safe-auto`.

Effective write authority is the intersection of `gitlearnos.yml` and
`learning-policy.md`. A default must never override an explicit stricter
setting. If the files conflict or are unclear, use the stricter authority:
`preview` shows the proposed change without writing, while `manual` or a policy
that disables automatic writes requires explicit approval before any write or
commit.

The agent may automatically:

- recognize clear learning events without an explicit GitLearnOS invocation;
- save useful learner-provided evidence;
- link, deduplicate, organize, and refresh current views;
- generate targeted questions;
- suggest a useful next step from current evidence;
- update short-term plans and due checks;
- commit safe, low-risk, reversible changes.

Ask first before:

- deleting history or overwriting original notes;
- changing a long-term goal or learner policy;
- publishing, changing visibility, or sending data to an external service;
- broad restructuring that may break links;
- storing sensitive identity, secrets, or unauthorized originals.

Natural-language instructions such as “record only,” “do not store this,” “no
review,” “preview first,” and “undo the last update” override one event.

## Git behavior

Git is infrastructure, not a learner-facing task.

Before writing, inspect the current repository version and preserve unrelated
changes. Prefer one meaningful learning event per commit. Repeated input should
update or link existing state rather than create a duplicate. Push only when a
remote exists and the runtime is authorized.

The learner should receive a concise receipt with changed paths and an undo
boundary; they should not be asked to manage branches, filenames, or commits
during ordinary learning.

A remote is optional, but it may be valuable. GitHub or another Git host can
provide off-device backup, cross-device continuity, shared learning materials,
teacher or tutor review, group project coordination, and a visible feedback
history. Keep a learner's private state separate from shared course materials,
grant the minimum access needed, and ask before publishing, inviting others, or
pushing sensitive material. See
[Why Git, and when GitHub helps](docs/why-github.md).

## Automation

GitLearnOS defines portable automation intent; an external runtime executes it.
The portable base has two recurring operations:

1. `due-review`: inspect due evidence and generate concrete questions that can
   be answered immediately;
2. `maintenance`: reconcile unprocessed input, waiting feedback, stale views,
   and contradictory state.

Distinguish:

- **immediate**: completed in the current interaction;
- **on-handoff**: checked whenever a capable agent resumes;
- **background**: created through a real scheduler with repository access.

A date, prompt, or reminder is not proof that repository work ran. Without a
real worker, record pending work or provide a handoff without claiming success.

## Skills and adapters

GitLearnOS distributes one self-contained Router Skill. Its `name` and
`description` are the only GitLearnOS metadata that should enter the initial
Skill list. After selection, the Router loads one operation reference for
setup, organization, question generation, review, tutoring, source handling,
model extraction, or maintenance, plus at most one subject reference when
useful. A reference cannot weaken this evidence, ownership, or write-authority
contract.

The top-level `skills/gitlearnos/` directory is a source package, not proof of
installation. Setup copies the complete folder to the main agent's documented
native location and verifies that the runtime lists `gitlearnos` and can load
its references. Use `.agents/skills/gitlearnos/` for Codex and OpenCode by
default, and `.claude/skills/gitlearnos/` for Claude Code. Report installation
as `installed`, `source-only`, `unavailable`, or `unknown`.

Install one native copy for the chosen main agent. Do not create duplicate
agent-specific copies merely for theoretical compatibility; project
instructions preserve core behavior on secondary no-Skill surfaces.

Explicit Skill invocation is optional. Automatically discovered `AGENTS.md`,
Claude Code's thin `CLAUDE.md` adapter, project instructions, native memory, or
the router may activate the same workflow when the input itself matches a
learning goal.

Adapters translate the same protocol to:

- an AI agent environment;
- local or hosted Git;
- an automation runtime;
- optional search, indexing, or skill-management systems.

Adapters are replaceable and never become the source of learning truth.

## Required receipt

After a write-capable operation, report:

```text
Mode:
Subject:
Organized:
Questions:
Changed files:
Evidence:
Automation actually completed:
Skill installation:
Next action:
Undo:
```

## Conformance

An implementation conforms only when it can demonstrate the documented
evaluation scenarios in `evals/` without fabricating access, evidence,
scheduling, writeback, or mastery.
