# 自动化适配器

[English](../../../adapters/automation/README.md)

GitLearnOS 将可移植意图保存在 `gitlearnos.yml`，由调度器或有能力的 Agent 执行。
`tasks.example.yml` 是一种示例转换。提供方表达式和凭据留在学习者仓库之外。

## 可移植配置

生效字段为 `automation.time_zone`、`quiet_hours`、`max_questions_per_due_run`、
`delivery_channel` 以及下面两个任务：

```yaml
automation:
  time_zone: Asia/Shanghai
  quiet_hours: "22:00-07:00"
  max_questions_per_due_run: 3
  delivery_channel: current-authorized-channel
  jobs:
    maintenance: {recurrence: daily, local_time: "21:30"}
    due-review: {recurrence: daily, local_time: "07:00"}
```

旧的策略文档仅用于迁移，不能覆盖此配置。默认时间可编辑，不能证明已存在
调度器。

## 两个任务

- `maintenance`：整理待处理输入、外部反馈、过时视图、矛盾和反复模式。
- `due-review`：读取到期证据，最多生成配置数量的全新可作答题目。

“每天”表示每天检查，不表示每天都产出内容。没有到期或变化证据时返回 `skipped`，
不出题、不发通知、不做仅时间戳提交，也不重复交付。Worker 使用一个写入锁，检查
当前 Git 版本，基础版本变化时停止，错过的发生最多补跑一次。交付不能包含答案键；
没有明确的私有远程授权不得无人值守 push。

## 机器可读的调度回执

声称已观察到的每次外部运行都必须发出如下 JSON 回执（例如
`external/receipts/scheduler-<run-id>.json`）。规范 JSON Schema 见
[`external-receipt.schema.json`](../../../adapters/automation/external-receipt.schema.json)：

```json
{
  "schema": "gitlearnos.external-receipt/v1",
  "kind": "scheduler",
  "provider": "local-cron",
  "task_id": "opaque-provider-task-id",
  "tz": "Asia/Shanghai",
  "recurrence": "daily",
  "run_id": "run-2026-08-15T07:00+08:00",
  "occurrence_key": "due-review/2026-08-15T07:00:00+08:00",
  "repo_revision": "0123456789abcdef",
  "result": "skipped",
  "delivery_status": "not-sent",
  "message_id": null,
  "observed_at": "2026-08-15T07:00:03+08:00"
}
```

检查器要求非空的 `provider`、`task_id`、IANA `tz`、`recurrence`、`run_id`、
`occurrence_key`、`repo_revision`，明确的 `result`，以及 `delivery_status` 和
`message_id`（未发送消息时使用 `null`）。回执是提供方证据，不是调度器本身；本地
检查器只检查结构，不创建任务，也不联系提供方。

## Harness 边界

DeepSeek Harness 的 **Schedule** 是会话内的提示／计时设施。它可以帮助仍在运行的
交互会话注意任务，但不能唤醒冷会话、授予仓库权限或证明重复 Worker 运行。已验证的
后台部署必须使用能在冷状态启动的外部 Worker，其提供方回执包含上述字段，并且运行
确实读取了目标仓库。Harness 文本标记始终是 `reported-only`。

## 验证状态

`requested` = 已同意、等待创建；`configured` = 提供方任务存在但尚未运行；`verified`
= 重复条目和一次具备仓库能力的运行都有证据；`unavailable` = 能力检查找不到可用调度器；
`disabled` = 学习者选择不运行，部署仍不完整。只有有观察回执支持时才在 `automation.md`
保存这些状态。

使用以下命令进行本地结构检查：

```bash
node scripts/check-external-receipts.mjs external/receipts/*.json
```

命令会报告结构是否有效，并明确说明没有执行外部提供方运行。
