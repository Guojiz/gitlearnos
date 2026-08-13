# Automation Runtime Matrix

[中文](../zh-CN/docs/automation-runtime-matrix.md)

| Runtime | Repository access | Valid result |
|---|---:|---|
| capable interactive agent | yes | immediate work and fallback on-handoff check; recurring deployment remains incomplete |
| scheduled worker with tools | yes | configure and verify real recurring `due-review` and `maintenance` runs |
| prompt-only scheduler | no | reminder or handoff only; never `verified` |
| local cron or CI | depends on configured agent and credentials | `verified` only after one observed repository-capable test run |

All runtimes implement the same intent from
[the Automation Adapter](../adapters/automation/README.md). They must not claim
files, questions, commits, or scheduling that were not produced.

Device sleep, lost connectivity, or provider delay may miss an occurrence. The
next capable worker may catch it up once using the original occurrence key;
otherwise report it skipped. It must never redeliver the same due evidence.
