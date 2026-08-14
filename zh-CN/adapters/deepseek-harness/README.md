# GitLearnOS 的 DeepSeek Harness 适配器

本适配器把 GitLearnOS 作为可原生安装的 bundle 接入官方 DeepSeek Harness
**Developer Preview**。它挂载一个 Host 插件，加入 `gitlearnos` 系统提示词
区段和三个有界工具：

- `learning_status` 报告 GitLearnOS 协调文件、当前目标路径、有效写入模式、
  仓库中记录的 RAG 与自动化证据标记，以及只读的复测就绪观察（见
  [复测就绪读取](#复测就绪读取)）；
- `learning_route` 选择对应的 GitLearnOS 操作与符合权限的下一步，但不会执行或
  声称已经写回。
- `learning_record` 通过串行、受政策约束的 Git 事务写入一条新学习事件，或返回
  精确的零写入结果。

DeepSeek Harness 和本适配器都仍是早期接入面。上游可能发生破坏性变化，安装前
必须审阅并固定版本。

接手后续 Harness 开发的 Agent 应先阅读[开发交接卡](DEVELOPMENT-HANDOFF.md)。
它只规定产品意图、权限、不可破坏原则与证据要求，不预设功能清单。

## 安装

Developer Preview 期间，应把 DeepSeek Harness 与本 bundle 都固定在已审阅的
提交。安装 GitLearnOS 仓库根目录；根清单会声明该适配器为 bundle：

```sh
dsh plugin --profile web add github:Guojiz/gitlearnos#<reviewed-commit-sha>
dsh --profile web --dump-config
```

本地开发时，在仓库根目录运行 `dsh plugin --profile web add .`。需要便携制品时，
在根目录运行 `npm pack`，再安装生成的 `.tgz`。该包使用 ESM JavaScript，且没有
`prepare` 或 postinstall 脚本，因此不需要 pnpm 构建许可。

Developer Preview 期间不要省略提交固定值：Git 依赖会安装所选仓库源码，移动
分支可能改变将被执行的插件代码。只有 `--dump-config` 中出现
`gitlearnos-host` 行，才能认为 bundle 已被发现。这并不能证明已经获得学习者
仓库写权限，也不能证明部署完整。

## 卸载

```sh
dsh plugin --profile web remove gitlearnos
dsh --profile web --dump-config
```

## 原生写入事务

`learning_record` 刻意比通用文件或 shell 工具更窄。它只接受既有的小写学科 slug
与稳定事件 ID，也只能新建 `subjects/<subject>/events/<event-id>.md`。写入前必须
存在完整学习者仓库设置文件与 active goal，目标必须是明确的 Git worktree 根，
并且调用方必须提供刚观察到的准确 base revision。

- `safe-auto` 可以新建并提交这一条事件。写入锁与两次 revision 检查会阻止并发
  或过期写入；事务只暂存并提交该路径，因此无关 staged/unstaged 工作保持不变。
- `preview` 返回精确 Markdown 提案，零写入。
- `manual` 与含糊政策返回 `requires-approval`，零写入。工具没有由模型传入的
  approval 开关，因此模型不能自我批准。
- 相同输入重试返回 `unchanged`，不会形成空提交。不同内容复用 ID、覆盖、路径
  穿越、符号链接逃逸或 Git base 改变都会被拒绝。成功结果包含 commit 与
  `git revert` 撤销边界。

这是第一条原生写路径，不是任意仓库维护。主 GitLearnOS 工作流仍负责判断证据
是否值得长期保存，并更新相关缺口、题目、模型、复测与视图。

## 复测就绪读取

`learning_status` 只读，并且会报告学习者接下来应复习的内容。它扫描
`subjects/*/reviews/*.md` 与 `subjects/*/models/*.md`，按同一行上显式的
`next review`、`next check` 或等价日期把每个文件分类：

- `due`：可解析日期为今天或更早；
- `upcoming`：可解析日期在未来；
- `noSignal`：没有可解析的复测日期——只按数量报告，绝不猜测。

它同时列出 `reviewFiles` 与 `knowledgeGaps`，让 Agent 无需手工翻找即可发现
已有复测集合和活跃缺口，并返回有序的 `actions` 队列（到期复习在前、按复测
日期排序，缺口在后）——这只是投影，绝不声称任何动作已经执行。

另外，`queue` 原样返回 `dashboard.md` 中 **Agent 维护的「接下来」列表**，
顺序就是 Agent 写的顺序。这个顺序归 Agent（它综合难度、重要性、掌握度、巩固
度判断），本工具只读、不写；Agent 尚未维护时为空。这是对仓库文本的启发式
观察，不是调度器：不写入、不运行 Git、不请求外部系统，也不会从无法解析或
缺失的标记中臆造到期日期。日期按 UTC 比较，接近午夜的边界仅供参考。

## 客户端学习面板

bundle 同时随包发布一个浏览器客户端半部（`adapters/deepseek-harness/client.js`），
在会话输入坞中挂载一条居中、默认收起的 `GitLearnOS ▸`。点开它，展开一个平铺、
有序的 `知识点（动作）` 列表——顺序是 Agent 的判断，绝非 Host 硬编码。

面板严格只读：

- 它通过一个 **仅限 loopback** 的逻辑 RPC 通道（`/gitlearnos`）拉取列表，该通道
  由 Host 通过 `ctx.connection.rpc.handle` 注册；远程浏览器会被拒绝，面板绝不
  写入学习者状态，也不重排队列；
- 它原样读取 Agent 维护的「接下来」列表；对于尚未维护队列的学习者仓库，回退到
  目标 / 缺口 / 模型 / 复习的只读投影；对于非学习者工作区，则显示明确标注的示例。

客户端入口以已构建的 `window.__ModuleLoader__.load` 模块格式随包发布，因此没有
构建步骤。`dsh.client`（platform 为 `web` 及其 `inject` 列表）、`exports["./client"]`
与 `@deepseek-ai/dsh-*` peer 依赖都声明在 `package.json` 中。

## 当前限制

- Host 使用当前进程工作目录，或部署时显式配置的 `root`。只有
  `learning_record` 会写入或运行 Git，且仅限上述窄事务。Host 不会调用 RAG
  或创建调度任务。
- 读取会拒绝绝对路径、父目录穿越与符号链接逃逸；单文件上限为 64 KiB，学科
  条目上限为 128，复测扫描总量上限为 512 个文件；检查固定协调文件、
  `subjects/*/goals/main-goal.md`，以及用于复测就绪读取的
  `subjects/*/reviews/*.md` 与 `subjects/*/models/*.md`。
- RAG 与自动化结果只是仓库证据标记，不是对外部系统的独立验证。
- DeepSeek Harness Schedule 只在当前会话中运行，不能唤醒已经停止的会话，单独
  使用它不满足 GitLearnOS 对 `maintenance` 和 `due-review` 的已验证、可操作
  仓库的重复自动化要求。
- 官方 DeepSeek provider 只处理文本。图片、截图、板书等视觉证据需要已验证的
  多模态 provider，或获授权 OCR/解析器路径；Agent 不得推断未看到的内容。
- `safe-auto` 只允许学习者政策范围内最小、安全、可撤销的学习写回。它不会绕过
  Harness 工具政策、操作系统沙箱、凭据要求，或破坏性及其他高风险操作的审批。
- 完整 GitLearnOS 协议仍是最高依据。只安装 bundle 不等于完成学习者部署、
  RAG 部署或已验证重复自动化部署。

## 路线图，不是当前能力

未来原生 Harness 扩展明确包括以下方向，避免把计划误当成已经交付：

- 带来源追踪的可替换 RAG provider，支持导入与检索；
- Web 学习 Cockpit（已随包发布的只读队列视图只是第一步，
  更完整的、由长期 Git 证据支撑的 Cockpit 尚未构建）；
- 生成、审阅并延迟复测可组合模型的迁移掌握工作流；
- 能在冷会话中运行的已验证外部重复 worker 桥接。

其余三项当前 Host 基座尚未实现；Cockpit 目前仅以「客户端学习面板」一节的
只读队列视图存在。在每一项的代码与端到端证据出现前，应继续使用常规 GitLearnOS
Agent 工作流和其他文档所列、真正拥有仓库能力的自动化适配器。
