# GitLearnOS for DeepSeek Harness

This adapter makes GitLearnOS a native installable bundle for the official
DeepSeek Harness **Developer Preview**. It mounts a Host plugin that adds a
`gitlearnos` system-prompt section and three bounded tools:

- `learning_status` reports GitLearnOS coordination files, active goal paths,
  effective write mode, repository-reported RAG and automation markers, and a
  read-only due-review observation (see [Revisit-ready read](#revisit-ready-read));
- `learning_route` selects the relevant GitLearnOS operation and an
  authority-aware next action without performing or claiming writeback.
- `learning_record` writes one new learning-event file through a serialized,
  policy-checked Git transaction, or returns an exact no-write result.

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

`learning_record` is intentionally narrower than a general file or shell tool.
It accepts only existing lowercase subject slugs and stable event IDs, and may
create only `subjects/<subject>/events/<event-id>.md`. Before any write it
requires the complete learner-repository setup files, an active goal, a cleanly
identified Git worktree root, and the exact base revision observed by the
caller.

- `safe-auto` may create and commit that one new event. A writer lock and two
  revision checks stop concurrent or stale writes; only that path is staged and
  committed, so unrelated staged or unstaged work remains untouched.
- `preview` returns the exact Markdown proposal with zero writes.
- `manual` and unclear policy return `requires-approval` with zero writes. The
  tool has no model-supplied approval switch, so the model cannot approve its
  own write.
- An identical retry is `unchanged` and creates no empty commit. A reused ID
  with different content, overwrite, traversal, symlink escape, or changed Git
  base is refused. A successful result includes the commit and `git revert`
  undo boundary.

This is the first native write path, not arbitrary repository maintenance. The
main GitLearnOS workflow remains responsible for deciding whether evidence is
durable and for updating linked gaps, questions, models, reviews, and views.

## Revisit-ready read

`learning_status` is read-only and also reports what the learner should revisit
next. It scans `subjects/*/reviews/*.md` and `subjects/*/models/*.md` and
classifies each file by an explicit `next review`, `next check`, or equivalent
date on the same line:

- `due`: a parseable date that is today or earlier;
- `upcoming`: a parseable date in the future;
- `noSignal`: no parseable next-check date — reported as a count, never guessed.

It also lists `reviewFiles` and `knowledgeGaps` so the agent can notice existing
review sets and active gaps without manual archaeology, and it returns an
ordered `actions` queue (due reviews first, by next-check date, then gaps) as a
projection — never a claim that any action ran. This is a heuristic over
repository text, not a scheduler: it performs no write, no Git operation, and no
external-system request, and it never fabricates a due date from an unparseable
or absent marker. Dates are compared in UTC, so near-midnight boundaries are
advisory.

## Limits

- The Host uses the active process working directory, or an explicit deployment
  `root`. Only `learning_record` writes or runs Git, and only within the narrow
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
- The official DeepSeek provider is text-only. Images, screenshots, boards, and
  other visual evidence require a verified multimodal provider or an
  authorized OCR/parser path; the agent must not infer unseen content.
- `safe-auto` authorizes only the smallest safe, reversible learning writeback
  allowed by the learner policy. It does not bypass Harness tool policy, the
  operating-system sandbox, credentials, or approval for destructive or
  otherwise high-risk actions.
- The full GitLearnOS protocol remains authoritative. Installing the bundle
  alone is not a complete learner deployment, RAG deployment, or verified
  recurring-automation deployment.

## Roadmap, not current capability

The intended native Harness expansion is deliberately explicit so a future
feature is never mistaken for a shipped one:

- a replaceable RAG provider with provenance-bearing ingestion and retrieval;
- a Web learning Cockpit backed by durable Git evidence;
- a transfer-mastery workflow that generates, reviews, and later rechecks
  composable models;
- a verified external recurring-worker bridge for cold-session automation.

None of these four items is implemented by the current Host base. Until its
code and end-to-end evidence exist, use the normal GitLearnOS agent workflow
and the repository-capable automation adapters documented elsewhere.
