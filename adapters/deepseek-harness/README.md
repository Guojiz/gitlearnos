# GitLearnOS for DeepSeek Harness

This adapter makes GitLearnOS a native installable bundle for the official
DeepSeek Harness **Developer Preview**. It mounts a Host plugin that adds a
`gitlearnos` system-prompt section and four bounded tools:

- `learning_status` reports GitLearnOS coordination files, active goal paths,
  effective write mode, repository-reported RAG and automation markers, and a
  read-only due-review observation (see [Revisit-ready read](#revisit-ready-read));
- `learning_route` selects the relevant GitLearnOS operation and an
  authority-aware next action without performing or claiming writeback.
- `learning_apply` applies a typed event/gap/model/review/dashboard plan as
  one atomic Git commit; `learning_record` remains a compatibility wrapper.

DeepSeek Harness and this adapter are both early integration surfaces. Expect
breaking upstream changes and review the pinned revisions before installing.

An agent taking ownership of further Harness development should begin with the
[development handoff card](DEVELOPMENT-HANDOFF.md). It defines intent,
authority, invariants, and evidence requirements without prescribing features.

## Install

Pin both DeepSeek Harness and this bundle to reviewed commits during the
Developer Preview. Install the GitLearnOS repository root, whose manifest
declares this adapter as its bundle:

```sh
dsh plugin --profile web add github:Guojiz/gitlearnos#<reviewed-commit-sha>
dsh --profile web --dump-config
```

For local development, run `dsh plugin --profile web add .` at the repository
root. For a portable artifact, run `npm pack` there and install the resulting
`.tgz`. The package is ESM JavaScript and has no `prepare` or postinstall
script, so it needs no pnpm build allowance.

Do not omit the commit pin during the Developer Preview: a Git dependency
installs the selected repository sources, so a moving branch could change
executable plugin code. Verify `--dump-config` contains the `gitlearnos-host`
row before treating the adapter as active. This confirms bundle discovery, not
learner-repository write access or completed deployment.

## Remove

```sh
dsh plugin --profile web remove gitlearnos
dsh --profile web --dump-config
```

## Native write transaction

`learning_apply` is intentionally narrower than a general file or shell tool.
It accepts a bounded typed plan of event, gap, model, review, and dashboard
projection operations. Each record receives a canonical lowercase ID and
schema-owned path; dashboard projections may update only `dashboard.md`.
Before writing it requires explicit learner identity, completed setup answers,
an active goal, a clean Git worktree root, and the exact base revision observed
by the caller.

- `safe-auto` may create and commit the whole plan as one transaction. A writer
  lock and revision checks stop concurrent or stale writes; only declared paths
  are staged and committed, so unrelated staged or unstaged work remains untouched.
- `preview` returns the exact Markdown proposal with zero writes.
- `manual` returns `requires-approval` with zero writes. `gitlearnos.yml` is
  the sole stable authority source; legacy policy text is not consulted.
  The tool has no model-supplied approval switch, so the model cannot approve
  its own write.
- An identical retry is `unchanged` and creates no empty commit. Naive reuse of
  an ID with different content, traversal, symlink escape, or a changed Git
  base is refused. Gap, model, and review records may use `action: "update"`
  with `expectedContentSha256` from `learning_status.contentHashes` (utf8
  SHA-256 of the current file, not a Git blob SHA), the exact `baseRevision`,
  and no uncommitted edits on the target. Events cannot be updated this way.
  A successful result includes the commit and `git revert` undo boundary.

This is a typed atomic write path, not arbitrary repository maintenance. The
main GitLearnOS workflow remains responsible for deciding whether evidence is
durable and for choosing the plan.

## Revisit-ready read

`learning_status` is read-only and also reports what the learner should revisit
next. It scans `subjects/*/reviews/*.md` and `subjects/*/models/*.md` and
classifies each file by an explicit `next review`, `next check`, or equivalent
date on the same line:

- `due`: a parseable date that is today or earlier;
- `upcoming`: a parseable date in the future;
- `noSignal`: no parseable next-check date — reported as a count, never guessed.

It also lists `reviewFiles`, `knowledgeGaps`, and `contentHashes` so the agent
can notice existing review sets and active gaps without manual archaeology,
and can fill `expectedContentSha256` for a controlled update. `contentHashes`
is utf8 SHA-256 of current file contents, not Git blob SHA. These fields are
evidence inputs, not a priority queue.

Separately, `queue` returns the learner's **agent-maintained `Next up` list**
from `dashboard.md` verbatim, in the order the agent wrote it. The agent owns
that order (it weighs difficulty, importance, mastery, and retention); this
tool only reads it, never writes it, and it is empty until the agent maintains
it. This is a heuristic over repository text, not a scheduler: it performs no
write, no Git operation, and no external-system request, and it never
fabricates a due date from an unparseable or absent marker. Dates are compared
in UTC, so near-midnight boundaries are advisory.

## Client learning panel

The bundle also ships a browser client half (`adapters/deepseek-harness/client.js`)
that mounts a centered `GitLearnOS ▸` entry in the conversation input dock.
The Agent writes `Panel: expand` or `Panel: collapse` beside its `Next up`
queue, so a new queue revision can arrive open when that is useful or folded
when it would distract. The decision applies once per revision: after that,
the learner's manual toggle wins until the Agent changes the queue or
presentation decision. Opening the panel shows a flat, ordered `name (action)`
list — the order is the agent's judgment, never hard-coded by the Host.

The panel is strictly read-only:

- it fetches its list over a **loopback-only** logical RPC channel (`/gitlearnos`)
  that the Host registers through `ctx.connection.rpc.handle`; remote browsers
  are rejected, and the panel never writes learner state or reorders the queue;
- it reads the agent-maintained `Next up` list verbatim; for a learner repo
  without a maintained queue it stays hidden rather than inventing an order,
  while a non-learner development workspace receives an explicitly flagged
  sample;
- it reads the Agent's explicit presentation decision and a stable revision;
  the 30-second refresh cannot repeatedly reopen a panel the learner closed.

The client entry ships in the already-built `window.__ModuleLoader__.load`
module format, so there is no build step. `dsh.client` (platform `web` and its
`inject` list) plus `exports["./client"]` and the `@deepseek-ai/dsh-*` peer
dependencies are declared in `package.json`.

## Limits

- The Host uses the active process working directory, or an explicit deployment
  `root`. Only `learning_apply` (with `learning_record` compatibility wrapper)
  writes or runs Git, and only within the narrow
  transaction described above. The Host does not invoke RAG or provision
  schedules.
- Reads reject absolute paths, parent traversal, and symlink escapes; cap files
  at 64 KiB, subject entries at 128, and the total due scan at 512 files; and
  inspect fixed coordination files, `subjects/*/goals/main-goal.md`, plus
  `subjects/*/reviews/*.md` and `subjects/*/models/*.md` for the due-review read.
- RAG and automation results are repository evidence markers, not independent
  verification of external systems.
- DeepSeek Harness Schedule is session-local. It cannot wake a cold session and
  does not by itself satisfy GitLearnOS verified, repository-capable recurring
  `maintenance` and `due-review` automation.
- The default DeepSeek provider is text-only, but Harness supports two
  user-chosen visual paths: configure a third-party model whose declared input
  includes `text` and `image`, or keep DeepSeek as the main model and install an
  authorized vision/OCR bridge plugin that returns structured evidence. Review
  third-party source and pin a commit before installation. Without either path,
  the agent asks for transcription and must not infer unseen content.
- `safe-auto` authorizes only the smallest safe, reversible learning writeback
  allowed by learner configuration. It does not bypass Harness tool policy, the
  operating-system sandbox, credentials, or approval for destructive or
  otherwise high-risk actions.
- The full GitLearnOS protocol remains authoritative. Installing the bundle
  alone is not a complete learner deployment, RAG deployment, or verified
  recurring-automation deployment.

## Current boundaries

The shipped Host provides typed atomic Git writeback, bounded due/gap scans,
machine-receipt-aware external status, and a read-only canonical queue panel.
External RAG ingestion and recurring automation remain replaceable adapters:
this bundle records their markers or strict receipts but never invokes them or
claims execution without a receipt. A repository-capable scheduler may wake the
same main agent for recurring work; it does not create a second learning agent.
