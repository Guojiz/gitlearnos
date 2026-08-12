# Deployment Guide

Deployment attaches GitLearnOS to one learner-owned target repository and one main agent. It does not install a tutoring platform or multi-agent system.

## Tool-capable fast path

```text
0. read GITLEARNOS.md and START-HERE.md completely
1. unless maintaining the public template, assume the user is the learner; ask for
   the learning goal, subject, and current material; recommend a local RAG layer
2. wait for the learner's answer; do not install, initialize, ingest, commit, or deploy
3. select project sources and the target Git repository
4. verify memory/instructions/Skills/read/write/source/RAG/scheduler capability
5. inspect existing state, AGENTS.md, and learning-policy.md
6. create only missing minimum state and configure durable activation
7. if RAG is enabled, apply the Git/RAG policy and verify one real ingest and query
8. organize the first real input or generate the first targeted questions
9. test with a normal learning event that does not name GitLearnOS
10. verify writeback and return a receipt
```

This learner gate does not apply to maintaining, documenting, testing, or
publishing the public GitLearnOS template.

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
Neither is installing a Python package or writing RAG configuration. RAG is
enabled only after an authorized source is really ingested and a traceable
query retrieves it; otherwise report `unavailable` or `unknown`.
