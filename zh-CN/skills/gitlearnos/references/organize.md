# GitLearnOS 整理

遵循 Router 核心契约中的证据、所有权、写入权限与 Git 规则。本参考文件只定义
整理工作流。

[English source](../../../../skills/gitlearnos/references/organize.md)

## 目标

把一次自然语言描述的学习事件转化为最小且正确的持久状态变更。学习者只需描述发生了什么；不要要求他们选择仓库路径。

## 隐式触发

以下情况应考虑本工作流：

- 学习者发来一页材料、截图、练习纸、手写笔记或书中片段；
- 转述教师、导师、课堂、同伴或平台的说法；
- 分享错误、订正、结果、有用方法或变化后的截止日期；
- 提出与当前目标有关、上下文具有持久价值的学科问题。

不要为了整理文件而延迟当前回答。在 `safe-auto` 下，如果学科、价值、隐私和目标都明确，先回答，再做最小写入。材料私密或用途不确定时，简短建议记录，或只问一个必要问题。未经授权，不要保存完整图片或原始文件；忠实笔记、来源定位和实际检查过的片段往往已经足够。

## 读取

1. 存在时读取 `learning-policy.md`；
2. 读取根目录 `dashboard.md` 与当前学科入口；
3. 读取 `subjects/<subject>/` 下的目标，以及候选缺口、来源、模型、交接和复习；
4. 读取输入或已授权的原始材料。

不要扫描无关学科。

## 规范化事件

只记录必要内容。`occurred_at`、`subject`、`channel`、`summary` 和 `linked_goal` 是可移植的最低字段。其他字段只有在会改变后续工作时才添加：

```yaml
occurred_at:
subject:
channel: teacher | class | tutoring | paper | book | platform | exam | peer | ai | other
track: school | self-study | mixed
need: current-course | remediation | exam | exploration | advance | project | research | skill
event_type: note | mistake | question | handoff | external-feedback | result | resolution | correction
source_availability:
summary:
linked_goal:
linked_gap:
evidence_type: reported | source-supported | demonstrated | not-assessed
privacy:
next_action:
```

只有事件实质改变状态时才创建简洁的活动记录。不要保存完整聊天记录或隐藏推理。

## 整理

```text
识别来源
→ 推断或确认学科
→ 查找现有状态
→ 去重
→ 链接而非复制
→ 更新解决状态和下一步
→ 仅在可复用时提取模型
→ 刷新仪表盘
```

使用：

- `subjects/<subject>/inbox/`：暂时无法规范化的输入；
- `subjects/<subject>/sources/`：来源与反馈记录；
- `subjects/<subject>/knowledge-gaps/`：问题生命周期；
- `subjects/<subject>/models/`：持久、可复用的理解；
- `subjects/<subject>/handoffs/`：外部提问与反馈包；
- `subjects/<subject>/events/`：有实质价值的跨渠道活动证据。

若事件跨学科，选择一个主要所有者，并链接次要学科。不要复制同一事件。只有歧义会改变规范位置时才询问。

## 协调校内学习与自主学习

- 一个概念、模型或缺口应链接到多个目标，而不是重复创建；
- 保留学校截止时间和教师约束；
- 当策略为自主学习预留时间时，保留一个可见的自主学习下一步；
- 修补学校目标先修知识的自主学习归为 `mixed`；
- 绝不能把学习者自选的自主学习目标悄悄变成纯校内任务清单。

## 不要过度规范化

并非所有输入都是知识缺口。它可能是待重读来源、项目里程碑、开放研究问题、成功策略、教师要求、作品反馈周期或一次性笔记。选择与学习需求相符的状态和证据。

## 外部帮助生命周期

当前解决状态使用 `open`、`resolved` 或 `needs-check`。读取旧仓库时，保留其历史值，并在不编造新掌握状态的前提下映射：

```text
candidate / active / routed                 → open
awaiting-feedback / needs-verification      → needs-check
resolved-externally / resolved-with-ai      → resolved
verified / archived                         → resolved
```

当学习者说教师已经解决一个问题时：

1. 接受操作层面的解决；
2. 把教师反馈记录为 `reported` 或 `source-supported`；
3. 链接之前的交接和知识缺口；
4. 只有理由充分时才更新或创建可复用模型；
5. 移除已过时的 AI 讲解下一步；
6. 只有策略允许时才安排验证；
7. 没有延迟后的独立证据，不得声称 `demonstrated`。

如果学习者说“不复习”，记录不做验证并停止。

## 安全自动化

在 `safe-auto` 下，直接执行低风险写入，并一次性返回回执。只有输入含糊到可能更改错误目标或缺口，或操作触及删除、隐私、可见性、广泛改写或策略边界时才询问。

通过匹配日期、渠道、来源定位、已链接事项和规范化摘要，使重复输入保持幂等。

## 输出

```text
Organized:
Subject path:
Linked state:
Resolution change:
Questions generated: none / link
Changed files:
Evidence type:
Next action:
Undo:
```
