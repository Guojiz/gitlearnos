# 自动化适配

[English](../../../adapters/automation/README.md)

GitLearnOS 保存可移植的任务意图，由调度器或有能力的 Agent 真正执行。
[`tasks.example.yml`](../../../adapters/automation/tasks.example.yml) 是最小可移植定义。`schedule: null`
表示尚未配置后台交付。

## 两个通用任务

### `due-review`

执行时：

1. 打开当前 Dashboard 和到期复测链接；
2. 读取当前目标、相关证据和最近题目；
3. 生成少量新的、可以立即作答的问题；
4. 在当前渠道交付问题；
5. 用户作答或状态真正变化后再写回；
6. 报告实际完成的操作。

它的输出不能只是“记得复习”。

### `maintenance`

检查待整理输入、等待中的外部反馈、过时 Dashboard 链接、矛盾的 AI 状态和到期任务。只自动修复安全且可撤销的问题；不确定内容进入待处理，不允许猜测。

## 执行模式

| 模式 | 含义 |
|---|---|
| 即时 | 当前交互中已经完成 |
| 接手检查 | 有能力的 Agent 每次恢复工作时检查 |
| 后台 Worker | 真正拥有仓库权限的计划任务 |
| 仅提示提醒 | 只是交接，不能声称完成仓库工作 |

ChatGPT Automations、cron、CI 和其他调度器都可以实现这两个任务。平台专用时间设置留在适配器中；学习意图与证据留在 Git。
