# 重复自动化状态

> 本文件记录观察到的调度器状态，不保存凭据，也不能代替提供方配置。生效意图（时区、
> 安静时段、交付和任务时间）位于 `gitlearnos.yml`。只有机器可读外部回执，或明确的
> 不可用／禁用决定，才能更新本文件。此处文本始终是 `reported-only`。

部署自动化：`incomplete` / `verified`
学习者时区：
安静时段：
无人值守 push 到私有远程：`disabled` / `authorized`

## `maintenance`——重复整理

- 状态：`requested` / `configured` / `verified` / `unavailable` / `disabled`
- 重复规则：
- 本地时间：
- 提供方：
- 提供方任务 ID：
- 下次运行：
- 最近一次已验证运行：
- 最近结果：`completed` / `skipped` / `failed` / `unknown`
- 回执路径或外部回执 ID：
- 交付状态：
- 消息 ID（未发送时为 `null`）：

## `due-review`——重复出题

- 状态：`requested` / `configured` / `verified` / `unavailable` / `disabled`
- 重复规则：
- 本地时间：
- 提供方：
- 提供方任务 ID：
- 下次运行：
- 最近一次已验证运行：
- 最近结果：`completed` / `skipped` / `failed` / `unknown`
- 交付渠道：
- 回执路径或外部回执 ID：
- 交付状态：
- 消息 ID（未发送时为 `null`）：

## 运行契约

每份提供方回执都必须包含 `provider`、`task_id`、`tz`、`recurrence`、`run_id`、
`occurrence_key`、`repo_revision`、`result`、`delivery_status` 和 `message_id`。使用一
个幂等键和写入锁；Git 基础版本变化时停止。没有到期或变化证据时以 `skipped` 结束，
不出题、不发消息、不提交。最多补跑一次，不能重复交付到期项目。凭据和提供方表达式
留在 Git 外。

使用以下命令进行本地结构检查：

```bash
node scripts/check-external-receipts.mjs external/receipts/*.json
```

检查器不会联系调度器或证明提供方运行，只报告回执文档是否具备必需结构。
