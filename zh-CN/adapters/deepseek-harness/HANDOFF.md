# GitLearnOS × DeepSeek Harness — 会话交接卡

[English](../../../adapters/deepseek-harness/HANDOFF.md)

记录一轮已完成开发的状态，让另一个 Agent 接手时不必重新推导决策。这是状态，
不是功能规格。

## 已完成（可审查）

1. **`learning_status` 的只读观察更丰富**——现在返回 `dueReview`
   （`due` / `upcoming` / `noSignal`，来自显式 next-review 日期）、`reviewFiles`、
   `knowledgeGaps`，作为证据输入而不是 Host 排好的队列。纯投影；不写入、不改
   Git、不请求 RAG、不请求调度器。
2. **协议参考加入「一句收尾」**——讲完一个点后，用一道多选收尾，干扰项是
   最可能的误解；选错某个干扰项会为可能的混淆提供证据，但不冒充已经证明了
   隐藏原因。见
   `skills/gitlearnos/references/{session,question,review}.md`（中英同步）。
3. 文档与场景 16 已更新。
4. **Agent 维护的学习队列**——`learning_status` 返回 `queue`（`dashboard.md`
   的「接下来」列表，原样、按 Agent 写的顺序）；`templates/dashboard.md`
   记录了这个约定，系统提示要求 Agent 维护它。顺序归 Agent，工具只读、不写。
5. **学习面板已烘焙进 bundle**——客户端半部
   （`adapters/deepseek-harness/client.js`）注册 `GitLearnOS ▸` 输入坞条目
   （收起条 → 平铺 `知识点（动作）` 列表 → 一键动作菜单）。它只通过一个
   **仅限 loopback** 的 `/gitlearnos` 逻辑 RPC 通道读取队列（由 Host 半部
   `ctx.connection.rpc.handle` 暴露）。无需 tsdown 构建：客户端入口以已构建的
   `window.__ModuleLoader__.load` 模块格式随包发布。`exports["./client"]`、
   `dsh.client` 与 peer 依赖已写入 `package.json`。测试通过 25/25，包括“不由
   Host 排序”“不显示空状态”和“展示决定仅限指定位置”的边界。
6. **Agent 控制展示状态**——主 Agent 在「接下来」旁写入 `Panel: expand` 或
   `Panel: collapse`。稳定版本让每个新决定只应用一次；定时刷新会保留学习者的
   手动切换，直到 Agent 改变队列或展示决定。

## 产品方向（通过 /grill-me 对齐）

Harness 原生界面是一个「无脑学习」面板：

- 居中一条 `GitLearnOS ▸`；每个新队列版本是展开还是收起由 Agent 决定，学习者
  始终可以手动切换；
- **不分分类别，只有先后**——而先后顺序是 **Agent 的判断**（读 Git 里的难度 /
  重要性 / 掌握度 / 巩固度综合排出），绝不由插件硬编码；
- 主轴是 **「学习者问 → AI 教」**：问之前 = Agent 排好队列；问之中 = 学习者问、
  AI 教；问之后 = 一句多选收尾。

## 临时原型（已被替代）

动态 Cordis 插件 `glearn-1` 在烘焙前预览过该面板。它已不再是事实来源；面板
现由 bundle 客户端半部负责。方便时即可停掉 `glearn-1`——它只存在于运行时，
重启即失效。

## 刻意延后 / 已决定

- 诊断式多选作为独立 UI **不需要**：Harness 自带的 `ask_user_question` 收尾
  已经端到端可用、读起来也顺，就保持现状。

## 已发布、已安装的证据

- 功能版本 `423716104e812aa49f4be5c7e0c9b167edffb77c` 已进入 `main`。
- 正式 `web` profile 已固定安装这个 GitHub 版本。
- 一个全新的 Harness 进程在 3081 端口加载了包内面板，不依赖旧的动态原型
  `glearn-1`。真实浏览器中可看到默认收起条、展开后的演示列表、明确的演示标识
  和全部五个动作。
- 点击「收尾一道」后，预期提示词进入 Harness 输入框，面板随即自动缩回。此前
  的 `invalid client-request message` 已真实复现，定位为 RPC 请求遗漏 payload，
  改为显式空对象后修复，并加入回归断言。
- 第二个全新进程在 3082 端口使用纯合成学习仓库。真实浏览器验证了四段展示状态：
  首次加载时 `expand` 自动展开；学习者手动收起后经过 30 秒刷新仍保持收起；Agent
  更新队列并继续选择 `expand` 时，新版本只展开一次；Agent 改为 `collapse` 后，
  面板再次收起。
- 这些证据证明 bundle 能加载、面板能交互；不冒充已经发生学习者写入、RAG
  检索、后台调度或掌握事件。

## 提交 / 回滚

- 已审查的开发提交都在 `origin/main`。权威清单以 `git log` 为准，不再复制一个
  容易漂移的数量；正式安装版本包含面板、队列、一句收尾、排序实验、证据边界
  修正、真实运行时 RPC 修复和 Agent 控制展示状态。
- 回滚：`git revert HEAD`（保留历史）或 `git reset --hard HEAD~1`（丢弃该提交）。
  本轮未触碰学习者 Git 状态。

## 后续工作

本轮已没有发布门槛。后续应另开一个有证据的真实学习者场景，不要继续堆演示面板。
