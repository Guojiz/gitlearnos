# GitLearnOS 学习策略

遵循 Router 的核心契约。`GITLEARNOS.md` 的优先级高于本参考文件，也高于任何策略。策略是可编辑的派生状态，描述 Agent 的辅助方式如何改变这位学习者的独立表现。它只约束 Agent 行为，绝不约束学习者行为。

[English source](../../../../skills/gitlearnos/references/strategy.md)

三类记录保持区分：

- **模型（model）**教学习者如何解题（学科方法）；
- **学习者画像（learner profile）**记录学习者是什么、能访问什么（状态与约束）；
- **策略（strategy）**记录因为这位学习者是这样的人，Agent 应当有何不同做法（计划）。

策略是计划，不是状态。它是 Agent 押上的一个关于如何辅助的赌注，后续结果可以证伪它。画像观察不是这样运作的：它从证据读出，只会过时，不会出错。把这个区别保留在下面的记录结构里。

## 什么属于这里

只有三条都成立时，才把一个主张提升为策略：

1. 它关于 Agent 的交付、支持、探针、排期或交互——而不是学科内容；
2. 它可能是错的，且后续证据能显示它错了（可证伪）；
3. 现在就照它做，会改变一个或多个具体的下一步动作。

排除项（改走别处）：

- 解学科题的方法 → `models/`；
- 设备、时间、流量、语言或访问条件 → 画像的约束注记（这些是状态，不是计划，也不可证伪）；
- 一次性情境、情绪或临时请求 → 记为事件，或不记。

## 策略检验

一个有用的策略应回答：

- 它通过哪个钩子和取值，改变 Agent 的哪个动作？
- 在什么可观察条件下适用，什么时候不适用？
- 它的依据是学习者明说的偏好，还是从结果推断的？
- 现在有什么证据支持它，链接到哪些记录？
- 什么结果会削弱或推翻它，这个结果检查过了吗？
- 对推断型策略：计划了哪个延迟的独立检查？

## 作用域与分层

每条策略只存在于一个作用域，只写一次，写在它真正生效的那一层。不要把一条策略复制到多个学科。

归属判据——问一句**「换一个学科它还成立吗？」**

- **成立 → learner 作用域。** 它关于这个人不论学科都这样被辅助（例如「一次一条」「先让他自己试再给提示」）。把它作为结构化条目存进 `learner-profile.md`，让学习者的当前状态和跨学科辅助计划成为一个可检查的整体。
- **不成立 → subject 作用域。** 它只在一个学科内成立（例如语境词汇的「看选项前先预测空位语义」、数学的「列式前先画图」）。把它作为独立文件存在 `subjects/<subject>/strategies/<slug>.md`。

目标仍留在 `subjects/<subject>/goals/`，不并入任何一个策略作用域。

### 优先级

先读 learner 作用域的 active 策略，再读当前学科的策略。**subject 作用域覆盖 learner 作用域。每次交付，每个钩子只保留一个生效值。** 如果两层都设了同一个钩子，该学科内以 subject 值为准；在没有 subject 策略设置该钩子的地方，learner 值仍然适用。

不要只为填满某一层而造 subject 策略。如果一条规则确实跨学科，就只在 learner 作用域写一次，不要逐学科复制。

## 稳定标识

每条策略——无论是 `learner-profile.md` 里的条目还是 subject 文件——都带一个稳定 `id`（`strat-<slug>`）、整数 `version`、`status: draft | active | archived` 和 `basis: stated | inferred`。改写正文或路径时 ID 永不改变。可选的关系字段沿用 `models/` 的词表：`supersedes`、`superseded_by`、`conflicts`、`depends_on`。

`learner-profile.md` 里的一个 learner 作用域条目：

```yaml
# 放在 "## Assistance strategies" 段下；每条策略一个块
- id: strat-one-thing-at-a-time
  version: 1
  status: active
  basis: stated
  scope: learner
  hooks:
    delivery: one-item-per-turn
    support: wait-for-response-before-next
  applies_when: any assigned question, review delivery, or explanation step sequence
  does_not_apply_when: the learner asks for more at once, or explicitly revokes
  promotion_evidence:
    - subjects/english/events/2026-07-03_practice-result.md
    - subjects/english/reviews/2026-07-03_review-set.md
  promotion_reason: explicit learner contribution ("give me one thing at a time"); delivery already follows it in the linked review set
  conflicts: []
  check_after_deliveries: 4
  check_after_event: first contradicting outcome
```

subject 作用域文件 `subjects/<subject>/strategies/<slug>.md` 使用相同字段，在其 front matter 里写 `scope: subjects/<subject>`。

learner 作用域条目由 `learning_apply`（`kind: strategy`、`scope: learner`）写入：内容正是这段条目主体，外面用一对哨兵注释 `<!-- gitlearnos:strategy id=<id> -->` … `<!-- /gitlearnos:strategy -->` 包裹，放在 `## Assistance strategies` 标题下的 `yaml` 围栏块里。哨兵让工具能追加新条目或就地替换某个 `id`，而无需重新生成整份 profile，因此旁边的观察记录和其它策略保持逐字节不变。你只提供条目主体；不要手改哨兵或手动重建该区块。如果 `learner-profile.md` 存在未提交的本地改动，合并会被拒绝；Git 承担历史、回滚与审计层，因此不维护条目级校验和。

`check_after_deliveries` 是该策略约束过的交付次数的整数计数；`check_after_event` 是一个命名条件。两者都可选，但对 stated 策略至少应设一个，因为它按构造没有结果证据。

保持文件合并（learner 作用域），同时每个条目保留自己的 `status`/`version`，这样能同时保住学习者要的两个属性：一个可检查的整体供阅读，以及逐条修订/归档，让被证伪的计划能降级而不动它周围稳定的画像观察。

## 钩子是封闭词表

策略只能绑定到这些钩子，且只能用它们列出的取值。不允许自由文本钩子：派生状态不得变成指令通道。

| 钩子 | 改变的 Agent 决策 | 示例取值 |
|---|---|---|
| `delivery` | 内容到达的数量与形式 | `one-item-per-turn`、`batch-then-stepwise`、`plain-text-first`、`summary-then-detail` |
| `support` | 提供什么帮助、何时提供 | `hide-choices-until-prediction`、`probe-before-hint`、`no-answer-until-asked` |
| `probing` | 先选哪个鉴别探针 | `prefer-qualitative-probe`、`start-with-recognition-cue` |
| `scheduling` | 复习间隔与会话形态 | `short-sessions`、`daily-fresh-item`、`retest-before-new-material` |
| `interaction` | 实时辅助中的语气与轮次 | `ask-learner-reasoning-first`、`one-question-per-reply` |

需要词表外取值的策略，要么是一次协议变更（就作为协议变更提出），要么根本不是策略。新增取值需要协议版本升级，而不是逐学习者编辑。

## 提升依据

两道不同的门；绝不混用。

**`basis: stated`。** 学习者或教师明确贡献了他们希望被怎样辅助。stated 策略可以在一次提交里直接建为 `active`。它的提升证据是那句原话及其记录链接。它不需要结果观察，学习者一句话就能撤销，撤销即置 `status: archived` 并链接撤销记录。因为它按构造不可验证，要设一个 `check_after_*` 条件：在它约束的第一次交付时 softly 确认，并记录任何例外。

**`basis: inferred`。** Agent 发现了一个重复的「支持—结果」模式。inferred 策略建为 `draft`。`draft` 策略绝不自行改变 Agent 行为；Agent 可以在 `preview` 模式下提议它（提议不等于应用）。只有在至少两个相互链接的独立观察显示被钩住的行为不同于其替代做法时，或教师/权威来源贡献了机制时，才提升为 `active`。不要把同一事件、同一会话或一次重述答案的重复副本算作独立支持。记录 `promotion_evidence`（事件/复习链接）、`promotion_reason`，以及一个计划中的延迟独立 `transfer_check`。未解决的阻塞性 `conflicts` 条目让策略保持 `draft`。

起草一个 inferred 候选本身也有门槛：只有当被钩住的动作当前选择不同、且这个差别对一次真实即将到来的交付有影响时，才建条目。如果该行为已经由某个模型的方法或画像约束带出，策略就没有增加杠杆——不要建它。

## 工作流

```text
周期性 maintenance run（仅做模式对账）
→ 扫描相互链接的事件与复习，找出不同的支持条件
→ 比较每种条件下的表现；保留相互竞争的解读
→ 候选的可证伪主张，带一个命名钩子和取值
→ 这个钩子会改变一个真实的下一步动作吗？否 → 留在事件或模型注记里
→ 它跨学科成立吗？是 → learner 作用域（画像条目）
                        否 → subject 作用域（subjects/<subject>/strategies/）
→ 是 stated 贡献吗？是 → 带原话证据的 active
→ 否则 → draft，计划下一次能检验它的交付
→ 后续独立结果 → 提升、修订或标记冲突
```

每个学习事件本应已保留实际用过的支持（提示、隐藏项、等待时间）。如果反复出现的事件遗漏了支持记录，那是事件纪律里的证据质量缺口，不是去猜一个策略的理由。

## 证据边界

- 一条策略是 `active`，绝不证明它在当前这道题上有效。只有结果记录（`event`、`review`）能改变掌握状态；策略绝不写 `demonstrated`、分数或回执。
- stated 策略记录的是学习者的请求，不是诊断；不要把它升级成关于能力的断言。
- 当结果与一条 `active` 的 inferred 策略冲突时，不要静默删除或只降权：把记录追加到 `conflicts`，置 `draft`，在适当时至多向学习者问一个确认问题，并保留可见的历史。`falsified` 适用于假设；策略降级为带链接的 `draft` 或 `archived`。
- Agent 至多应用当前作用域的 `active` 集合，并且当一次交付因某策略而明显改变时，必须用一句短话说明（「一次一条——想要后面的跟我说」）。

## 精简与归档

出现以下任一情况就归档一条策略：学习者撤销或反驳了一条 stated 策略；一条 inferred 策略未通过它计划的 transfer check 及之后两次交付；一条策略的钩子因底层模型或约束已覆盖而不再可达；一次归档学科的清理留下了没有活链接的它。一条在其 `check_after_deliveries` 计数内没有改变任何动作的 `active` 策略，退回 `draft` 并加注记。不要按钩子堆叠策略：每个钩子、每个作用域只保留一个 active 胜者；最新证据或更具体的作用域胜出，落败者带 `superseded_by` 链接归档。

## 输出

```text
Strategy created / promoted / revised / archived:
Basis: stated | inferred
Hook(s) and values:
Scope: learner (profile entry) | subjects/<subject>
Promotion evidence and reason:
Conflicts / superseded_by:
Planned next check (inferred only):
Files updated:
```
