# Automation Adapter

[中文](README.zh-CN.md)

GitLearnOS stores portable intent. A scheduler or capable agent performs it.
[`tasks.example.yml`](tasks.example.yml) is the minimal portable definition.
`schedule: null` means no background delivery has been configured.

## Two portable jobs

### `due-review`

At run time:

1. open the current dashboard and due review links;
2. read the active goal, linked evidence, and recent questions;
3. generate a small set of fresh, answerable questions;
4. deliver the questions in the current channel;
5. write back only after an answer or material state change;
6. report what actually ran.

The output is not merely “remember to review.”

### `maintenance`

Inspect unprocessed input, waiting external feedback, stale dashboard links,
contradictory derived state, and due work. Make only safe reversible repairs;
queue uncertain work without guessing.

## Execution modes

| Mode | Meaning |
|---|---|
| immediate | completed in the current interaction |
| on-handoff | checked whenever a capable agent resumes |
| background worker | a real scheduled run with repository access |
| prompt-only reminder | a handoff; no repository work may be claimed |

ChatGPT Automations, cron, CI, and other schedulers may implement the same two
jobs. Provider-specific schedules stay in the adapter; learning intent and
evidence stay in Git.
