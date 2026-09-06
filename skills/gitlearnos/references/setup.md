# GitLearnOS Setup


## Configure once, resume from evidence

Read existing `gitlearnos.yml` and reuse the user's answered setup choices before
asking for missing information. Provider credentials, storage, and source
authorization belong to setup; ordinary learning does not repeat the gate.
Configure `rag.chat` and `rag.embedding` independently (address, model, credential
environment-variable name, and embedding dimensions). Do not select Kimi or
reuse the main agent's provider implicitly. Never write keys into YAML.

For knowledge-layer installation and acceptance, follow [`rag.md`](rag.md).
Commit the authorized source and knowledge-point records first, then ingest and
run `verify` against a known source fact. Commit the resulting receipt separately.
Missing material or an unavailable endpoint leaves deployment `incomplete`; it
does not revoke existing authority to preserve learning evidence in Git.

Follow the core contract loaded by the Router. GitHub is one possible location
for the public template or a target remote; the learner repository may also be
any remote or local Git checkout.

## Boundary

Treat `Guojiz/GitLearnOS` or an authorized copy as the template and the
learner's Git repository as the target. Never place personal state in the
template.

The source template's files under `templates/` are optional conveniences. If
they are not accessible from an installed Skill, generate equivalent thin
repository or project instructions from this reference and
`core-contract.md`; do not stop or pretend an unavailable path was read.

## Capability-first setup

1. read `GITLEARNOS.md` and `START-HERE.md` completely when accessible;
2. unless clearly maintaining or publishing the public template, assume the
   user is the learner. Identify the target, actively ask for the learning
   goal, subject, current material, authorized source boundary, RAG storage,
   and provider constraints. A complete deployment requires a verified RAG
   knowledge layer; RAG-Anything is the first supported option;
3. reuse answers already supplied or verified in target configuration; ask only
   for missing setup facts and wait before dependent actions. Do not repeat
   completed setup during learning. This gate does not apply to template
   maintenance, documentation, tests, or open-source release;
4. explain the recommended layers in plain language;
5. test actual read, write, Git, source, RAG, memory, project-instruction, Skill, and
   scheduling capability;
6. inspect existing files;
7. guide the learner through only the choices or actions tools cannot complete;
8. preserve existing work.

```text
project sources or an authorized local source folder
→ large textbooks, PDFs, scans, media, and reference collections

learner Git repository
→ compact structured state, evidence locators, questions, answers, and history

native memory when available
→ activation pointer and stable preferences

required local RAG layer for complete deployment
→ authorized foundational materials, notes, and promoted durable knowledge
```

Prefer a persistent ChatGPT Project's **Sources** section for large learning
files when that is the active platform. Chat and Work conversations in the
project can then use the shared project context. On another agent, choose its
equivalent project file area or an authorized local source folder. Do not put
large originals in Git merely because the repository is available.

## Durable activation

Install the behavior on the smallest durable surfaces the runtime actually
supports:

1. always place the learner `AGENTS.md` in the target repository;
2. for Claude Code, also place the thin learner `CLAUDE.md` adapter in the
   target so Claude loads `AGENTS.md`;
3. when the surface supports project or custom instructions, install the
   template's adapted `templates/project-instructions.md` when accessible, or
   an equivalent compact router generated from `core-contract.md`; do not
   merely link to a file that the surface cannot read;
4. when native memory is enabled and permitted, use the template's
   `templates/native-memory-pointer.md` when accessible, or create an
   equivalent pointer that stores only the activation state, target,
   proactive-assistance preference, and stable learner preferences; verify what
   the runtime actually retained;
5. install or expose the router Skill when supported, but never make explicit
   Skill invocation the only activation path.

### Install one self-contained Skill folder

The source is the complete `skills/gitlearnos/` directory containing
`SKILL.md`, `references/`, and optional interface metadata. Copy the whole
folder, not only `SKILL.md`, to one native project location:

| Main agent | Project installation |
|---|---|
| Codex | `.agents/skills/gitlearnos/` |
| Claude Code | `.claude/skills/gitlearnos/` |
| OpenCode | `.agents/skills/gitlearnos/` |
| ChatGPT desktop Skills | install the folder through the available Skills UI or personal Skill workflow |
| another agent | use its documented Agent Skills location; otherwise report Skills unavailable |

OpenCode also discovers `.claude/skills/` and `.opencode/skills/`, but use
`.agents/skills/` by default so one copy serves the open Agent Skills layout.
Do not create `.agents` and `.claude` copies merely for theoretical
compatibility. GitLearnOS uses one main agent; install its native copy and let
project instructions cover secondary no-Skill surfaces. If the learner truly
uses Codex and Claude Code against the same repository, install both only after
explaining that OpenCode may see duplicate names, and verify each copy after
updates.

File presence is not successful installation. Verify all of the following:

1. the runtime's Skill list exposes `gitlearnos` with its current description;
2. an indirect prompt such as a subject question or photographed note can cause
   implicit selection without naming GitLearnOS;
3. the selected Skill can open `references/core-contract.md` and one operation
   reference;
4. report the result as `installed`, `source-only`, `unavailable`, or `unknown`.

For a scheduled OpenCode main-agent run, explicitly select the learner-approved model
instead of inheriting OpenCode's interactive default. Verify the model shown in
the scheduled-run log. If it must read an authorized source outside the learner
repository, grant that exact directory to the non-interactive runtime before
verification; an auto-rejected `external_directory` request leaves source
access unverified even when the scheduled run exits successfully.

Explain the result to the learner. In particular, tell them which future
surfaces can notice questions, answers, photographed material, notes, feedback,
and results automatically. If memory, Skills, Git, or remote sync are
unavailable, say so and preserve the behavior through the remaining surfaces.
Report a drafted but unverified memory entry as `suggested` or `unknown`, never
as saved.

Project or custom instructions must carry the minimum operation router:
organize, question, review, teach, source, model, and maintenance. This compact
fallback is intentional duplication of core behavior so a no-Skill surface can
still act. Keep detailed procedures in Skills and keep changing learner state
in Git.

Guide setup one unavoidable step at a time. Do not dump a long platform
checklist or ask the learner to create files the agent can create. Recommend a
default, explain the tradeoff briefly, complete safe work, and verify the result
before moving on.

For ChatGPT, distinguish verified capability by surface. A local project may
provide files and Git while an ordinary Chat surface may hide technical Git
details or not expose Skills. Chat may still be a useful daily entry when the
target repository and persistent instructions are available. Work is better for
larger multi-step organization or maintenance. Do not promise a particular
credit treatment; plan and workspace limits may differ.

## Minimum state

Create only what the first goal or input needs:

```text
AGENTS.md
gitlearnos.yml
automation.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

Then create real state under only the required subject folders:

```text
subjects/<subject>/inbox/
subjects/<subject>/sources/
subjects/<subject>/knowledge/
subjects/<subject>/models/
subjects/<subject>/knowledge-gaps/
subjects/<subject>/handoffs/
subjects/<subject>/reviews/
subjects/<subject>/events/
archive/
```

Do not add empty scaffolding.

## Required recurring automation

After the learner answers the deployment gate, establish both canonical jobs:

- `maintenance`: recurring organization, default daily at 21:30 in the
  learner's local IANA time zone;
- `due-review`: recurring question generation, default daily at 07:00 in the
  learner's local IANA time zone.

The learner may change the times. Ask only one concise scheduling question when
the time zone cannot be inferred safely; default quiet hours to 22:00–before
07:00 (excluding 07:00),
delivery to the current authorized learning channel, and each due run to at
most three questions. Persist the requested recurrence
   and delivery preferences in `gitlearnos.yml`, and create `automation.md`
from its template as the single scheduler-status record.

Create each recurring task through a real repository-capable scheduler, record
its opaque provider ID and next run as `configured`, then execute one safe test
occurrence. Mark it `verified` only after observing both the scheduler entry and
the scheduled main-agent run's repository access. A no-work test may correctly return `skipped`
without a commit.

Do not report deployment automation complete until both jobs are `verified`.
Use `requested` while provisioning is pending. If capability inspection finds
no suitable scheduler, record both exact schedules with state `unavailable`,
report automation `incomplete`, and identify the missing runtime capability.
An on-handoff check or reminder does not satisfy this gate, though immediate
learning may continue.

## Setup order

1. after the learner answers the deployment gate, capture the first goal or
   input and infer or confirm its subject;
2. establish the persistent project/source area and place or link large
   learning files there when available and authorized;
3. create `gitlearnos.yml` from the example, copy the template's thin
   `templates/AGENTS.md` entry when accessible or generate its equivalent from
   `core-contract.md`, and establish
   `gitlearnos.yml` with `safe-auto` unless the learner requests
   preview/manual;
4. install the single Skill folder in the main agent's native location, install
   the matching repository entry file, provide adapted project/custom
   instructions, configure the native-memory pointer when permitted, and report
   every surface with a verified status;
5. create minimal profile and dashboard with one next action;
6. create, test, and record both recurring automation jobs;
7. organize the first real input or gap;
8. generate questions only when useful;
9. run an AI session only when the learner requests it;
10. verify with an implicit trigger that the agent can identify state, act,
   write, report, and honor undo boundaries without requiring a Skill name.

Load [`rag.md`](rag.md) during every learner deployment and follow its
deployment, ingestion, and verification rules. If the RAG layer cannot be
configured and verified, preserve the usable Git learning loop but label the
deployment `incomplete`.

## Migration

- inventory before moving;
- map existing notes to `subjects/<subject>/` goals, sources, models, gaps,
  events, or archive;
- treat legacy `sessions/` as `events/` when those files are useful learning
  records rather than complete chat logs;
- preserve paths that support learner habits or links;
- ask before broad moves or overwrites;
- migrate one active learning path first;
- route new state immediately, but move old single-subject paths gradually when link safety matters.

## Output

```text
Target:
Subject path:
Capabilities:
Policy:
Project or source workspace:
RAG-Anything: enabled / incomplete / unavailable / unknown
Activation surfaces:
Skill installation: installed / source-only / unavailable / unknown
Project/custom instructions:
Memory: saved / suggested / unavailable / unknown
Changed files:
First organized path:
Questions prepared:
Recurring organization:
Recurring questions:
Deployment automation: verified / incomplete
Still missing:
Next action:
```
