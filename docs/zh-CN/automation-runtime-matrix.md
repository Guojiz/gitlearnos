# 自动化运行环境矩阵

[English](../automation-runtime-matrix.md)

| 运行环境 | 仓库权限 | 合法结果 |
|---|---:|---|
| 有能力的交互式 Agent | 有 | 真实写回与接手检查 |
| 拥有工具的计划 Worker | 有 | 真实执行 `due-review` 或 `maintenance` |
| 仅提示词调度器 | 无 | 只能提醒或交接 |
| 本地 cron 或 CI | 取决于已配置 Agent 与凭据 | 只能执行实际配置的能力 |

所有环境实现[自动化适配器](../../adapters/automation/README.zh-CN.md)中的同一任务意图。不能声称产生了实际上不存在的文件、题目、提交或调度。
