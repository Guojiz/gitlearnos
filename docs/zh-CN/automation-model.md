# 自动化模型

[English](../automation-model.md)

正式行为见 [GITLEARNOS.zh-CN.md](../../GITLEARNOS.zh-CN.md)，平台映射见[自动化适配器](../../adapters/automation/README.zh-CN.md)。

基础协议只定义两个任务：

```text
due-review
→ 读取到期证据并生成可立即作答的具体题目

maintenance
→ 协调待整理输入、等待反馈、过时视图和矛盾状态
```

有能力的交互式 Agent 始终执行即时工作和接手检查。只有真实调度器拥有仓库权限时，后台任务才存在。提醒或日期不等于 Worker 已经完成。

不要在学习状态中建立大量平台专用任务。学习意图保存在 Git 中，时间设置由适配器转换。
