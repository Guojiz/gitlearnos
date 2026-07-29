# GitLearnOS 学习者仓库

[English](../../templates/CLAUDE.md)

@../../templates/AGENTS.md

通过上述正式导入加载的 `AGENTS.md` 保存本学习者仓库中持久、平台无关的
GitLearnOS 规则。真正安装到学习者仓库时，入口使用 `@AGENTS.md`。

Claude Code 确实发现 `.claude/skills/gitlearnos/SKILL.md` 时使用该 Skill，
但不得要求学习者主动调用。缺少或无法使用时，继续根据 `AGENTS.md` 与当前输入
工作，不得声称 Skill 已安装。
