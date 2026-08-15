# GitLearnOS 的 DeepSeek Harness 适配器

本适配器把 GitLearnOS 作为可原生安装的 bundle 接入官方 DeepSeek Harness
**Developer Preview**。它挂载一个 Host 插件，加入 `gitlearnos` 系统提示词
区段和四个有界工具：

- `learning_status` 报告 GitLearnOS 协调文件、当前目标路径、有效写入模式、
  仓库中记录的 RAG 与自动化证据标记，以及只读的复测就绪观察（见
  [复测就绪读取](#复测就绪读取)）；
- `learning_route` 选择对应的 GitLearnOS 操作与符合权限的下一步，但不会执行或
  声称已经写回。
- `learning_apply` 把 event/gap/model/review/dashboard 计划作为一个原子 Git 提交执行；
  `learning_record` 保留为兼容用的单事件包装器。

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

`learning_apply` 刻意比通用文件或 shell 工具更窄。它接受 event、gap、model、
review 与 dashboard projection 组成的有界 typed plan；每条记录都有规范的小写 ID
与 schema 规定的路径，dashboard 只允许投影到 `dashboard.md`。写入前必须存在明确
的 learner identity、完整 setup answers、active goal、Git worktree 根，并提供刚观察
到的准确 base revision。

- `safe-auto` 可以把整个 plan 作为一个事务提交。写入锁与 revision 检查会阻止并发
  或过期写入；只暂存并提交声明的路径，因此无关 staged/unstaged 工作保持不变。
- `preview` 返回精确 Markdown 提案，零写入。
- `manual` 与含糊配置返回 `requires-approval`，零写入。工具没有由模型传入的
  approval 开关，因此模型不能自我批准。
- 相同输入重试返回 `unchanged`，不会形成空提交。不同内容复用 ID、覆盖、路径
  穿越、符号链接逃逸或 Git base 改变都会被拒绝。成功结果包含 commit 与
  `git revert` 撤销边界。

这是 typed atomic 写入路径，不是任意仓库维护。主 GitLearnOS 工作流仍负责判断
证据是否值得长期保存并选择 plan。

## 复测就绪读取

`learning_status` 只读，并且会报告学习者接下来应复习的内容。它扫描
`subjects/*/reviews/*.md` 与 `subjects/*/models/*.md`，按同一行上显式的
`next review`、`next check` 或等价日期把每个文件分类：

- `due`：可解析日期为今天或更早；
- `upcoming`：可解析日期在未来；
- `noSignal`：没有可解析的复测日期——只按数量报告，绝不猜测。

它同时列出 `reviewFiles` 与 `knowledgeGaps`，让 Agent 无需手工翻找即可发现
已有复测集合和活跃缺口。这些字段只是证据输入，不是优先级队列。

另外，`queue` 原样返回 `dashboard.md` 中 **Agent 维护的「接下来」列表**，
顺序就是 Agent 写的顺序。这个顺序归 Agent（它综合难度、重要性、掌握度、巩固
度判断），本工具只读、不写；Agent 尚未维护时为空。这是对仓库文本的启发式
观察，不是调度器：不写入、不运行 Git、不请求外部系统，也不会从无法解析或
缺失的标记中臆造到期日期。日期按 UTC 比较，接近午夜的边界仅供参考。

## 客户端学习面板

bundle 同时随包发布一个浏览器客户端半部（`adapters/deepseek-harness/client.js`），
在会话输入坞中挂载一条居中的 `GitLearnOS ▸`。Agent 在「接下来」队列旁写入
`Panel: expand` 或 `Panel: collapse`，因此新的队列版本可以在合适时主动展开，
也可以在不宜打断时保持收起。每个新版本的决定只应用一次；之后由学习者手动控制，
直到 Agent 再次改变队列或展示决定。展开后是一个平铺、有序的
`知识点（动作）` 列表——顺序是 Agent 的判断，绝非 Host 硬编码。

面板严格只读：

- 它通过一个 **仅限 loopback** 的逻辑 RPC 通道（`/gitlearnos`）拉取列表，该通道
  由 Host 通过 `ctx.connection.rpc.handle` 注册；远程浏览器会被拒绝，面板绝不
  写入学习者状态，也不重排队列；
- 它原样读取 Agent 维护的「接下来」列表；学习者仓库尚未维护队列时，面板保持
  隐藏而不是编造顺序；非学习者开发工作区则显示明确标注的示例。
- 它读取 Agent 明确写下的展示决定与稳定版本；30 秒定时刷新不会反复展开学习者
  已经手动收起的面板。

客户端入口以已构建的 `window.__ModuleLoader__.load` 模块格式随包发布，因此没有
构建步骤。`dsh.client`（platform 为 `web` 及其 `inject` 列表）、`exports["./client"]`
与 `@deepseek-ai/dsh-*` peer 依赖都声明在 `package.json` 中。

## 当前限制

- Host 使用当前进程工作目录，或部署时显式配置的 `root`。只有
  `learning_apply`（`learning_record` 兼容包装器）会写入或运行 Git，且仅限上述窄事务。Host 不会调用 RAG
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
- `safe-auto` 只允许学习者配置范围内最小、安全、可撤销的学习写回。它不会绕过
  Harness 工具策略、操作系统沙箱、凭据要求，或破坏性及其他高风险操作的审批。
- 完整 GitLearnOS 协议仍是最高依据。只安装 bundle 不等于完成学习者部署、
  RAG 部署或已验证重复自动化部署。

## 当前边界

当前 Host 已提供 typed atomic Git 写回、有界 due/gap 扫描、基于机器 receipt 的
外部状态，以及只读 canonical 队列面板。外部 RAG 摄取与周期自动化仍由可替换适配器
负责；本 bundle 只记录 marker 或严格 receipt，不调用外部系统，也不会无 receipt 声称
已经执行。证据决策继续由正常 GitLearnOS Agent 流程负责，后台工作使用具备仓库能力的
自动化适配器。
