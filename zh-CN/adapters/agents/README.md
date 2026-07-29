# Agent 适配

[English](../../../adapters/agents/README.md)

用户只需要一个拥有仓库工具的主 Agent。各产品专用入口只负责让 Agent 发现同一份协议。

## 最低完整能力

```text
读取仓库
→ 检查当前版本
→ 保留无关改动
→ 写入文件
→ 把一次学习事件提交为一次改动
```

`push`、后台调度、本地文件访问、项目 Sources、Skills 和 AI 原生记忆都是可选能力，必须按真实情况报告。

## 常见环境

- **仓库 Agent 或 Codex：**在本地工作区操作，遵守 `AGENTS.md`，通过标准 Git 提交。
- **具备已验证仓库工具的 ChatGPT Chat：**用于日常问题、答案、笔记、图片与反馈。不能依赖 Skills；项目指令、`AGENTS.md`、记忆和事件本身必须能触发工作流。
- **使用本地项目或仓库连接器的 ChatGPT Work：**用于设置、大型导入、多文件整理和维护。以标准 Git 或连接器写入作为提交边界，并报告所有改动路径。
- **其他具备工具的 Agent：**读取 `GITLEARNOS.md`，把现有工具映射到最低能力要求；无法执行的部分返回为待写回内容。

## 不同 Agent 如何发现 Skill

仓库中的 [`skills/gitlearnos/`](../../../skills/gitlearnos/) 是正式可分发源。
它仅仅存在于模板中，并不代表已经自动安装。

| Agent | 持久项目指令 | 原生项目 Skill 路径 | GitLearnOS 默认做法 |
|---|---|---|---|
| Codex | `AGENTS.md` | `.agents/skills/gitlearnos/` | 把完整 Skill 文件夹复制到这里 |
| Claude Code | `CLAUDE.md` → `AGENTS.md` | `.claude/skills/gitlearnos/` | 添加精简 `CLAUDE.md` 入口并复制完整 Skill 文件夹 |
| OpenCode | `AGENTS.md` | `.agents/skills/gitlearnos/`、`.claude/skills/gitlearnos/` 或 `.opencode/skills/gitlearnos/` | 优先使用 `.agents/skills/gitlearnos/` |
| 不提供仓库 Skills 的 ChatGPT 界面 | 项目／自定义指令 | 取决于账号或界面 | 安装项目指令与记忆指针，并报告 Skill 不可用 |

该映射来自当前产品文档：

- [Codex Build skills](https://learn.chatgpt.com/docs/build-skills.md) 记录仓库
  Skill 从 `.agents/skills/` 发现；
- [Claude Code Skills](https://code.claude.com/docs/en/skills) 记录项目 Skill
  位于 `.claude/skills/`，能够按相关性自动调用，也可直接用 `/skill-name`；
- [OpenCode Agent Skills](https://opencode.ai/docs/skills) 记录原生
  `.opencode/skills/`，并兼容 `.agents/skills/` 与 `.claude/skills/`；
- [OpenCode Rules](https://opencode.ai/docs/rules/) 直接加载项目
  `AGENTS.md`，只有缺少它时才回退到 `CLAUDE.md`。
- [Claude Code memory](https://code.claude.com/docs/en/memory) 记录精简 Claude
  入口所用的 `@AGENTS.md` 导入。

### 实际运行差异

- **Claude Code** 在项目存在 `CLAUDE.md` 时将其作为项目指令入口。GitLearnOS
  使用 Claude Code 正式记录的 `@AGENTS.md` 导入，不重复抄写规则。项目 Skill
  从 `.claude/skills/` 列出；Claude 可以根据 description 自动选择，也允许
  学习者使用 `/gitlearnos`。Skill 正文和打包参考文件只在使用时加载。
- **OpenCode** 把发现的 Skill 名称和 description 放入原生 `skill` 工具。
  Agent 调用该工具来选择 Skill；OpenCode 权限可以允许、询问、拒绝或隐藏它。
  `AGENTS.md` 优先于 `CLAUDE.md`，同时会扫描三种正式记录的项目 Skill 目录。
- **Codex** 使用 `AGENTS.md` 保存仓库指令，并从开放的 `.agents/skills/`
  位置发现项目 Skills。因此同一文件夹是 Codex 与 OpenCode 最干净的共同默认。

GitLearnOS 的核心行为不需要 MCP 服务或插件。学习者需要外部服务时，MCP 仍可
作为可选适配器；可移植行为由 Skill 文件夹和持久项目指令共同提供。

GitLearnOS 有意只使用一个可安装 Skill，再按需读取参考文件。不要把每个操作
参考文件重新安装为独立 Skill，否则初始元数据会膨胀，多个 description 也会
竞争同一个学习事件。

### 验证

复制完整文件夹后，必须验证，不能推测：

1. 检查当前运行环境的 Skill 清单并找到 `gitlearnos`；
2. 确认显示的 description 与
   [`SKILL.md`](../../../skills/gitlearnos/SKILL.md) 一致；
3. 使用一条没有点名 GitLearnOS 的间接学习输入；
4. 确认被选择的 Skill 能加载 `references/core-contract.md` 和匹配的操作
   参考文件；
5. 报告 `installed`、`source-only`、`unavailable` 或 `unknown`。

GitHub 上可见的文件，或模板根目录 `skills/` 下的文件，都只能算
`source-only`。只有原生发现确实可观察时才能报告 `installed`。

AI 原生记忆可在可用时缓存激活指针、目标和稳定偏好，但 Git 仓库仍是长期、可检查的来源。发生冲突时根据证据协调，并遵守用户纠正。

## 可移植触发顺序

使用运行环境支持的所有层，但按以下顺序依赖：

```text
仓库 AGENTS.md 或持久项目指令
→ 原生记忆激活指针
→ 可选路由 Skill
→ 学习者当前输入
```

第一层保存强制行为。记忆帮助新对话注意到系统。Skills 细化工作流，但不是必需项。平台既没有自动指令也没有记忆时，应向学习者说明：必须从已配置项目或仓库开始，或提供一条简短激活提示。

大型教材、PDF、扫描件和媒体放在平台的持久项目来源区或获授权的本地来源文件夹。Git 保存紧凑状态、来源定位、选定证据和历史。
