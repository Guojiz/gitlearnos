# GitLearnOS Setup

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

1. explain the recommended three-layer arrangement in plain language;
2. identify the target;
3. test actual read, write, Git, source, memory, project-instruction, Skill, and
   scheduling capability;
4. inspect existing files;
5. guide the learner through only the choices or actions tools cannot complete;
6. preserve existing work.

```text
project sources or an authorized local source folder
→ large textbooks, PDFs, scans, media, and reference collections

learner Git repository
→ compact structured state, evidence locators, questions, answers, and history

native memory when available
→ activation pointer and stable preferences
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
learning-policy.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

Then create real state under only the required subject folders:

```text
subjects/<subject>/inbox/
subjects/<subject>/sources/
subjects/<subject>/models/
subjects/<subject>/knowledge-gaps/
subjects/<subject>/handoffs/
subjects/<subject>/reviews/
subjects/<subject>/events/
archive/
```

Do not add empty scaffolding.

## Setup order

1. capture the first goal or input and infer or confirm its subject;
2. establish the persistent project/source area and place or link large
   learning files there when available and authorized;
3. create `gitlearnos.yml` from the example, copy the template's thin
   `templates/AGENTS.md` entry when accessible or generate its equivalent from
   `core-contract.md`, and establish
   `learning-policy.md` with `safe-auto` unless the learner requests
   preview/manual;
4. install the single Skill folder in the main agent's native location, install
   the matching repository entry file, provide adapted project/custom
   instructions, configure the native-memory pointer when permitted, and report
   every surface with a verified status;
5. create minimal profile and dashboard with one next action;
6. organize the first real input or gap;
7. generate questions only when useful;
8. run an AI session only when the learner requests it;
9. verify with an implicit trigger that the agent can identify state, act,
   write, report, and honor undo boundaries without requiring a Skill name.

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
Activation surfaces:
Skill installation: installed / source-only / unavailable / unknown
Project/custom instructions:
Memory: saved / suggested / unavailable / unknown
Changed files:
First organized path:
Questions prepared:
Still missing:
Next action:
```
