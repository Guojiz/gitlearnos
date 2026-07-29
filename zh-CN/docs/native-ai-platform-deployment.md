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

### 选择 Chat 还是 Work

当前项目或会话具备已验证仓库权限时，用 **Chat** 处理日常学习：

- 提出或回答一个学科问题；
- 分享一页材料、截图或简短笔记；
- 记录教师反馈或练习结果；
- 获得一个下一步建议和小型安全写回。

这条路径不能依赖 Skills。项目指令、仓库 `AGENTS.md`、原生记忆和学习事件本身都应能触发 GitLearnOS。在 Chat 不消耗有限 Work 任务额度的账号中，这还能把 Work 留给较大的任务；必须验证当前套餐行为，不能把它承诺为普遍规则。

用 **Work** 处理引导式设置、大型来源导入、多文件整理、维护、较大复习或计划工作流。学习者或维护者需要可见 Git 操作、迁移、测试或技术审查时使用 **Codex**。

OpenAI 当前文档说明本地 Project 可以进行 Git 操作，相关对话可以共享项目上下文。具体 Chat 或 Work 会话仍必须验证真实文件与仓库权限。

### 项目来源规则

为学习者创建或选择一个持久 ChatGPT Project。获授权时，把大型教材、PDF、扫描件集合、媒体和长期参考文件放入 **Sources** 区域。该 Project 中的 Chat 与 Work 对话都可以使用共享来源和指令。紧凑状态、定位、选定片段和学习历史保存在 Git 仓库中。

### 设置指令

适配并把完整的
[`templates/project-instructions.md`](../../templates/project-instructions.md)
内容粘贴到 ChatGPT Project 指令。不能只粘贴文件链接：日常 Chat 在需要回退时
可能没有仓库或 Skill 访问。填写真实目标、政策、大型来源位置，以及稳定的
学习者限制。

### 记忆规则

适配
[`templates/native-memory-pointer.md`](../../templates/native-memory-pointer.md)，
取得学习者允许后请求更新，并验证实际保留的激活指针和目标。报告
`saved`、`suggested`、`unavailable` 或 `unknown`。

不要把临时任务、原始私人笔记、过期知识缺口或一次性练习结果保存成长期记忆。

记忆只是唤醒指针，不是完整系统。强制行为仍放在项目指令或 `AGENTS.md` 中；变化的证据仍在 Git 中。记忆已禁用时，要告诉学习者：除非从已配置项目或仓库开始，未来独立对话可能不会识别 GitLearnOS。

官方参考：

- [Projects and chats](https://learn.chatgpt.com/docs/projects)
- [Memories](https://learn.chatgpt.com/docs/customization/memories)
- [Use ChatGPT](https://learn.chatgpt.com/docs/use-chatgpt)
- [Skills and plugins](https://learn.chatgpt.com/docs/skills-and-plugins)

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

同一条可移植规则适用于其他原生 Agent：强制行为放入持久项目或仓库指令；原生记忆只作激活与偏好缓存；大型来源放入项目文件区或获授权的本地文件夹；可检查学习状态保存在 Git 中。

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
