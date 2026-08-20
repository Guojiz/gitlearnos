# GitLearnOS 鉴别诊断

遵循 Router 的核心契约。本参考文件定义如何把错误信号变成可修订的假设集。
它不取代 `organize.md`、`session.md`、`question.md` 或 `review.md`。

[English source](../../../../skills/gitlearnos/references/diagnose.md)

当前事件是错误、卡住的尝试、自称不会，或与既有掌握状态矛盾的新证据时，
加载本参考文件。

## 目标

不要把表面错误直接记成知识缺口。先诊断。

```text
信号
→ 互竞假设
→ 鉴别性追问
→ 得到支持的根因，或仍保留不确定性
→ 仅在学习者要求或确有必要时做针对性干预
→ 独立、延迟的迁移检验
→ 确认、否定或改写学习模型
```

会不会追问不能只靠模型性格。爱解释的 Agent 和爱提问的 Agent 都必须遵守
同一条写入门槛。

## 宪法

1. 不要只回答，要诊断。
2. 不要只记录错误，要解释错误。
3. 不要相信第一个判断，要尝试证伪。
4. 不要轻易宣布掌握，要寻找独立证据。
5. 不要为了追问而追问。劈不开剩余假设的问题，等于没问。

## 互竞假设

在证据把它们分开之前，必须同时保留多个假设类。稳定标识符：

| 类别 | 含义 |
|---|---|
| `concept-unestablished` | 目标对象还没有稳定表征 |
| `prerequisite-missing` | 这一步所需的更早概念缺失 |
| `procedure-forgotten` | 概念在，步骤不在 |
| `calculation-error` | 概念和步骤都在，计算或执行失败 |
| `language-misread` | 题意或条件读错 |
| `incidental` | 状态、看错数字或偶然失误 |
| `transfer-failure` | 会原型，不会变式 |
| `mastery-overestimated` | 以前的 `demonstrated` 或高信心过于乐观 |

不要把假设集收成学习者的第一句抱怨。“不会求最大值”只是信号，上面任何一类
都可能成立。

## 鉴别性追问

空洞的“为什么不会”“你卡在哪”几乎不降低不确定性。要问能劈开剩余假设的
最小题目。

规则：

- 能定性区分时，先定性后计算；
- 优先微题目，而不是元认知自评；
- 预算两到三个追问；
- 剩下的假设若导向同一种下一步，立即停止（干预不变即停）；
- 学习者要求直接教、表示疲劳、或说不要测验时停止；
- 以后才作答的鉴别题通过 `question.md` 持久化；实时辅导中的探针可留在会话，
  结束后写回。

例如，对 `y = -2x^2 + 4x + 1`，先问开口向上还是向下，就能在讨论顶点公式
之前，把 `concept-unestablished` 与 `calculation-error`、
`procedure-forgotten` 分开。

## 写入门槛

除非满足以下至少一条，否则不得把表面症状写成得到支持的知识缺口：

1. 至少一类互竞假设已被追问或可见作答排除；
2. 剩下的类别导向同一种干预；
3. 追问预算用尽，且一类明显占优。

否则：

- 只保留精简事件；
- `diagnosis_status` 设为 `unknown` 或 `agent-hypothesis`；
- 记下互竞列表；
- 若缺口文件已存在，解释状态标 `suspected`，不得标成已支持。

写入缺口的粒度是得到支持的根因，不是第一句抱怨。题为“不会求二次函数最值”
的缺口通常写错了对象。

一次性的 `incidental` 或 `calculation-error` 留在事件里。只有后续独立观察
否定“偶然”解读时，才升级为缺口。

## 解释生命周期

处理状态（`open` / `needs-check` / `resolved`）与解释状态必须分开：

```text
anomaly → suspected → diagnosing → supported
        → intervening → retesting
        → confirmed | falsified | revised
```

在缺口或事件中使用：

- `anomaly`：出现信号；
- `suspected`：假设未确诊，不能当掌握判决；
- `diagnosing`：鉴别追问进行中；
- `supported`：某一根因开始占优；
- `intervening`：针对性教或练进行中；
- `retesting`：独立题目已布置或进行中；
- `confirmed`：延迟独立迁移仍支持该根因；
- `falsified`：后续证据否定该根因；
- `revised`：根因被改写。

`suspected` 不能当作 `demonstrated`，也不能单独用来降低掌握。

## 证伪

每个诊断假设都必须可撤回。后续证据与它矛盾时：

1. 把解释状态设为 `falsified`；
2. 记录否定它的证据和日期；
3. 停止用该原因选题或改掌握状态；
4. 保留历史，不得删掉标签。

例如，系统曾怀疑“百分比基准量薄弱”，继续追问后发现学习者能正确改写基准，
只是看错了题面数字。正确记录是：该假设曾被提出，后来被证据否定。不留痕迹
比留下已否定的标签更不可信。

## 与旧掌握状态的矛盾

新证据与 `demonstrated` 或以往较强信念冲突时，不能只降低掌握度。打开互竞
解释：

- 遗忘；
- 题型变复杂；
- 含参、换表征或换语境后的迁移失败；
- 以往掌握判断样本过窄、过于乐观；
- 当天状态。

用一个鉴别题，再修订。掌握值是带反证义务的信念。

## 与其他操作的关系

- `organize.md` 负责持久写回和写入门槛；
- `session.md` 负责实时辅导；除非学习者要求直接给解答，否则必须先诊断再
  完整讲解；
- `question.md` 负责持久化的 `diagnostic` 探针和之后的迁移检验；
- `review.md` 负责评分；当场通过的检查不得升级掌握；
- `model.md` 仍要求两条已链接观察或明确方法才晋升。

## 输出

本工作流运行时，在普通回执中增加：

```text
Diagnosis:
Hypotheses remaining:
Ruled out:
Write barrier: held / passed
Interpretation:
Falsified:
Next probe or intervention:
```
