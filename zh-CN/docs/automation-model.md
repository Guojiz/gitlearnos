# 自动化模型

[English](../../docs/automation-model.md)

正式行为见[中文协议](../GITLEARNOS.md)。运行时意图来自 `gitlearnos.yml`；提供方
映射和回执字段见[自动化适配器](../adapters/automation/README.md)。

## 可移植意图

两个必需的重复任务默认如下：

```text
maintenance，在 automation.time_zone 的每天 21:30
→ 整理输入、等待反馈、过时视图、矛盾和模式

due-review，在 automation.time_zone 的每天 07:00
→ 读取到期证据并生成可作答的具体题目
```

学习者可以在 `gitlearnos.yml` 修改 `automation.time_zone`、安静时段、交付渠道、
题量上限、重复规则和本地时间。旧的策略文档不能覆盖它们。

每天只是检查节奏，不承诺每天产出。没有到期或变化证据时返回 `skipped`，不产生内容、
通知、仅时间戳提交或重复交付。主 Agent 的定时运行使用幂等键和写入锁，检查 Git 当前基础版本，
发生并发变化时停止，错过的运行最多补跑一次。

## 证据边界

只有真实提供方提供机器可读调度回执（含 provider、任务 ID、IANA `tz`、重复规则、
run ID、occurrence key、仓库版本、结果、交付状态和消息 ID）时，外部运行才是
`verified`。本地回执检查器只检查结构，不创建、运行或联系调度器。`automation.md`
中的文本、日期、提示词或 Harness 面板始终是 `reported-only`。

DeepSeek Harness Schedule 仅在会话内运行，不能唤醒冷会话，也不能证明冷状态下存在可访问仓库的定时调用。
准确边界和本地检查命令见适配器。
