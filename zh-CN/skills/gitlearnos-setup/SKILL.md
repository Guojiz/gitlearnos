---
name: gitlearnos-setup
description: 创建或迁移最小的学习者自有 GitLearnOS 状态，同时保留现有文件、配置自动化与隐私策略，并为一个主智能体准备第一次有用的整理、出题或学习行动。
---

# GitLearnOS 设置

遵循根目录英文 [`GITLEARNOS.md`](../../../GITLEARNOS.md)；它是唯一正式协议。GitHub 可以是公开模板的位置或目标远程之一；学习者仓库也可以是任意远程或本地 Git 工作副本。

[English source](../../../skills/gitlearnos-setup/SKILL.md)

## 边界

将 `Guojiz/GitLearnOS` 或获授权的副本视为模板，把学习者的 Git 仓库视为目标。绝不能把个人状态写入模板。

## 能力优先设置

1. 识别目标；
2. 测试真实的读取、写入、来源访问和调度能力；
3. 检查现有文件；
4. 只询问工具无法取得的信息；
5. 保留现有工作。

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
2. 从示例创建 `gitlearnos.yml`，复制适当的轻量 `templates/AGENTS.md` 入口，并以 `safe-auto` 建立 `learning-policy.md`，除非学习者要求预览或手动模式；
3. 创建最小画像和仪表盘，并给出一个下一步；
4. 整理第一个真实输入或缺口；
5. 只在有用或被要求时出题；
6. 只在学习者要求时运行 AI 会话；
7. 验证智能体能够识别状态、行动、写入、报告，并遵守撤销边界。

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
Changed files:
First organized path:
Questions prepared:
Still missing:
Next action:
```
