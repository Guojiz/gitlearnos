---
name: gitlearnos
description: 在每次学习者交互中识别有价值的学习事件，并把学习者自有 Git 仓库中的任务路由到最小的 GitLearnOS 设置、整理、出题、复测、辅导、来源、模型或维护工作流。学习者提出学科问题、尝试作答、发来一页材料或笔记、报告反馈或结果，或者显露学习需要时，即使没有提到 GitLearnOS 或调用 Skill，也应考虑使用本 Skill。
---

# GitLearnOS Router

[English](../../../skills/gitlearnos/SKILL.md)

能访问模板仓库时，先读取根目录英文 `GITLEARNOS.md`；否则读取
[`references/core-contract.md`](references/core-contract.md)。该协议负责证据、
仓库、权限、自动化和 Git 行为；本 Skill 只选择最小工作流，不能另立规则。

## 根据事件触发，而不是等待命令

不要等待“使用 GitLearnOS”“保存这个”、Git 请求或显式 Skill 调用。先判断当前输入是否是候选学习事件。仓库管理不能抢在学习者当前请求之前；先回答或帮助学习者。

- 在 `safe-auto` 下价值明确且适合持久保存：使用最小匹配工作流，并在获授权时写回；
- 可能有价值但不确定：先回答，再给一个简短建议或只问一个必要问题；
- 偶然或无关输入：不要加载更多 Skills、扫描仓库或提起记录。

Skills 是可选的执行指南。在不提供 Skills 的界面中，仓库指令、项目指令、
原生记忆或输入本身都可以触发同一行为。

## 读取最少上下文

1. 区分公开模板与学习者仓库；
2. 检查真实的读取、写入、Git、来源和调度能力；
3. 读取目标 `learning-policy.md`、Dashboard、当前学科目标和直接相关的证据；
4. 根据设备、流量、时间、语言和交付限制提供最小但有价值的交互；
5. 判断学科；只有可能写错位置时才询问；
6. 只加载一个操作参考文件，确有必要时再加载一个学科参考文件。

## 根据意图或证据路由

| 意图 | 加载 |
|---|---|
| 创建或迁移最小状态 | [`references/setup.md`](references/setup.md) |
| 记录、整理、去重或同步反馈 | [`references/organize.md`](references/organize.md) |
| 给学习者出题或生成外部问题包 | [`references/question.md`](references/question.md) |
| 执行已有题目并写回答案证据 | [`references/review.md`](references/review.md) |
| 用户现在要求 AI 解释或引导练习 | [`references/session.md`](references/session.md) |
| 处理来源访问、出处、隐私或完整性 | [`references/source.md`](references/source.md) |
| 提炼可复用理解 | [`references/model.md`](references/model.md) |
| 修复状态、链接、重复或撤销范围 | [`references/maintenance.md`](references/maintenance.md) |

不要把笔记记录、老师反馈或准备向真人求助的问题强行变成 AI 辅导会话。

确实需要学科形式时，只从
[`references/subjects/`](references/subjects/README.md) 加载一个参考文件。

## 完成

返回核心契约规定的回执。没有实际观察到时，不能声称已经写入、提交、创建调度、
访问来源、安装 Skill 或证明掌握。
