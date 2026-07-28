# 用 Claude Code 或 Codex 部署 OpenHanako

本指南说明 Claude Code、Codex、Cursor 或其他代码 Agent 在 GitLearnOS 生态里的正确角色。

它们不是本仓库维护的日常 GitLearnOS 学习运行层。

它们适合做一件事：

```text
部署、阅读、调试和定制 OpenHanako / HanaAgent
```

OpenHanako 跑起来以后，GitLearnOS 的桌面端工作流应该回到 OpenHanako 自己的 Agent、subagent、channel、desk、memory、Skills 和定时任务能力里运行。

## 边界

```text
ChatGPT / Claude
→ 原生日常 GitLearnOS 学习平台

OpenHanako / HanaAgent
→ 可选桌面运行时，用于本地文件和更深入自动化

Claude Code / Codex / Cursor / CLI agents
→ OpenHanako 的部署和源码辅助工具
→ 不是本仓维护的日常学习层
```

除非用户明确想要开发者工作流，不要让 Claude Code 或 Codex 变成 GitLearnOS 辅导平台。

## 先核对这些源码事实

代码 Agent 给出确定部署指令前，必须先检查真实 OpenHanako 文件。

当前已核对文件：

```text
Repository:
liliMozi/openhanako

README.md
package.json
scripts/launch.js
scripts/dev-env.js
server/index.ts
core/agent.ts
lib/tools/subagent-tool.ts
lib/tools/channel-tool.ts
scripts/build-server.mjs
```

不要第一轮就扫描整个源码树。首次部署不要修改源码，除非构建失败且用户批准修复。

## OpenHanako 源码显示了什么

当前源码显示：

```text
package.json
→ name: hanako
→ productName: HanaAgent
→ main: desktop/bootstrap.cjs
→ bin: hana → cli/entry.ts
→ node engine: >=24.12.0 <25
```

重要脚本包括：

```text
npm run start
npm run start:dev
npm run start:vite
npm run dev:renderer
npm run cli
npm run server
npm run build:client
npm run build:server
npm run pack
npm run dist
npm run dist:win
npm run dist:linux
npm run typecheck
npm run test
```

其他源码事实：

- `scripts/launch.js` 是跨平台启动器，并在启动 Electron 前清除 `ELECTRON_RUN_AS_NODE`。
- `scripts/dev-env.js` 把开发环境 `HANA_HOME` 设置为 `~/.hanako-dev`。
- `scripts/build-server.mjs` 当前固定 server 打包内置 Node runtime 为 `v24.15.0`，并在打包前校验 runtime checksum。
- `server/index.ts` 是 Hono HTTP + WebSocket server，注册 chat、sessions、models、agents、desk、skills、channels、filesystem、preferences、bridge、commands、resources、mobile workbench、media 等路由。
- `core/agent.ts` 描述 Agent 拥有身份、人格、记忆、工具和 prompt 拼装逻辑。
- `lib/tools/subagent-tool.ts` 支持带可选 `agent`、可选 `model` 和 read/write 权限档的 subagent 委派。

## 代码 Agent 部署顺序

按这个顺序执行：

```text
1. Clone 或打开 liliMozi/openhanako。
2. 确认 OS 和 CPU 架构。
3. 确认 Node 版本是 >=24.12.0 且 <25。
4. 运行 npm install。
5. 运行 npm run typecheck。
6. 时间允许时运行 npm test。
7. 用 npm run start:dev 启动正常开发桌面模式。
8. 如果使用 Vite live renderer 模式，在一个终端运行 npm run dev:renderer，另一个终端运行 npm run start:vite。
9. 如果桌面端启动失败，检查 scripts/launch.js、Electron logs、HANA_HOME、ELECTRON_RUN_AS_NODE。
10. 如果 server 失败，运行 npm run server 并检查 server/index.ts 启动错误。
11. 如果需要打包，选择 dist、dist:win 或 dist:linux。
12. 不要未经确认编辑用户数据目录。
13. 记录每条命令、每个改动文件、每个错误和每个修复。
```

## 给 Claude Code 或 Codex 的安全提示词

```text
你正在帮我为 GitLearnOS 部署 OpenHanako / HanaAgent。

不要把 Claude Code / Codex 当成日常 GitLearnOS 辅导器。你的任务只是不检查、安装、运行、调试或定制 OpenHanako。

先读 package.json、scripts/launch.js、scripts/dev-env.js、server/index.ts、core/agent.ts、lib/tools/subagent-tool.ts 和 lib/tools/channel-tool.ts。

确认我的 OS、CPU 架构、Node 版本、npm 版本和仓库路径。

使用仓库脚本，不要直接手写 Electron 命令：
- npm run start:dev
- 只有需要 live renderer 模式时，才用 npm run dev:renderer + npm run start:vite
- npm run server
- npm run typecheck
- npm test
- 只有用户要求打包时，才运行 npm run dist:win / dist / dist:linux

如果 Electron 启动失败，检查 ELECTRON_RUN_AS_NODE 是否干扰，并使用 scripts/launch.js。

不要删除 ~/.hanako、~/.hanako-dev 或用户数据，除非用户确认。

OpenHanako 跑起来后，帮我在 OpenHanako 内配置 GitLearnOS：Maintainer、Source & Model Extractor、Practice & Review Coach，以及需要时才创建 Critic。Maintainer 应该是状态层最终写入者。

汇报每条命令、改了哪些文件、遇到什么错误、怎么修复。
```

## 不要做什么

- 不要把它变成 Claude Code 或 Codex 学习工作流。
- 不要在这里维护 Claude / Codex 各自的一整套 GitLearnOS 日常学习文档。
- 不要把用户学习数据写进 OpenHanako 源码仓库。
- 除非用户明确要求定制或修 bug，不要 patch OpenHanako 源码。
- 不要编造 OpenHanako 文件路径或 Agent ID。先读真实源码或真实 roster。

## 部署完成后

OpenHanako 能跑起来后，从部署模式切换到 OpenHanako 运行模式：

```text
OpenHanako agent setup
→ create GitLearnOS Maintainer
→ create Source & Model Extractor
→ create Practice & Review Coach
→ optional Critic only when needed
→ choose one state layer
→ keep original materials in local folders or desk files
```

OpenHanako 内的 Agent 配置见 `zh-CN/docs/platform-agent-configuration.md`。
