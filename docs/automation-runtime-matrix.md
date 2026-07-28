# Automation Runtime Matrix

[中文](../zh-CN/docs/automation-runtime-matrix.md)

| Runtime | Repository access | Valid result |
|---|---:|---|
| capable interactive agent | yes | real writeback and on-handoff check |
| scheduled worker with tools | yes | real `due-review` or `maintenance` run |
| prompt-only scheduler | no | reminder or handoff only |
| local cron or CI | depends on configured agent and credentials | run only the capability actually configured |

All runtimes implement the same intent from
[the Automation Adapter](../adapters/automation/README.md). They must not claim
files, questions, commits, or scheduling that were not produced.
