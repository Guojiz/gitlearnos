# 原生 AI 平台部署指南

本指南覆盖 ChatGPT 和 Claude 这两个 GitLearnOS 原生日常学习平台。

这里不覆盖 Claude Code。Claude Code 是代码 Agent，属于 OpenHanako 部署 / 调试路径。

## 核心规则

一次只使用一个活跃学习平台。

```text
一个学习者
→ 一个活跃原生 AI 平台
→ 一个学习状态层
→ 一条接手路径
```

不要让 ChatGPT 和 Claude 同时更新同一份 learner-profile、knowledge-gaps、reviews 或 dashboard。

## 原生平台的状态层规则

对 ChatGPT 和 Claude 来说，默认状态层应该是 Git 目标仓库。

```text
原生平台最佳默认
→ Git 目标仓库

可以存在但不是自动可写
→ 本地 git 仓库
→ 本地 git + Obsidian vault
```

只有当运行环境真的能读取和写入本地文件，或者 AI 给出精确文件内容 / 补丁让用户手动应用时，本地路径才可以作为状态层。

不要写出“ChatGPT 或 Claude 可以直接编辑本地 Obsidian vault”的暗示，除非当前运行时确实有本地文件访问权限。

## 共同 GitLearnOS 闭环

ChatGPT 和 Claude 都应该运行同一套闭环：

```text
来源
→ 模型
→ 知识缺口
→ 个性化题目
→ 复习结果
→ learner-profile.md
→ 下次复习
```

平台可以记住稳定偏好，但长期学习状态必须保存在可检查的状态层。

## ChatGPT 部署

ChatGPT 适合想要手机 / 网页日常学习流程，以及较强持续个性化的学习者。

### 设置指令

```text
你正在帮我在 ChatGPT 中运行 GitLearnOS。

使用我选定的状态层作为事实源。优先使用 Git 目标仓库。ChatGPT 记忆是主动偏好缓存，不是正式学习仓库。

行动前先判断你的运行环境、记忆能力、文件访问、仓库访问和权限边界。

遵守这个闭环：
来源 → 模型 → 知识缺口 → 个性化题目 → 复习结果 → learner-profile.md → 下次复习。

不要编造缺失来源。除非你能说出具体改了哪些文件，否则不要声称已经编辑文件或仓库。

如果你不能写入状态层，就给出我可以手动应用的精确文件内容或补丁。
```

### 记忆规则

只保存稳定偏好：

```text
用户使用 GitLearnOS 做 AI 辅助学习。
选定状态层是事实源。
learner-profile.md 保存可检查学习画像。
练习应该来自近期模型和活跃知识缺口。
当记忆和状态层冲突时，优先相信状态层，并建议更新记忆。
```

不要把临时任务、原始私人笔记、过期知识缺口或一次性练习结果保存成长期记忆。

### 自动化边界

如果 ChatGPT scheduled prompts 没有实时仓库工具，它们只能作为接手提示。

```text
这是 GitLearnOS 接手提示。如果你没有实时仓库访问权限，不要声称已经完成仓库工作。告诉我下一步应该检查什么，以及应该在哪个有工具权限的对话里运行什么提示词。
```

## Claude 部署

Claude 适合项目式组织、长上下文阅读、写作、Artifacts 和细致草稿。

### 设置指令

```text
你正在帮我在 Claude 中运行 GitLearnOS。

使用我选定的状态层作为事实源。除非我明确选择本地优先工作流且你确实有本地文件访问权限，否则优先使用 Git 目标仓库。Claude project context、artifacts 和 memory 都是工作表面，不是正式学习状态。

行动前先判断你的运行环境、memory/project 能力、文件访问、仓库访问和权限边界。

遵守这个闭环：
来源 → 模型 → 知识缺口 → 个性化题目 → 复习结果 → learner-profile.md → 下次复习。

不要编造缺失来源。除非你能说出具体改了哪些文件，否则不要声称已经编辑文件或仓库。

Artifacts 可以用于草稿、可视化解释、表格、小应用或临时教学材料。重要学习状态必须写回或建议写回 learner-profile.md、sources/、models/、knowledge-gaps/、reviews/ 或 dashboard.md。

如果你不能写入状态层，就给出我可以手动应用的精确文件内容或补丁。
```

### Artifact 规则

Artifacts 适合草稿、可视化解释、对比卡片、小练习和写作修改。

Artifacts 不能成为唯一保存学习状态的地方。如果 artifact 产生了长期学习信息，必须写回或建议写回状态层。

## ChatGPT 与 Claude 切换

切换前必须刻意接手：

```text
1. 读取 dashboard.md 和 learner-profile.md。
2. 读取近期 models、knowledge gaps 和 reviews。
3. 写 agents/handoff-notes/latest.md。
4. 停止旧平台。
5. 新平台从 handoff note 开始。
```

不要让两个平台同时更新同一份学习状态。

## 与 OpenHanako 的关系

OpenHanako 不是 ChatGPT 或 Claude 这类原生网页 / 移动 AI 平台的替代品。

它是可选的桌面增强路径，适合本地文件、书桌、Skills、定时任务、桥接频道、浏览器 / 桌面操作和有限多 Agent 工作流。

Claude Code、Codex、Cursor 或其他代码 Agent 只用于部署或调试 OpenHanako；桌面学习工作流应回到 OpenHanako 内部运行。
