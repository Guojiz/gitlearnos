---
name: gitlearnos
description: 使用一个有能力的主 Agent，把学习者自有 Git 仓库中的任务路由到最小的 GitLearnOS 初始化、整理、出题、复测、辅导、来源、模型或维护工作流。
---

# GitLearnOS Router

[English](../../../skills/gitlearnos/SKILL.md)

操作前先阅读根目录英文 `GITLEARNOS.md`。它是关于证据、仓库、权限、自动化和 Git 行为的唯一正式协议；本 Skill 只选择最小工作流，不能另立规则。

## 读取最少上下文

1. 区分公开模板与学习者仓库；
2. 检查真实的读取、写入、Git、来源和调度能力；
3. 读取目标 `learning-policy.md`、Dashboard、当前学科目标和直接相关的证据；
4. 根据设备、流量、时间、语言和交付限制提供最小但有价值的交互；
5. 判断学科；只有可能写错位置时才询问；
6. 只加载一个主要 Skill，确有必要时再加一个辅助 Skill。

## 根据意图路由

| 意图 | Skill |
|---|---|
| 创建或迁移最小状态 | `zh-CN/skills/gitlearnos-setup/SKILL.md` |
| 记录、整理、去重或同步反馈 | `zh-CN/skills/gitlearnos-organize/SKILL.md` |
| 给学习者出题或生成外部问题包 | `zh-CN/skills/gitlearnos-question/SKILL.md` |
| 执行已有题目并写回答案证据 | `zh-CN/skills/gitlearnos-review/SKILL.md` |
| 用户现在要求 AI 解释或引导练习 | `zh-CN/skills/gitlearnos-session/SKILL.md` |
| 处理来源访问、出处、隐私或完整性 | `zh-CN/skills/gitlearnos-source/SKILL.md` |
| 提炼可复用理解 | `zh-CN/skills/gitlearnos-model/SKILL.md` |
| 修复状态、链接、重复或撤销范围 | `zh-CN/skills/gitlearnos-maintenance/SKILL.md` |

不要把笔记记录、老师反馈或准备向真人求助的问题强行变成 AI 辅导会话。

## 完成

返回 `GITLEARNOS.md` 规定的回执。没有实际观察到时，不能声称已经写入、提交、创建调度、访问来源或证明掌握。
