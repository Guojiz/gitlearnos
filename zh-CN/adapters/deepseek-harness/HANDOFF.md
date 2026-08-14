# GitLearnOS × DeepSeek Harness — 会话交接卡

[English](../../../adapters/deepseek-harness/HANDOFF.md)

记录一轮已完成开发的状态，让另一个 Agent 接手时不必重新推导决策。这是状态，
不是功能规格。

## 已完成（可审查）

1. **`learning_status` 的只读观察更丰富**——现在返回 `dueReview`
   （`due` / `upcoming` / `noSignal`，来自显式 next-review 日期）、`reviewFiles`、
   `knowledgeGaps`，以及有序的 `actions` 队列（到期复习在前、按复测日期，缺口
   在后）。纯投影；不写入、不改 Git、不请求 RAG、不请求调度器。
2. **协议参考加入「一句收尾」**——讲完一个点后，用一道多选收尾，干扰项是
   最可能的误解；选错某个干扰项就点明具体混淆。见
   `skills/gitlearnos/references/{session,question,review}.md`（中英同步）。
3. 文档与场景 16 已更新。`npm run test:dsh` 通过 18/18；`npm run check:dsh`
   通过。
4. **Agent 维护的学习队列**——`learning_status` 返回 `queue`（`dashboard.md`
   的「接下来」列表，原样、按 Agent 写的顺序）；`templates/dashboard.md`
   记录了这个约定，系统提示要求 Agent 维护它。顺序归 Agent，工具只读、不写。

## 产品方向（通过 /grill-me 对齐）

Harness 原生界面是一个「无脑学习」面板：

- 居中一条 `GitLearnOS ▸`，默认收起；点开展开一个平铺有序列表，每条形如
  `知识点（动作）`；
- **不分分类别，只有先后**——而先后顺序是 **Agent 的判断**（读 Git 里的难度 /
  重要性 / 掌握度 / 巩固度综合排出），绝不由插件硬编码；
- 主轴是 **「学习者问 → AI 教」**：问之前 = Agent 排好队列；问之中 = 学习者问、
  AI 教；问之后 = 一句多选收尾。

## 临时原型（未提交，重启即失效）

动态 Cordis 插件 `glearn-1` 在当前会话预览该面板。它不是 bundle 的一部分，
进程重启后会消失。

## 刻意延后

- 把客户端 UI 烘焙进 bundle（需 tsdown 构建 + 约 6 个 `@deepseek-ai/dsh-*`
  peerDependencies + `ctx.remote` 类型化 RPC；Developer Preview 期间成本高、
  上游易破坏）。
- 客户端 UI（面板）本身仍是临时动态插件 `glearn-1`；队列数据层已烘焙，面板
  尚未烘焙。
- 诊断式多选作为独立 UI（协议参考已写清楚，尚无 UI）。

## 提交 / 回滚

- `main` 上有一个本地提交，未 push。SHA 见 `git log -1`。
- 回滚：`git revert HEAD`（保留历史）或 `git reset --hard HEAD~1`（丢弃该提交）。
  本轮未触碰学习者 Git 状态。

## 下一步决策

1. 把面板客户端 UI 烘焙进 bundle（成本高），或作为独立交付物保留。
2. 保留或停掉 `glearn-1` 原型。
