# GitLearnOS 设置

遵循 Router 已加载的核心契约。GitHub 可以是公开模板的位置或目标远程之一；
学习者仓库也可以是任意远程或本地 Git 工作副本。

[English source](../../../../skills/gitlearnos/references/setup.md)

## 边界

将 `Guojiz/GitLearnOS` 或获授权的副本视为模板，把学习者的 Git 仓库视为目标。绝不能把个人状态写入模板。

源模板 `templates/` 下的文件只是可选便利项。已安装 Skill 无法访问它们时，
根据本参考文件和 `core-contract.md` 生成等价的精简仓库或项目指令；不能因此
停止，也不能假装读取过不可用路径。

## 能力优先设置

1. 用日常语言解释推荐的三层安排；
2. 识别目标；
3. 测试真实的读取、写入、Git、来源、记忆、项目指令、Skill 和调度能力；
4. 检查现有文件；
5. 只引导学习者完成工具无法代办的选择或操作；
6. 保留现有工作。

```text
项目 Sources 或获授权的本地来源文件夹
→ 大型教材、PDF、扫描件、媒体和参考资料集合

学习者 Git 仓库
→ 紧凑的结构化状态、证据定位、问题、答案和历史

可用时的原生记忆
→ 激活指针与稳定偏好
```

在当前平台是 ChatGPT 时，大型学习文件优先放在持久 Project 的 **Sources** 区域。该 Project 内的 Chat 和 Work 对话便可使用共享项目上下文。其他 Agent 使用等价的项目文件区或获授权的本地来源文件夹。不要仅因为已有 Git 仓库，就把大型原件塞进 Git。

## 持久触发

把行为安装到当前运行环境真正支持的最小持久层：

1. 始终把学习者 `AGENTS.md` 放入目标仓库；
2. 使用 Claude Code 时，还要在目标仓库放入精简学习者版 `CLAUDE.md`，
   让 Claude 加载 `AGENTS.md`；
3. 当前界面支持项目指令或自定义指令时，模板可访问就安装经过适配的
   `templates/project-instructions.md`；否则根据 `core-contract.md` 生成等价
   精简路由。界面无法读取文件时，不能只给文件链接；
4. 原生记忆已启用且获允许时，模板可访问就使用
   `templates/native-memory-pointer.md`；否则建立等价指针，只保存激活状态、
   目标、主动协助偏好和稳定学习偏好，并验证运行环境实际保留了什么；
5. 支持时安装或暴露路由 Skill，但绝不能把显式调用 Skill 作为唯一触发方式。

### 安装一个自包含 Skill 文件夹

源文件夹是包含 `SKILL.md`、`references/` 和可选界面元数据的完整
`skills/gitlearnos/`。复制整个文件夹，不能只复制 `SKILL.md`，并且只安装到
一个主 Agent 的原生项目位置：

| 主 Agent | 项目安装位置 |
|---|---|
| Codex | `.agents/skills/gitlearnos/` |
| Claude Code | `.claude/skills/gitlearnos/` |
| OpenCode | `.agents/skills/gitlearnos/` |
| ChatGPT Desktop Skills | 通过当前可用的 Skills 界面或个人 Skill 流程安装整个文件夹 |
| 其他 Agent | 使用其正式记录的 Agent Skills 位置；没有就报告 Skills 不可用 |

OpenCode 也会发现 `.claude/skills/` 和 `.opencode/skills/`，但默认使用
`.agents/skills/`，让一份副本符合开放 Agent Skills 目录。不要为了理论兼容
同时制造 `.agents` 与 `.claude` 两份副本。GitLearnOS 使用一个主 Agent；
为主 Agent 安装原生副本，其他不支持 Skill 的界面由项目指令接续。学习者确实
让 Codex 与 Claude Code 同时操作同一个仓库时，只有说明 OpenCode 可能看到
同名重复项后才能安装两份，并在每次更新后分别验证。

文件存在不代表安装成功。必须验证：

1. 运行环境的 Skill 列表出现 `gitlearnos` 及其当前 description；
2. 学科问题或笔记照片等间接提示无需点名 GitLearnOS 也能触发选择；
3. 选中的 Skill 能打开 `references/core-contract.md` 和一个操作参考文件；
4. 将结果报告为 `installed`、`source-only`、`unavailable` 或 `unknown`。

向学习者说明设置结果，尤其要说明以后哪些界面能自动注意到问题、作答、拍摄材料、笔记、反馈和结果。若记忆、Skills、Git 或远程同步不可用，应实话说明，并用剩余持久层保留行为。
仅起草但没有验证的记忆条目必须报告为 `suggested` 或 `unknown`，不能说已经保存。

项目指令或自定义指令必须带有最小操作路由：整理、出题、复测、辅导、来源、
模型和维护。这是核心行为的有意精简重复，使没有 Skill 的界面仍能行动。详细
步骤留在 Skills 中，变化中的学习者状态留在 Git 中。

一次只引导一个不可避免的步骤。不要倾倒长篇平台检查清单，也不要让学习者创建智能体本可创建的文件。推荐一个默认选择，简要解释取舍，完成安全工作，验证后再继续。

在 ChatGPT 中要按界面验证能力。本地 Project 可能提供文件和 Git，而普通 Chat 界面可能隐藏 Git 技术细节或不暴露 Skills。只要目标仓库和持久指令可用，Chat 仍适合作为日常入口；较大的多步骤整理或维护更适合 Work。不要承诺固定的额度处理方式；不同套餐和工作区可能不同。

## 最小状态

只创建第一个目标或输入所需的内容：

```text
AGENTS.md
gitlearnos.yml
learning-policy.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

随后只在必要的学科文件夹下创建真实状态：

```text
subjects/<subject>/inbox/
subjects/<subject>/sources/
subjects/<subject>/models/
subjects/<subject>/knowledge-gaps/
subjects/<subject>/handoffs/
subjects/<subject>/reviews/
subjects/<subject>/events/
archive/
```

不要添加空脚手架。

## 设置顺序

1. 捕获第一个目标或输入，并推断或确认其学科；
2. 建立持久的项目或来源区域；可用且获授权时，把大型学习文件放入或链接到那里；
3. 从示例创建 `gitlearnos.yml`；模板可访问时复制轻量
   `templates/AGENTS.md`，否则根据 `core-contract.md` 生成等价入口；并以
   `safe-auto` 建立 `learning-policy.md`，除非学习者要求预览或手动模式；
4. 把单一 Skill 文件夹安装到主 Agent 的原生位置，安装对应的仓库入口文件，
   提供经过适配的项目或自定义指令；获允许时配置原生记忆指针；并为每个层
   报告已验证状态；
5. 创建最小画像和仪表盘，并给出一个下一步；
6. 整理第一个真实输入或缺口；
7. 只在有用时出题；
8. 只在学习者要求时运行 AI 会话；
9. 用一个隐式触发进行验证：无需说出 Skill 名，智能体也能识别状态、行动、写入、报告，并遵守撤销边界。

## 迁移

- 移动前先盘点；
- 把现有笔记映射到 `subjects/<subject>/` 下的目标、来源、模型、缺口、事件或归档；
- 当旧 `sessions/` 文件是有用学习记录而非完整聊天日志时，将其视为 `events/`；
- 保留支撑学习者习惯或链接的路径；
- 广泛移动或覆盖前先询问；
- 先迁移一条活跃学习路径；
- 新状态立即按新规则归位；若链接安全很重要，则逐步迁移旧的单学科路径。

## 输出

```text
Target:
Subject path:
Capabilities:
Policy:
Project or source workspace:
Activation surfaces:
Skill installation: installed / source-only / unavailable / unknown
Project/custom instructions:
Memory: saved / suggested / unavailable / unknown
Changed files:
First organized path:
Questions prepared:
Still missing:
Next action:
```
