# 自动化运行时矩阵

[English](../../docs/automation-runtime-matrix.md)

| 运行时 | 仓库访问 | 冷会话唤醒 | 有效结果 |
|---|---:|---:|---|
| 有能力的交互 Agent | 有 | 无 | 即时工作或接手检查；重复部署仍不完整 |
| DeepSeek Harness Schedule | 仅会话内 | 无 | 只能观察提示／计时；文本标记为 `reported-only` |
| 能访问仓库的调度器 | 有 | 有 | 唤起同一个主 Agent，并验证真实重复的 `due-review` 和 `maintenance` |
| 仅提示调度器 | 无 | 无 | 只能提醒或交接，不能 `verified` |
| 本地 cron 或 CI | 取决于 Agent 命令与凭据 | 取决于配置 | 只有提供方回执和已观察的仓库运行才能 `verified` |

所有运行时都实现[自动化适配器](../adapters/automation/README.md)中的同一意图。任何
运行时都不能声称不存在的文件、题目、提交、提供方执行或调度。

## 回执边界

外部调度回执必须含 provider、不透明任务 ID、IANA `tz`、重复规则、run ID、occurrence
key、仓库版本、结果、交付状态和消息 ID。`scripts/check-external-receipts.mjs` 可以
在本地检查结构；它不会联系提供方，因此不能单独把报告升级为 `verified`。Harness 面板
或 Markdown 标记始终是 `reported-only`。

设备休眠、网络中断或提供方延迟可能错过发生时刻。下一个有能力的主 Agent 运行可以使用原
occurrence key 补跑一次；不得重复交付同一到期证据。
