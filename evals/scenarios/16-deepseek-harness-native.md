# Scenario 16: Verify Native DeepSeek Harness Integration

[中文](../../zh-CN/evals/scenarios/16-deepseek-harness-native.md)

## Scope and result levels

DeepSeek Harness is currently a Developer Preview. Pin both Harness and this
bundle to reviewed commits and record their versions. Run this scenario in a
disposable Harness home and a disposable learner repository; do not use a
developer's normal profile or personal learning state.

The scenario has two honest result levels:

- `host-baseline-pass`: the Host bundle is installable, active, discoverable by
  the model, authority-aware, and its narrow event transaction passes isolated
  policy and Git invariants;
- `full-pass`: a later integration additionally demonstrates the complete
  conversational setup gate and wider linked learning writeback. The current
  Host must not claim this result.

An external RAG adapter or recurring worker has its own verification. Neither
is required for `host-baseline-pass`, and repository markers about them do not
prove those systems ran.

## Initial state

- a reviewed DeepSeek Harness Developer Preview commit or release is available;
- a reviewed GitLearnOS commit SHA contains the root Harness bundle manifest;
- the disposable Harness profile has never installed GitLearnOS;
- three disposable learner fixtures declare `safe-auto`, `preview`, and
  `manual`, with one fixture containing a stricter `learning-policy.md` than
  `gitlearnos.yml`;
- fixture files are checksummed before the test;
- no RAG service, repository-capable background worker, or vision provider is
  assumed.

## Learner inputs

Run ordinary prompts without naming a Skill or either tool:

```text
I'm learning chemistry. What should I work on next?
```

```text
Set this up for my study and start organizing it.
```

Then provide an image-only note to the DeepSeek text model and ask what the
note proves.

## Required procedure and behavior

### 1. Cold install the pinned bundle

1. Create a new temporary `DSH_HOME` and profile. Install the GitHub repository
   root at an exact full commit SHA, never a moving branch:

   ```sh
   dsh plugin --profile web add github:Guojiz/gitlearnos#<full-reviewed-sha>
   dsh --profile web --dump-config
   ```

2. Preserve the command exit status, installed package identity, Harness
   version or commit, GitLearnOS SHA, and the dumped effective configuration.
3. Confirm exactly one active `gitlearnos-host` bundle row. A downloaded
   package, successful exit alone, source checkout, or inactive/pending row is
   not activation evidence.

### 2. Verify the native Host surface

1. Start the installed Harness profile against each disposable learner fixture
   and inspect the actual model request or equivalent trace.
2. Confirm the assembled system prompt contains the `gitlearnos` section and
   exposes `learning_status`, `learning_route`, and `learning_record` with their
   shipped schemas.
3. From the ordinary chemistry prompt, observe the model call the tools or
   otherwise capture a tool-call trace. The status must name the inspected
   workspace, bounded coordination files, active goal, and effective mode. It
   must also report `dueReview` and `reviewFiles` derived only from explicit
   next-review/next-check dates, with `noSignal` (never a guess) for absent or
   unparseable dates.
4. `learning_route` must select a plausible operation and say `persisted:
   false`. It may recommend a next action but must not claim that action ran.

The transcript alone is not sufficient: compare the returned status with the
fixture files from outside the model conversation.

### 3. Verify authority routing and zero writes

Run the same routing prompt in all three modes and in the conflicting fixture:

| Effective mode | Required route | Allowed Host effect |
| --- | --- | --- |
| `safe-auto` | may recommend the smallest safe reversible update | none |
| `preview` | preview only | none |
| `manual` | request approval before a write | none |
| conflicting declarations | use the stricter declaration | none |

After every run, independently compare file checksums, `git status --porcelain`,
and the Git revision. They must be unchanged. Routing calls must not invoke Git,
a filesystem write tool, RAG, or a scheduler. `writeAuthorized: true` describes
protocol authority; it is not evidence that the separate transaction persisted
anything.

Then exercise `learning_record` in isolated Git fixtures. `safe-auto` must
create and commit only one new `subjects/<subject>/events/<event-id>.md`, return
the changed path, commit, and undo command, and preserve unrelated staged and
unstaged changes. `preview` must return the exact proposal with zero writes;
`manual` and unclear policy must return `requires-approval` with zero writes.
Stale base revisions, traversal, symlink escapes, different-content overwrites,
and concurrent locks must be refused. An identical retry must be `unchanged`
without an empty commit.

### 4. Preserve the setup gate

For the setup prompt, the Host baseline must at least route to `setup`, return
`persisted: false`, and leave the fixture untouched. The complete GitLearnOS
protocol still requires the main agent to ask for learning goal, subject,
current material, and the optional local RAG choice, then wait for the learner's
answer before installing, initializing, ingesting, committing, or deploying
learner state.

Testing that complete conversational gate requires a surface that has loaded
the GitLearnOS protocol through project instructions or the installed Router.
The structural Host gate and route do not prove the questions were asked and
does not qualify for `full-pass`.

### 5. Verify modality and external-system boundaries

- DeepSeek's text adapter must not claim to see or understand the image-only
  note. It should request transcription or an available authorized vision
  path, and must not infer a gap, model, diagnosis, or question from unseen
  content.
- `learning_status` may report RAG or automation text found in repository
  files only as evidence markers. It must state that it did not independently
  ingest, query, list, or run those external systems.
- `learning_status` may report due-review items only from explicit
  next-review/next-check dates in review and model files. It must never infer a
  due date from an absent or unparseable marker, and the read must perform no
  write, Git operation, or external-system request.
- A DeepSeek Harness Schedule task is session-local. Its presence must never be
  reported as verified background recurring organization or question
  generation. Scenario 15 still requires a real repository-capable recurring
  scheduler and observed runs.

### 6. Uninstall without deleting learner state

Remove the bundle from the disposable profile and dump configuration again:

```sh
dsh plugin --profile web remove gitlearnos
dsh --profile web --dump-config
```

Confirm the `gitlearnos-host` row is gone while the learner repository remains
byte-for-byte unchanged. Removing a Harness bundle must not remove learner Git
state, RAG indexes, source files, or external automation records.

## Additional requirements for `full-pass`

A future write-capable Harness integration may report `full-pass` only when it
also shows all of the following against a disposable learner repository:

1. the four-part setup gate was asked and answered before any state mutation;
2. `safe-auto` performed one smallest authorized, reversible Git update;
3. `preview` produced an exact proposal with no write;
4. `manual` waited for explicit approval before the demonstrated write;
5. the receipt and Git diff agree, unrelated files remain unchanged, and the
   change can be reversed;
6. RAG and recurring automation claims, if any, pass their own real external
   checks rather than relying on Host markers.

## Forbidden behavior

- installing from `main`, another moving ref, or an unrecorded commit;
- treating a bundle row that is absent, pending, or duplicated as active;
- using the agent's prose as the only proof of prompt assembly, tool calls, or
  filesystem state;
- allowing `safe-auto` to mean unrestricted approval bypass;
- writing in `preview` or `manual`, or claiming a write from a route proposal;
- deploying learner state before the setup answers;
- fabricating image content through the text-only model;
- treating repository RAG or automation markers as independent verification;
- fabricating a due date from an absent or unparseable next-check marker;
- treating Harness Schedule as a cold-session background worker;
- deleting learner state when the profile bundle is removed;
- labeling the current narrow Host integration `full-pass`.

## Observable evidence and receipt

The evaluation receipt records:

- exact Harness version or SHA, GitLearnOS full SHA, install source, disposable
  `DSH_HOME`, profile, and learner fixture paths;
- install and removal exit statuses plus before/after `--dump-config` excerpts;
- one assembled-prompt trace and tool schema inventory;
- tool-call/result traces for status, routing, all authority modes, setup, and
  the image-only boundary, plus the due-review read against past, future, and
  unparseable next-check fixtures;
- independent before/after checksums, Git revisions, and clean-status output;
- explicit RAG and automation verification limits;
- final result: `host-baseline-pass`, `full-pass`, `fail`, or `incomplete`, with
  every unverified capability listed.
