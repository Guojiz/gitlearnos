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

## Separate layers and narrow roadmap

RAG provider access and cold-session recurring workers are separate layers; the
current bundle does **not** call or provision either one. Harness Schedule is
session-local and does not satisfy recurring repository automation. The narrow
roadmap is richer visual editing, a RAG bridge, and an external recurring worker.

DeepSeek's official provider is text-only. Images, screenshots, boards, and
other visual evidence require a verified multimodal provider or an authorized
OCR/parser path; the text-only agent must not infer unseen content. A correct
immediate tap is supported evidence, not proof of mastery.

Install from a reviewed, pinned commit and follow the
[adapter guide](../adapters/deepseek-harness/README.md) for verification and
rollback. Installation proves bundle discovery only; it does not prove learner
repository write access, RAG ingestion, or background deployment.
