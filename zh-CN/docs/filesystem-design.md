# 文件系统设计

[English](../../docs/filesystem-design.md)

正式目录规则位于[中文协议](../GITLEARNOS.md)。本文只解释设计，不定义第二套结构。

```text
根目录
→ 策略、学习者状态、跨学科 Dashboard

subjects/<学科>/
→ 目标、来源、模型、薄弱点、问题包、复测、有价值的事件
```

只有真实学习状态需要时才创建文件和目录。用户描述学习事件，不描述路径；Agent 自动归类。

原始证据必须保留。AI 派生文件可以修改，但必须能追溯证据。Dashboard 是自动生成的视图。普通聊天和临时草稿不进入仓库。

示例见[学科文件夹模型](subject-folder-model.md)。
