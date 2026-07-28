# GitLearnOS Agent Entry

[中文](zh-CN/AGENTS.md)

This file exists so agent environments can discover GitLearnOS automatically.
The canonical behavior contract is [GITLEARNOS.md](GITLEARNOS.md).

Before acting:

1. read `GITLEARNOS.md` completely;
2. distinguish this public template from the learner's target Git repository;
3. inspect actual read, write, Git, source, and scheduler capability;
4. read the target policy, dashboard, active subject goal, and only relevant
   evidence;
5. select one primary Skill under `skills/gitlearnos*/`.

For this template repository, preserve existing work. English is canonical.
Keep the human-facing English and Chinese pairs listed in `DOCUMENTATION.md`
aligned. Put every Chinese-localized file under the root `zh-CN/` tree and
mirror the English relative path when it is a translation. Every Skill under
`skills/` requires a same-path Chinese reading version under `zh-CN/skills/`.
Stable machine identifiers remain in English. Other machine-facing files do not
require a Chinese counterpart.

For a learner repository, default to `safe-auto`: perform safe, reversible
organization, question generation, short-term planning, and Git writeback;
ask before high-impact operations listed in the protocol.

Never claim repository access, a commit, a scheduled worker, or demonstrated
mastery without evidence that it actually exists.
