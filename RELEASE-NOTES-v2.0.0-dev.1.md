# GitLearnOS v2.0.0-dev.1

GitLearnOS v2 Developer Preview is the first GitHub release checkpoint for the v2 protocol.

GitLearnOS gives one capable, replaceable main AI agent a learner-owned Git memory. Learning can happen in class, on paper, in books, on practice platforms, in projects, with teachers, peers, or other AI systems; GitLearnOS keeps only the evidence that is useful for the learner's next decision and preserves it as inspectable, reversible state.

## Downloads

Choose the package that matches what you want to do:

- **`GitLearnOS-Starter-Template-2.0.0-dev.1.zip`**: recommended for most learners and AI-agent setups. It contains the v2 protocol, Quickstart, setup templates, the complete GitLearnOS Skill, bilingual documentation, and the generic agent/Git/search/automation adapters needed to deploy GitLearnOS into a learner-owned repository.
- **`GitLearnOS-DeepSeek-Harness-Plugin-2.0.0-dev.1.zip`**: the native DeepSeek Harness Developer Preview bundle. Extract it and install from its root with `dsh plugin --profile web add .`, then verify discovery with `dsh --profile web --dump-config`.

The automatically generated **Source code (zip)** and **Source code (tar.gz)** remain full repository snapshots for developers. They are not the recommended end-user packages.

## Highlights

- **Git-native v2 protocol**: `GITLEARNOS.md` is the canonical behavior contract, with local or hosted Git as the core and GitHub treated as an optional adapter.
- **One-agent learning loop**: organize evidence, diagnose the current gap, ask a targeted question, preserve answers or external feedback, recheck independently, and write back with one reversible Git commit.
- **Learner-controlled writes**: `safe-auto`, `preview`, and `manual` modes keep automation bounded and visible.
- **Structured learning state**: subject-specific goals, sources, knowledge, models, knowledge gaps, reviews, and useful learning events live under `subjects/<subject>/`.
- **Differential diagnosis before durable gaps**: competing explanations are tested before the system writes a knowledge-gap conclusion.
- **Native DeepSeek Harness Developer Preview**: an installable GitLearnOS bundle provides bounded observations, an atomic `learning_apply` transaction, and an agent-maintained `Next up` panel.
- **RAG is a separate retrieval layer**: Git remains the readable source of learning truth. RAG-Anything is the first explicitly supported option, not a lock-in.
- **Verified background work**: reminders and requested schedules are not treated as completed automation unless a real scheduler has actually run them.
- **Migration path from v1**: v2 can be adopted gradually without destructively rewriting existing learner evidence.

## Developer Preview boundary

This is a **pre-release**. The Git learning loop is usable, but a complete deployment requires a verified local or compatible private RAG layer. The bundled DeepSeek Harness integration is also explicitly a Developer Preview. Multimodal input depends on the configured model or an authorized vision/OCR bridge.

GitLearnOS does not claim mastery from an immediate correct answer, does not fabricate scheduler execution or RAG access, and does not treat dashboards as a second source of truth.

## Start here

- `QUICKSTART.md`: canonical setup path
- `GITLEARNOS.md`: v2 protocol
- `MIGRATION-v2.md`: migration from earlier layouts
- `LIVE-DEMO.md`: end-to-end learning loop example
- `adapters/deepseek-harness/README.md`: Harness installation, limits, and verification
- `evals/README.md`: documented scenarios

Official website: https://guojiz.github.io/gitlearnos/

## Release target

This release is cut from the `main` branch after the September 2026 v2 protocol, Harness, RAG-verification, and Git/RAG separation work.
