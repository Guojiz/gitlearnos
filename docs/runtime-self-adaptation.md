# Runtime Self-Adaptation

GitLearnOS stores portable policy and state; the current main AI supplies execution.

## Detect capabilities, not brand names

```text
template read?
target read/write?
authorized source access?
file-based skills or repository rules?
atomic write or version-history access?
native memory?
project instructions or automatically discovered repository guidance?
real scheduler?
steps the learner truly must perform?
```

Test safe capabilities. A product name does not prove permission.

## ChatGPT Chat and Work paths

Use either Chat or Work when the current ChatGPT project/session actually has
the required repository tools.

| Surface | Best use | Activation when Skills are unavailable |
|---|---|---|
| Chat | everyday questions, answers, photographed notes, short feedback | project instructions, discovered `AGENTS.md`, native memory, and event recognition |
| Work | setup, large imports, multi-file organization, maintenance, and substantial review | the same durable layers plus Skills when exposed |
| Codex | technical repository setup, validation, migrations, and visible Git review | discovered `AGENTS.md`, Skills, and repository state |

Some plans account for Chat and Work usage differently. Treat the current
account and workspace UI as authoritative; do not promise that Chat is always
free or that a specific action consumes no credits. When ordinary Chat preserves
limited Work allowance and still has repository access, prefer Chat for small
daily learning events.

```text
verify target and policy
→ inspect current state
→ recognize an implicit learning event
→ classify the learner event
→ organize or generate targeted questions
→ write safe changes directly
→ verify and return a receipt
```

Do not ask the learner to paste repository content, recreate files, or perform
operations the authorized workspace can complete. Do not require a Skill name:
Skills improve execution where available, but durable instructions and memory
must keep the daily loop usable without them.

For a persistent ChatGPT Project, put large textbooks, PDFs, scans, and reference
files in **Sources** when authorized. Keep compact state and provenance pointers
in Git.

## Repository-agent path

For Codex, Claude Code, Cursor, or a similar checkout-aware agent:

- obey repository instructions;
- inspect existing changes;
- preserve unrelated work;
- use the same organization, question, automation, and evidence rules;
- keep private originals outside public GitHub;
- report validation and changed files.

Use one main agent. Repository tools, search, code execution, and visual tools are capabilities, not separate learning-state owners.

## Read-only path

Without write access:

- process the current input or generate questions;
- read only actually available sources;
- return concise exact pending writeback;
- mark the repository unchanged;
- keep stable preferences separate from fast-changing state.

## Three automation tiers

### Immediate

Actually organize, generate, and write during the current interaction.

### On handoff

Whenever an agent resumes, inspect:

- unprocessed inbox items;
- due questions;
- waiting external feedback;
- obsolete tasks after resolution;
- one current next action.

Run this check when the new interaction is learning-related or a scheduled
maintenance run begins. Do not hijack an unrelated conversation.

### Background

Create only through an actual scheduler exposed by the runtime.

```text
date or instruction in a file ≠ scheduled automation
real scheduler task with verified state = scheduled automation
```

Immediate and on-handoff behavior remain available when no scheduler exists.
For a complete learner deployment, however, the runtime must provision and
verify both required recurring background jobs; otherwise deployment
automation is explicitly `incomplete`.

## Configuration and safety

Read `gitlearnos.yml`, the only active durable configuration. Under `safe-auto`, ordinary low-risk reversible state changes proceed without repeated confirmation. Ask before deletion, broad overwrite, configuration change, visibility change, private publication, sensitive identity, secrets, or license changes. A legacy `learning-policy.md` is migration input only.

Repeated input should be idempotent. Prefer one event per atomic update and report whether safe undo is available.

## Rule

Adapt execution, not product guarantees. Every runtime should preserve
cross-channel provenance, implicit learning-event recognition, targeted question
quality, evidence honesty, automatic writeback when authorized, and learner
control. `AGENTS.md` and repository state are portable; native memory, project
sources, Skills, and credit behavior are runtime adapters.
