# GitLearnOS Comes to DeepSeek Harness

[中文](../zh-CN/docs/deepseek-harness-launch.md)

GitLearnOS ships **exclusive native DeepSeek Harness support** for the official
Harness **Developer Preview**. It brings a complete, verifiable Git learning
transaction and an agent-controlled panel into the conversation: the main
agent decides what should come next and when the panel should appear, while the
learner keeps the final manual control. The Host is bounded plumbing, not the
owner of learning order.

## What the current code proves

The reviewed bundle includes a no-build Host and browser client. The Host
exposes bounded `learning_status` and `learning_route` reads plus a
`gitlearnos.yml`-authorized `learning_apply` transaction. In `safe-auto`, `learning_apply`
can atomically apply typed event, knowledge-gap, model, review, and dashboard
operations in one Git commit after strict learner identity, setup/config,
authority, and base-revision checks. `preview` emits the exact proposal;
`manual` requires approval. The receipt includes changed files and a
`git revert` boundary. `learning_record` remains a compatibility wrapper for a
single event.

The browser client reads the agent-maintained `Next up` list through a
loopback-only RPC channel. It never ranks or writes the queue, hides an
unmaintained learner queue instead of inventing one, labels non-learner sample
data, and applies a new `Panel: expand|collapse` decision once per revision.
Selecting an item exposes five code-backed conversation actions: review,
practice, close with one multiple-choice question, ask a teacher, or read the
learner's notes.

## Optional layers and user-chosen vision

RAG provider access is an optional separate layer; the current bundle does
**not** call or provision it. Recurring checks do not need a second agent or a
separate product component: a real repository-capable scheduler may wake the
same main agent at the configured time. Harness Schedule is session-local, so
it proves recurring repository automation only when it actually provides that
repository-capable scheduled invocation and an observed run receipt.

DeepSeek's default provider is text-only, but Harness itself is model- and
plugin-extensible. Users have two supported patterns for visual evidence:

1. configure a third-party multimodal model and declare image input, for
   example `input: [text, image]` in the model profile;
2. keep DeepSeek as the main reasoning model and install an authorized
   vision/OCR bridge plugin that returns structured visual evidence.

The public [`dsh-plugin` topic](https://github.com/topics/dsh-plugin) already
contains third-party visual bridges. They are ecosystem options, not bundled
GitLearnOS dependencies: review the source, capabilities, data destination, and
permissions, then pin a commit before installing. If neither visual path is
enabled, the agent asks for transcription and must not infer unseen content. A
correct immediate tap is supported evidence, not proof of mastery.

Install from a reviewed, pinned commit and follow the
[adapter guide](../adapters/deepseek-harness/README.md) for verification and
rollback. Installation proves bundle discovery only; it does not prove learner
repository write access, RAG ingestion, or background deployment.
