# 快速开始

[English](../QUICKSTART.md)

## 你需要

- 一个能够读写 Git 仓库的 AI Agent；
- 一个本地或远程目标仓库；
- 可用时，一个用于大型学习文件的持久项目或来源区域；
- 一个学科、目标或当前学习事件。

部署学习者系统前，Agent 必须完整阅读协议，默认用户就是学习者，一次询问学习目标、
学科、当前资料和可选的本地 RAG 选择，并建议 RAG-Anything 但保持可选。当前请求或
已验证的 `gitlearnos.yml` 已提供的事实视为已回答，不得重复询问。学习者回答前，不得安装、初始化、导入、
提交或部署。
此门槛不适用于维护、编写文档、测试或发布公开模板。

运行环境支持时，Agent 可以自行初始化本地 Git 仓库。不要求 GitHub 账号。

OpenAI 文档说明本地 Project 可以进行 Git 操作，但 ChatGPT 的能力仍会随界面和授权变化。请测试当前 Chat、Work 或 Codex 会话。Chat 具备仓库权限时用于小型日常学习事件；Work 用于引导式设置、大型导入和多文件维护。Skills 有帮助，但不是必需项。

部分账号分别计算 Chat 与有限的 Work 任务额度。以当前账号界面为准；GitLearnOS 不承诺通用的额度处理方式。

把大型教材、PDF、扫描件集合、媒体和长期参考文件放入 ChatGPT Project **Sources**，或其他持久项目或本地来源文件夹。Git 保存紧凑学习状态和来源定位。只有用户主动需要同步、协作、备份或公开发布时才需要远程仓库。

启用后，RAG-Anything 索引获授权的基础资料、笔记和晋升后的长期知识；Git
仍是正式事实来源。不能把一次性练习送入 RAG，不能重复主 Agent 已完成的 OCR，
不能增加 RAG Agent，也不能每次回答都查询 RAG。

## 一次配置持久行为

设置 Agent 应配置当前可用的每一层，不能把 Skill 本身当成全部安装：

1. 把 [`templates/AGENTS.md`](../templates/AGENTS.md) 放入学习者仓库；
2. 主 Agent 是 Claude Code 时，还要适配
   [`templates/CLAUDE.md`](../templates/CLAUDE.md)；
3. 把完整 [`skills/gitlearnos/`](../skills/gitlearnos/) 文件夹安装到主 Agent
   正式记录的原生项目位置，并验证运行环境确实列出 `gitlearnos`；
4. 适配
   [`templates/project-instructions.md`](../templates/project-instructions.md)，
   并安装到 AI Project 指令或等价的自定义指令字段；
5. 取得允许后，适配
   [`templates/native-memory-pointer.md`](../templates/native-memory-pointer.md)，
   请求更新记忆，并验证实际保留的内容。

默认原生路径：

| 主 Agent | 项目路径 |
|---|---|
| Codex | `.agents/skills/gitlearnos/` |
| Claude Code | `.claude/skills/gitlearnos/` |
| OpenCode | `.agents/skills/gitlearnos/` |

只为选定主 Agent 使用一份原生副本。见
[跨 Agent 安装表](adapters/agents/README.md#不同-agent-如何发现-skill)。

项目或自定义指令包含最小的整理、出题、复测、辅导、来源、模型和维护路由，
因此不提供 Skills 的日常界面仍能工作。记忆只负责唤醒行为并指向目标；Git
仍是事实来源。

## 发送一段话

```text
请把 https://github.com/Guojiz/GitLearnOS 作为 GitLearnOS 模板。
我的学习 Git 仓库或本地工作区是：<目标>

完整阅读 zh-CN/GITLEARNOS.md 和 zh-CN/START-HERE.md。修改任何内容前，询问
设置门槛：我的学习目标、学科、当前资料，以及是否启用可选本地 RAG 知识层（RAG-Anything
是首个支持选项）。本请求或目标 `gitlearnos.yml` 已有的事实视为已回答，不要重复询问。
安装、初始化、导入、提交或部署学习者状态前必须等我回答。
然后在环境支持 Skills 时使用
完整 skills/gitlearnos/ 文件夹。检查主 Agent，把该文件夹安装到其正式记录的
原生项目位置，并验证 Skill 清单确实出现 gitlearnos；复制源文件本身不能证明
安装成功。不要依赖显式 Skill 调用。一次只引导我完成一个必要设置步骤。大型
学习文件使用项目 Sources 或获授权的本地文件夹。配置持久项目或仓库指令，并在
可用时配置原生记忆，使未来的问题、作答尝试、拍摄页面、笔记、反馈和结果即使
没有提到 GitLearnOS，也会被识别为候选学习事件。检查真实的仓库、Git、记忆、
来源和调度能力。设置时，确认或接受我的 IANA 时区，以及 `maintenance`
（默认每天 21:30）和 `due-review`（默认每天 07:00）的重复本地时间。
在真正拥有仓库能力的调度器中创建两项任务并各试运行一次；任一无法验证
时，记录请求并把部署自动化标记为未完成。使用 safe-auto：先处理我的眼前需要，再整理有价值的证据，在
服务目标时建议或生成针对性问题，并提交安全、可撤销的写回。保留原始作答、
笔记和外部反馈；不要保存完整聊天，也不能在没有间隔后独立作答证据时声称已经
掌握。最后报告触发层、已验证 Skill 状态、改动文件、实际完成的自动化、下一步
和撤销边界。
```

Agent 能完成时，不要手工建立 GitLearnOS 文件夹。

## 第一次最小结果

```text
AGENTS.md
gitlearnos.yml
automation.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

只创建当前学科和真实需要的文件。来源、模型、薄弱点、问题包、复测和事件在第一次使用时出现。

主 Agent 还可以添加一份原生 Skill 文件夹。Claude Code 另外添加精简
`CLAUDE.md` 入口。这些是运行文件，不是学习者状态。

设置 Agent 还应报告：

```text
设置状态：core-ready / knowledge-ready / automation-ready / full-ready / incomplete
Daily surface: Chat / Work / other
Project or source workspace:
Repository:
Automatic instructions:
Project/custom instructions:
Memory: saved / suggested / unavailable / unknown
Skills: installed / source-only / unavailable / unknown
Remote backup or collaboration:
Time zone:
Maintenance: requested / configured / verified / unavailable / disabled
Due review: requested / configured / verified / unavailable / disabled
Deployment automation: verified / incomplete
```

`core-ready` 表示目标、配置、指令和基本仓库能力已验证；`knowledge-ready` 还要求
目标、学科、材料边界、来源工作区和明确的 RAG 选择（`enabled` 或 `declined`）已回答；
`undecided` 不算就绪。`automation-ready` 表示两项
重复任务均已观察并真实测试；`full-ready` 需三者都满足。状态必须由证据计算，不能手写成承诺。

## 日常使用

```text
整理这些课堂笔记，并针对我仍然不会的部分给我两道新题。
```

```text
把这个还没解决的几何问题整理成我明天可以问补习老师的问题包。
```

```text
老师已经讲明白了。保存反馈，取消过时的重复讲解任务，之后用一道新题检查我。
```

```text
这次只记录，不出题，也不安排复习。
```

```text
撤销上一次学习更新。
```

学习者只说明事件和意图，不需要说明仓库路径。

设置完成后，学习者无需再说“使用 GitLearnOS”。一个普通问题、作答尝试或上传页面就足够：

```text
为什么这份解答的第三步成立？
```

```text
这是今天的课堂笔记照片。我误解了什么？
```

Agent 先回答，再安静地判断是否值得做一个小型持久更新。它不会保存每段随意聊天。

## 成功检查

满足以下条件才算安装成功：

- Agent 能找到当前目标、证据、到期任务和一个下一步；
- 能解释为什么新题针对当前薄弱点；
- 在修改 AI 解释时保留原始证据；
- 不要求学习者管理 Git，就能完成安全写入与提交；
- 配置的记忆或项目指令可用时，在之后的对话中无需 Skill 名也能识别有价值的学习事件；
- 大型来源保存在项目或来源区域，紧凑状态保存在 Git；
- 清楚说明实际运行了哪些自动化和仓库操作；
- 展示并测试两个必需重复任务，否则明确标记部署自动化未完成；
- 没有 GitHub 时仍可在本地 Git 完成同一闭环。

没有写入权限时，Agent 应返回精确的待写回内容，并明确说明仓库没有改变。
