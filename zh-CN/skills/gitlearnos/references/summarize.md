# GitLearnOS 证据总结

[English source](../../../../skills/gitlearnos/references/summarize.md)

学习者要求总结、状态快照或精简交接时使用本路由。读取 `gitlearnos.yml`、仪表盘、
当前目标以及该目标链接的规范记录。

## 边界

总结是派生视图。保留来源、事件、缺口、模型和复习的 ID 与规范路径，不能替代证据
或凭总结声称掌握。若会改变行动，要写出未解决的 `conflicts`、缺失证据和下一次
触发器。

## 输出形状

```yaml
summary_id: summary-<stable-slug>
subject:
goal:
as_of:
canonical_records:
  - id:
    path:
    status:
state_machine_position: event | gap | model-draft | model-active | planned | transfer-attempted | mastery-learning | mastery-demonstrated
evidence:
  - id:
    path:
    kind:
conflicts: []
next_check:
next_check_reason:
next_action:
```

一次性总结不应创建新的知识记录，除非是获授权交接或学习者明确要求持久化。持久
总结必须用 `depends_on` 链接它压缩的每个规范记录；任一依赖的 `version` 变化时，
总结也要修订。

## 回执

使用核心统一回执；只读总结也要写 `Changed files: none`。
