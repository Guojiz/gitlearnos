# GitLearnOS 实时辅导

遵循 Router 的核心契约。实时辅导是可选项，不能取代整理与复习闭环。

[English source](../../../../skills/gitlearnos/references/session.md)

## 边界

笔记和外部反馈使用 `organize.md`，独立问题或教师交接使用 `question.md`；只有
学习者现在希望 AI 教学或测试时才使用本参考文件。

## 循环

1. 确定一个可观察目标；
2. 除非学习者要求直接查阅，否则先让其尝试、回忆、预测或解释，再给完整解答；
3. 诊断当前最小卡点；
4. 提供最少但足够的支持；
5. 用一句多选收尾（见下文）；
6. 将结果交给 `review.md`；
7. 只写回持久证据和状态变化。

如果新题要在当前回答之后再作答，它就是持久化题集，不只是对话支持。必须加载
`question.md`；在有效 `safe-auto` 且具备写入和 Git 能力时，结束前写入
`planned` 复习、链接缺口、刷新仪表盘、记录真实的 `on-handoff` 或调度状态，
并提交完整布置。如果学习者当场作答，则把答案交给 `review.md`。

不要仅因尚未验证，就重新教授一个已在外部解决的问题。尊重疲劳、来源限制、目标变化与停止请求。

## 一句收尾

这是学习者主导的回合，不是 AI 的测验主线：学习者问、AI 教。用一道多选收尾，
学习者点一下即可：

- 题干：一个具体的判断或应用，不能是复述；
- 正确项：刚讲的关键点；
- 干扰项：学习者最可能的误解（例如“相似 vs 全等”）；
- 点对 → 记录结果并收敛这一项；
- 点错某个干扰项 → 点明具体混淆（“你把 X 和 Y 搞混了”），只补那一个点。

用多选弹窗（AskUserQuestion），一次一道。不要问“懂了吗”，也不要不分场合
频繁弹出。

## 输出

```text
Objective:
Subject:
Questions used:
Observed result:
Support:
Files updated:
Automation actually completed:
Skill installation:
Next action:
Undo:
```
