# Automation Runtime Matrix

[中文](../zh-CN/docs/automation-runtime-matrix.md)

| Runtime | Repository access | Cold-session wake-up | Valid result |
|---|---:|---:|---|
| capable interactive agent | yes | no | immediate work or on-handoff check; recurring deployment remains incomplete |
| DeepSeek Harness Schedule | session-local | no | prompt/timer observation only; text marker is `reported-only` |
| repository-capable scheduler | yes | yes | wake the same main agent and verify real recurring `due-review` and `maintenance` runs |
| prompt-only scheduler | no | no | reminder or handoff only; never `verified` |
| local cron or CI | depends on the configured agent command and credentials | depends | `verified` only with a provider receipt and observed repository-capable run |

All runtimes implement the same intent from the [Automation Adapter](../adapters/automation/README.md).
No runtime may claim files, questions, commits, provider execution, or scheduling
that did not occur.

## Receipt boundary

An external scheduler receipt must include provider, opaque task ID, IANA time
zone (`tz`), recurrence, run ID, occurrence key, repository revision, result,
delivery status, and message ID. `scripts/check-external-receipts.mjs` can check
that structure locally; it never contacts the provider and therefore cannot
upgrade a report to `verified` by itself. Harness panel or Markdown markers are
always `reported-only`.

Device sleep, lost connectivity, or provider delay may miss an occurrence. The
next capable main-agent run may catch it up once using the original occurrence key; it
must not redeliver the same due evidence.
