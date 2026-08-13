# 重复自动化状态

> 本文件记录已验证的调度器状态，不保存凭据，也不能代替提供方配置。只有观察到
> 调度器与运行证据后才能更新。部署试运行可以在部署提交中更新本文件；之后
> 的无工作跳过只留在提供方日志，直到有实质学习变化才汇总，不得只为记录
> `skipped` 或时间而制造 Git 改动。

部署自动化：`incomplete` / `verified`
学习者时区：
安静时段：
无人值守 push 到私有远程：`disabled` / `authorized`

## `maintenance`——重复整理

- 状态：`requested` / `configured` / `verified` / `unavailable` / `disabled`
- 重复规则：`daily`
- 本地时间：`21:30`
- 提供方：
- 提供方任务 ID：
- 下次运行：
- 最近一次已验证运行：
- 最近实质记录或验证运行结果：`completed` / `skipped` / `failed` / `unknown`
- 验证证据：

## `due-review`——重复出题

- 状态：`requested` / `configured` / `verified` / `unavailable` / `disabled`
- 重复规则：`daily`
- 本地时间：`07:00`
- 提供方：
- 提供方任务 ID：
- 交付渠道：
- 下次运行：
- 最近一次已验证运行：
- 最近实质记录或验证运行结果：`completed` / `skipped` / `failed` / `unknown`
- 验证证据：

## 运行契约

状态含义：`requested` = 已同意、等待创建；`configured` = 已创建但未测试；
`verified` = 调度条目存在且已观察拥有仓库能力的测试；`unavailable` = 能力检查证明
没有可用调度器；`disabled` = 学习者明确禁用，且部署仍不完整。

- 每个任务与计划发生时刻对应一个幂等键。
- 使用一个写入锁或租约；Git 基础版本改变时停止。
- 没有到期或变化证据时标记 `skipped`，不出题、不发消息、不提交。
- 错过的运行最多补跑一次，不能重复交付到期项目。
- 交付题目时不包含答案键。
- 凭据与提供方表达式留在 Git 外。
