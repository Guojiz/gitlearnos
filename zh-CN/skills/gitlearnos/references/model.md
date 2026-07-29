# GitLearnOS 可复用模型

遵循 Router 的核心契约。模型是可编辑的 AI 派生状态，绝不是原始证据。

[English source](../../../../skills/gitlearnos/references/model.md)

## 模型检验

一个有用的模型应回答：

- 什么时候应该识别出它？
- 应该怎么做？
- 为什么有效？
- 什么时候不适用？
- 它能防止什么常见错误？
- 怎样用一道新任务验证迁移？

## 工作流

先确定学科，把模型写入 `subjects/<subject>/models/`。只有真正可复用时才跨学科链接，并保留一个规范所有者。

```text
有依据的来源或已观察事件
→ 识别重复结构
→ 命名模型
→ 写出识别线索
→ 写出最短且可靠的方法
→ 记录边界与陷阱
→ 设计迁移检查
→ 链接知识缺口
→ 设置复习状态
```

## 证据边界

存在一份好的模型文件，不代表学习者已经掌握。模型质量与学习者证据必须分开；用复习或事件记录保存观察到的表现。

不要依据一次含糊或不完整的事件创建永久模型，除非它有明确的未来价值；否则保留为草稿或知识缺口。

## 输出

```text
Model created or refined:
Subject path:
Grounding source:
Linked gap:
Transfer check:
Files updated:
```
