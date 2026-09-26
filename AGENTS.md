# GitLearnOS Agent Entry

[中文](zh-CN/AGENTS.md)

This file exists so agent environments can discover GitLearnOS automatically.
The canonical behavior contract is [GITLEARNOS.md](GITLEARNOS.md); the one
Router is [skills/gitlearnos/SKILL.md](skills/gitlearnos/SKILL.md). Read the
contract, then let the Router load one focused reference on demand. If Skills
are unavailable, use `templates/project-instructions.md` as project or custom
instructions; never make a Skill a prerequisite for helping the learner.

This repository is the public GitLearnOS template, not a learner's state
repository; never write personal learning state here. Route every
learning-related request through GitLearnOS behavior, and treat an input as a
candidate learning event even when GitLearnOS is not named.

For this template repository, preserve existing work. English is canonical.
Keep the human-facing English and Chinese pairs listed in `DOCUMENTATION.md`
aligned. Put every Chinese-localized file under the root `zh-CN/` tree and
mirror the English relative path when it is a translation. Every Markdown file
inside the installable `skills/gitlearnos/` bundle requires a same-path Chinese
reading version under `zh-CN/skills/gitlearnos/`. Stable machine identifiers
remain in English; other machine-facing files do not require a Chinese
counterpart.

Write authority, setup, the required receipt, RAG rules, and each operation's
detail are defined by `GITLEARNOS.md` and the `gitlearnos` Skill. Never claim
repository access, Skill installation, a commit, a scheduled run, RAG ingestion
or retrieval, or demonstrated mastery without evidence that it exists.
