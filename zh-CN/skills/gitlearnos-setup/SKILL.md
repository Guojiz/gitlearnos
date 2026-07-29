---
name: gitlearnos-setup
description: 创建或迁移最小的学习者自有 GitLearnOS 状态，同时保留现有文件，配置主动性、记忆、自动化与隐私策略，并让一个主智能体以后无需用户明确提到 GitLearnOS 或调用 Skill，也能识别学习事件。
---

# GitLearnOS 设置

遵循根目录英文 [`GITLEARNOS.md`](../../../GITLEARNOS.md)；它是唯一正式协议。GitHub 可以是公开模板的位置或目标远程之一；学习者仓库也可以是任意远程或本地 Git 工作副本。

[English source](../../../skills/gitlearnos-setup/SKILL.md)

## 边界

将 `Guojiz/GitLearnOS` 或获授权的副本视为模板，把学习者的 Git 仓库视为目标。绝不能把个人状态写入模板。

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
2. 当前界面支持项目指令或自定义指令时，把经过适配的
   `templates/project-instructions.md` 安装到那里；若该界面无法读取仓库，
   不能只给文件链接；
3. 原生记忆已启用且获允许时，适配 `templates/native-memory-pointer.md`，
   只保存激活指针、目标、主动协助偏好和稳定学习偏好，并验证运行环境实际保留了什么；
4. 支持时安装或暴露路由 Skill，但绝不能把显式调用 Skill 作为唯一触发方式。

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
3. 从示例创建 `gitlearnos.yml`，复制适当的轻量 `templates/AGENTS.md` 入口，并以 `safe-auto` 建立 `learning-policy.md`，除非学习者要求预览或手动模式；
4. 安装或提供经过适配的项目或自定义指令；获允许时配置原生记忆指针；并把每个
   层报告为已验证、建议设置、不可用或未知；
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
Project/custom instructions:
Memory: saved / suggested / unavailable / unknown
Changed files:
First organized path:
Questions prepared:
Still missing:
Next action:
```
