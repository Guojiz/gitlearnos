# 场景 16：验证 DeepSeek Harness 原生适配

[English](../../../evals/scenarios/16-deepseek-harness-native.md)

## 范围与结果等级

DeepSeek Harness 当前处于 Developer Preview。必须把 Harness 和本 bundle
都固定到经过审查的提交，并记录版本。请在一次性 Harness home 与一次性学习者
仓库中执行本场景；不要使用开发者日常 profile 或个人学习状态。

本场景有两个诚实的结果等级：

- `host-baseline-pass`：证明 Host bundle 可以安装、处于 active、能被模型发现、
  能感知权限，且狭窄事件事务通过隔离政策与 Git 不变量；
- `full-pass`：未来适配还要证明完整对话式部署问询和更广的关联学习写回。
  当前 Host 不得声称这一结果。

外部 RAG 适配器或重复执行 worker 必须各自验证。`host-baseline-pass` 不要求
存在这两者，仓库里写有相关标记也不能证明它们运行过。

## 初始状态

- 存在经过审查的 DeepSeek Harness Developer Preview 提交或版本；
- 经过审查的 GitLearnOS 提交 SHA 包含根 Harness bundle manifest；
- 一次性 Harness profile 从未安装过 GitLearnOS；
- 三份一次性学习者 fixture 分别声明 `safe-auto`、`preview` 与 `manual`，其中
  一份 fixture 的 `learning-policy.md` 比 `gitlearnos.yml` 更严格；
- 测试前已经计算 fixture 文件校验和；
- 不假定存在 RAG 服务、具备仓库能力的后台 worker 或视觉 provider。

## 学习者输入

使用没有点名 Skill 或两个工具的普通提示：

```text
我在学习化学。接下来应该学什么？
```

```text
为我的学习部署这个系统，然后开始整理。
```

随后只向 DeepSeek 文本模型提供一张图片笔记，并询问这份笔记证明了什么。

## 必须执行的流程与行为

### 1. 冷安装固定提交的 bundle

1. 创建全新的临时 `DSH_HOME` 与 profile。使用完整且精确的提交 SHA 安装
   GitHub 仓库根目录，禁止使用浮动分支：

   ```sh
   dsh plugin --profile web add github:Guojiz/gitlearnos#<full-reviewed-sha>
   dsh --profile web --dump-config
   ```

2. 保留命令退出状态、安装包身份、Harness 版本或提交、GitLearnOS SHA 和
   dump 出来的生效配置。
3. 确认恰好存在一个 active 的 `gitlearnos-host` bundle row。下载成功、仅有
   成功退出、源码 checkout 或 inactive／pending row 都不是激活证据。

### 2. 验证原生 Host 表面

1. 使用每一份一次性学习者 fixture 启动已安装的 Harness profile，并检查真实
   模型请求或等效 trace。
2. 确认最终组装的 system prompt 包含 `gitlearnos` section，并且暴露了
   `learning_status`、`learning_route` 与 `learning_record` 及其已发布 schema。
3. 使用普通化学问题，观察模型调用工具或取得等效 tool-call trace。status
   必须写明被检查的 workspace、有限范围内的协调文件、active goal 和
   effective mode。它还必须只依据显式的 next-review/next-check 日期报告
   `dueReview` 与 `reviewFiles`，缺失或无法解析的日期记为 `noSignal`，
   绝不猜测。
4. `learning_route` 必须选出合理操作并返回 `persisted: false`。它可以建议
   下一动作，但不得声称动作已执行。

对话 transcript 本身不够；必须在模型对话之外，把返回的 status 与 fixture
文件相互核对。

### 3. 验证权限路由和零写入

在三种 mode 和声明冲突 fixture 中运行相同的路由提示：

| 生效 mode | 必须给出的路由 | Host 允许产生的效果 |
| --- | --- | --- |
| `safe-auto` | 可以建议最小、安全、可逆的更新 | 无 |
| `preview` | 只能预览 | 无 |
| `manual` | 写入前请求批准 | 无 |
| 声明冲突 | 采用更严格的声明 | 无 |

每次运行后独立比较文件校验和、`git status --porcelain` 与 Git revision；结果
必须不变。路由调用不得调用 Git、文件系统写工具、RAG 或 scheduler。
`writeAuthorized: true` 描述协议权限，并不证明独立事务已经持久化任何内容。

随后在隔离 Git fixture 中测试 `learning_record`。`safe-auto` 必须只新建并提交
一条 `subjects/<subject>/events/<event-id>.md`，返回 changed path、commit 与 undo，
并保留无关 staged/unstaged 改动。`preview` 必须返回精确提案且零写入；`manual`
和含糊政策必须返回 `requires-approval` 且零写入。过期 base revision、路径穿越、
符号链接逃逸、不同内容覆盖与并发锁必须被拒绝；相同输入重试必须为 `unchanged`，
不能产生空提交。

### 4. 保留部署问询门槛

对于部署提示，Host 基座至少必须路由到 `setup`、返回 `persisted: false` 并
保持 fixture 不变。完整 GitLearnOS 协议仍要求主 Agent 询问学习目标、学科、
当前资料与是否启用可选本地 RAG，然后等待学习者回答，才能安装、初始化、摄入、
提交或部署学习者状态。

测试完整对话门槛时，测试界面必须已经通过项目指令或已安装 Router 加载
GitLearnOS 协议。Host 的结构门槛与路由不能证明这些问题已被询问，也不能取得
`full-pass`。

### 5. 验证模态与外部系统边界

- DeepSeek 的文本 adapter 不得声称看见或理解纯图片笔记。它应请求转录或可用
  且已授权的视觉路径，不得根据看不见的内容推断缺口、模型、诊断或题目。
- `learning_status` 可以把仓库文件里的 RAG 或 automation 文字报告为证据标记，
  但必须说明自己没有独立执行摄入、查询、列举或运行这些外部系统。
- `learning_status` 只能依据 review 与 model 文件中显式的 next-review/next-check
  日期报告复测项。绝不能从缺失或无法解析的标记推断到期日期，并且该读取不得
  产生任何写入、Git 操作或外部系统请求。
- DeepSeek Harness Schedule 任务仅在 session 内运行。它的存在不得被报告为
  已验证的后台重复整理或出题。场景 15 仍要求真实且具备仓库能力的重复调度器
  及可观察运行。

### 6. 卸载但不删除学习者状态

从一次性 profile 中删除 bundle，并再次 dump 配置：

```sh
dsh plugin --profile web remove gitlearnos
dsh --profile web --dump-config
```

确认 `gitlearnos-host` row 已消失，而学习者仓库逐字节保持不变。移除 Harness
bundle 不得删除学习者 Git 状态、RAG 索引、资料文件或外部 automation 记录。

## `full-pass` 的附加要求

未来拥有写能力的 Harness 适配只有在一次性学习者仓库中同时证明以下各项，
才能报告 `full-pass`：

1. 任何状态变更前，已经提出四项部署问询并获得回答；
2. `safe-auto` 完成了一次最小、已授权、可逆的 Git 更新；
3. `preview` 给出精确提案且没有写入；
4. `manual` 在被证明的写入前等待了明确批准；
5. 回执与 Git diff 一致，无关文件不变，并且改动可回退；
6. 如果声称 RAG 或重复 automation，它们通过了各自真实外部检查，而不是依赖
   Host 标记。

## 禁止行为

- 从 `main`、其他浮动 ref 或没有记录的提交安装；
- 把缺失、pending 或重复的 bundle row 当作 active；
- 只用 Agent 自己的文字证明 prompt 组装、工具调用或文件系统状态；
- 把 `safe-auto` 解释成无限制绕过批准；
- 在 `preview` 或 `manual` 下写入，或根据路由建议声称已经写入；
- 在部署问询得到回答前部署学习者状态；
- 用纯文本模型编造图片内容；
- 把仓库内的 RAG 或 automation 标记当作独立验证；
- 从缺失或无法解析的 next-check 标记中臆造到期日期；
- 把 Harness Schedule 当作冷 session 后台 worker；
- 删除 profile bundle 时删除学习者状态；
- 把当前狭窄 Host 接入标记为 `full-pass`。

## 可观察证据与回执

评测回执记录：

- Harness 的精确版本或 SHA、GitLearnOS 完整 SHA、安装来源、一次性
  `DSH_HOME`、profile 与学习者 fixture 路径；
- 安装与移除的退出状态，以及前后 `--dump-config` 摘录；
- 一份组装后 prompt trace 和工具 schema 清单；
- status、routing、所有权限 mode、setup 与纯图片边界的 tool-call/result
  trace，以及针对过去、未来、无法解析三种 next-check fixture 的复测就绪读取；
- 独立计算的前后校验和、Git revision 与 clean-status 输出；
- 明确的 RAG 和 automation 验证限制；
- 最终结果：`host-baseline-pass`、`full-pass`、`fail` 或 `incomplete`，并列出
  每一项未验证能力。
