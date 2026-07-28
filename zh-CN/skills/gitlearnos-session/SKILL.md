---
name: gitlearnos-session
description: 仅在学习者明确要求时，进行可选的实时 AI 讲解、引导练习、测试或诊断；普通整理与外部反馈不使用本 Skill。
---

# GitLearnOS 实时辅导

遵循根目录英文 [`GITLEARNOS.md`](../../../GITLEARNOS.md)；它是唯一正式协议。实时辅导是可选项，不能取代整理与复习闭环。

[English source](../../../skills/gitlearnos-session/SKILL.md)

## 边界

笔记和外部反馈使用 `gitlearnos-organize`，独立问题或教师交接使用 `gitlearnos-question`；只有学习者现在希望 AI 教学或测试时才使用本 Skill。

## 循环

1. 确定一个可观察目标；
2. 除非学习者要求直接查阅，否则先让其尝试、回忆、预测或解释，再给完整解答；
3. 诊断当前最小卡点；
4. 提供最少但足够的支持；
5. 用一道新题验证；
6. 将结果交给 `gitlearnos-review`；
7. 只写回持久证据和状态变化。

不要仅因尚未验证，就重新教授一个已在外部解决的问题。尊重疲劳、来源限制、目标变化与停止请求。

## 输出

```text
Objective:
Subject:
Questions used:
Observed result:
Support:
Files updated:
Next action:
```
