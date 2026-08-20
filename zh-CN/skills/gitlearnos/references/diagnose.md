# GitLearnOS 鉴别诊断

遵循 Router 的核心契约。本参考说明如何把错误信号变成可修订的假设集。它不取代
`organize.md`、`session.md`、`question.md` 或 `review.md`。

[English source](../../../../skills/gitlearnos/references/diagnose.md)

当前事件是*非预期*错误、认真尝试后仍卡住、或与既有掌握状态矛盾的新证据时，
加载本文件。

普通新学习不要进入鉴别诊断（「我还没学过导数，请你教我」）。那是预期的尚未
学会内容：走 `tutor` / `organize`，不是 `diagnose`。

DeepSeek Harness 原生路径：需要诊断时，对 `learning_route` 显式传入
`operations: ["diagnose", ...]`，不要只靠 Host 正则。缺口生命周期更新使用
`learning_apply` 的 `action: "update"`，以及当前文件内容的
`expectedContentSha256`（来自 `learning_status.contentHashes`）。

## 目标

不要把表面错误直接写成知识缺口。先诊断。

```text
signal
→ competing hypotheses
→ discriminating probe
→ best-supported diagnosis or remaining uncertainty
→ targeted intervention only when teaching is requested or justified
→ independent delayed transfer check
→ corroborate, falsify, or revise the learner model
```

诊断是有证据链接的假设，不是事实。喜欢追问的模型和喜欢立刻讲解的模型，
都必须遵守同一写入门槛。

## 宪章

1. 不要只给答案；失败非预期时要诊断。
2. 不要只记录错误；要解释错误。
3. 不要相信第一判断；尝试证伪。
4. 没有独立证据，不得声称掌握。
5. 不要为追问而追问。不能劈开剩余假设的问题，不算诊断题。
6. 学习者明显处于预期新学习时，优先教学；过度诊断是协议失败。

## 假设分层（不是强制八选一）

类别可以同时成立。优先记一个主类，再可选记下机制和模型关系。

**知识 / 技能**

| Class | Meaning |
|---|---|
| `concept-unestablished` | 目标对象尚未稳定表征 |
| `prerequisite-missing` | 本步所需的先前概念缺失 |
| `procedure-unavailable` | 程序当前不可用（仅当有既往掌握证据时才说遗忘） |

**任务 / 执行**

| Class | Meaning |
|---|---|
| `calculation-error` | 概念和步骤都在，算术或执行失败 |
| `language-misread` | 题意解析错误 |
| `incidental` | 疲劳、看错数字或一次性失误 |

**历史 / 泛化**

| Class | Meaning |
|---|---|
| `transfer-failure` | 原型会，变式不会 |
| `mastery-overestimated` | 既往 `demonstrated` 或高置信过乐观 |

记录形状示例：

```text
primary: transfer-failure
possible mechanism: prerequisite-missing
model relation: mastery-overestimated
```

不要把集合收成学习者的第一句抱怨。「不会求最大值」只是信号，可能跨多层。

## 鉴别性追问

问题形式不重要；答案是否降低假设不确定性才重要。

「你卡在哪」这类元认知问题，默认**不算**诊断探针，*除非*答案确实劈开了
当前活假设。若能劈开，就是有效探针。

规则：

- 能定性分开时，先定性后计算；
- 优先微型题目，而不是空洞的元认知自述；
- 默认策略大约 1–3 个追问（不是硬协议不变量——深度随年龄、学科和风险而变）；
- 剩余类别导向同一干预、学习者要求讲解/停止、或再问收益低于成本时，停止追问。

例如「不会求这道二次函数最大值」时，先问 `y = -2x^2 + 4x + 1` 开口向上还是
向下、先不要计算。答「上」支持 `a` 与开口方向联系不稳；答对「下」则排除该类，
下一问应区分顶点含义、程序可用性与计算。

## 停止追问与写入 supported 诊断

这是**两道不同的门**。

**停止追问**，当满足任一项：

- 剩余活假设不会改变下一步干预；
- 学习者要求讲解或停止；
- 继续追问不太可能值回成本。

**写入 `supported` 诊断**，仅当同时满足：

- 某一具体假设已有正向鉴别证据；**并且**
- 会导致*不同*教学动作的合理替代，已被排除或明显削弱。

后果：

- 「剩余假设共享一种干预」→ 可以停问；最多写 `suspected`（或共享干预计划），
  **不是** `supported`。
- 「追问预算耗尽」→ 可以停问；**绝不**单独把假设升级为 `supported`。
- 在许多候选里只排除一个弱类，**不能**通过 `supported` 写入门槛。

偶然失误留在事件里。被撤回的假设以 `falsified` 留在记录中。删掉错误标签，
比留下已否定的标签更糟。

## 知识缺口粒度

写入缺口的粒度是**当前最佳支持的卡点**（或得到支持的解释），不是第一句表面
抱怨，也不是形而上学的「根因」。优先用 `best-supported blocker`、
`supported diagnosis` 或 `supported explanation`，不要用 `confirmed root cause`。

## 诊断生命周期

过程状态（`open` / `needs-check` / `resolved`）与解释状态分开：

```text
anomaly → suspected → diagnosing → supported
        → intervening → retesting
        → corroborated | falsified | revised
```

缺口或事件中使用这些解释状态：

- `anomaly`：存在信号；
- `suspected`：假设仍开着；还不是掌握判决；
- `diagnosing`：探针进行中；
- `supported`：某一诊断已有正向证据，且会改变干预的替代已被削弱；
- `intervening`：针对性教学或练习进行中；
- `retesting`：独立题目已计划或进行中；
- `corroborated`：延迟独立迁移仍支持该诊断（优于 `confirmed`）；
- `falsified`：后续证据否定了该诊断；
- `revised`：诊断已在受控更新下改写。

绝不能把 `suspected` 当成 `demonstrated`，也不能据此直接下调掌握。

已有 gap/model/review 文件的受控更新必须使用 `learning_apply` 的
`action: "update"`、同一规范 id/path、当前 utf8 内容的 `expectedContentSha256`、
精确 `baseRevision`，且目标没有未提交本地修改。被否定状态的历史留在正文里；
不要另造第二个 id 去「覆盖」旧判断。

## 证伪

每个诊断假设都必须可撤回。后续证据矛盾时：

1. 把解释状态设为 `falsified`；
2. 记录矛盾证据和日期；
3. 停止用该原因选题或改掌握状态；
4. 保留历史；不要删除标签。

例如 Agent 曾怀疑百分数「底数」概念缺失。后来探针表明学习者能改写底数，
只是看错数字。正确记录是：该假设曾提出、后来被证伪。沉默比留下已撤回标签更糟。

## 与既有掌握状态的矛盾

新证据与 `demonstrated` 或以往较强信念冲突时，不能只降低掌握度。打开互竞类别：

- 遗忘（仅当有既往正向证据）；
- 复杂度上升；
- 参数、表征或情境变化后的迁移失败；
- 既往掌握过估（样本过窄）；
- 偶然状态。

用一个鉴别探针，再修订。掌握值是带反证义务的信念。

## 与其他操作的关系

- `organize.md` 负责持久写回和写入门槛；
- `session.md` 负责实时辅导；除非学习者要答案或材料明显是新学习，完整讲解前须先诊断；
- `question.md` 负责持久化 `diagnostic` 探针和之后的迁移检验；
- `review.md` 负责评分；当场通过的检查不得升级掌握；
- `model.md` 仍需两条已链接观察或明确方法才可晋升。

## 输出

本工作流运行时，在普通回执中包含：

```text
Diagnosis:
Hypotheses remaining:
Ruled out:
Stop-probe gate: held / passed
Supported-write gate: held / passed
Interpretation:
Falsified:
Next probe or intervention:
```
