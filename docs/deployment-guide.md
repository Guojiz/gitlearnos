# Deployment Guide

Deployment attaches GitLearnOS to one learner-owned target repository and one main agent. It does not install a tutoring platform or multi-agent system.

## Tool-capable fast path

```text
1. guide one necessary setup choice at a time
2. select project sources and the target Git repository
3. identify the subject and current goal/input
4. verify memory/instructions/Skills/read/write/source/scheduler capability
5. inspect existing state and read START-HERE.md, AGENTS.md, and learning-policy.md
6. create only missing minimum state and configure durable activation
7. organize the first real input or generate the first targeted questions
8. test with a normal learning event that does not name GitLearnOS
9. verify writeback and return a receipt
```

Minimum:

```text
AGENTS.md
learning-policy.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

Create only the active subject folder. Add source, gap, model, handoff, review, or activity files inside it only when real use requires them.

## Existing target

- inspect before writing;
- preserve unrelated files;
- map one active path first;
- reuse existing canonical state;
- ask before broad moves, overwrite, deletion, or policy change.

## Runtime selection

| Capability | Path |
|---|---|
| connected target read/write and source tools | direct Chat or Work path |
| local or cloud checkout | repository-agent path |
| context but no write | read-only pending-writeback path |
| pasted excerpts only | focused fallback |

ChatGPT Chat or Work is a direct path when the current project has verified
repository access. Codex, Claude, Cursor, or another capable agent can also be
the one main runtime. Skills are optional. The current product does not need
agent decomposition.

## Success test

Deployment succeeds when the learner can provide one natural-language event and the agent can:

- organize and link it;
- infer and use the correct subject folder without path-by-path instruction;
- generate useful questions when requested or policy-triggered;
- recognize a later useful learning event without a Skill name;
- write safe changes without path-by-path instruction;
- keep large originals in project sources or an authorized local folder;
- report actual automation and every changed file;
- honor preview, record-only, no-review, and undo boundaries.

Creating folders or running a forced AI session is not the success criterion.
