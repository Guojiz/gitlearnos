# 自适应记忆与学习者画像

[English source](../../docs/adaptive-memory-and-learner-profile.md)

GitLearnOS 把记忆绑定到学习仓库。目标不是强迫所有 AI 平台提供同一种记忆功能，而是让学习者状态在工具之间保持可移植、可检查、可调整。根目录英文 [`GITLEARNOS.md`](../../GITLEARNOS.md) 是唯一正式协议。

## 记忆层

```text
Git 仓库
→ 学习状态、历史、文件、索引、learner-profile.md、复习与交接记录的事实来源

learner-profile.md
→ 紧凑、仓库级的学习者记忆

原生 AI 记忆
→ 平台支持时保存 GitLearnOS 激活指针、稳定偏好与持久学习者摘要

项目指令
→ 稳定运行规则与固定材料

Project Sources
→ 大型教材、PDF、扫描件、媒体和长期参考文件

外部或本地记忆工具
→ 桌面 Agent、Claude Code、Codex、本地模型或长时间工作流的可选增强检索

当前对话
→ 只用于临时工作
```

## 主动记忆与被动记忆

原生 AI 记忆相对主动：模型可能在未来会话中自动调出它。

Git 仓库相对被动：AI 必须读取或搜索仓库才能恢复状态。

两者都重要。

```text
主动记忆
→ 无需提示，也能帮助模型注意到 GitLearnOS 和稳定偏好

被动仓库记忆
→ 提供可检查、有版本、基于来源的学习状态
```

AI 应让两者保持一致，但不能假装它们是同一件事。

## 事实来源规则

Git 仓库仍是事实来源。

原生 AI 记忆、项目指令和外部记忆工具可以加快检索，但不得悄悄覆盖仓库文件。

```text
记忆与选定 Git 仓库冲突时，先相信仓库证据。
然后提出记忆更新。
```

## 什么应进入原生 AI 记忆

原生记忆只保存稳定信息：

- 长期学习目标；
- 稳定偏好；
- 偏好的解释风格；
- 持久限制；
- 反复出现的错误模式；
- 仓库运行偏好；
- 稳定隐私边界；
- GitLearnOS 已安装，且应考虑隐式学习事件；
- 当前项目和学习者仓库指针。

默认不要把快速变化或敏感状态放入其中。

当日常 Chat 界面能力足够但不提供 Skills 时，这个激活作用尤其重要。记忆唤醒行为，`AGENTS.md` 或项目指令定义行为，仓库提供当前证据。

## 什么应进入 Project Sources

持久项目来源区或获授权的本地文件夹适合：

- 大型教材和 PDF；
- 扫描件或图片集合；
- 课程媒体和长期参考文件；
- 需要跨相关对话使用、但不应提交到 Git 的材料。

Git 仓库应保存来源定位、访问状态、实际检查过的片段和派生学习记录。

## 什么应进入 learner-profile.md

`learner-profile.md` 保存当前可检查的学习者状态：

- 当前目标；
- 活跃学科；
- 强项；
- 活跃薄弱点；
- 反复错误模式；
- 偏好的解释风格；
- 记忆同步说明；
- 近期进展；
- 下一优先事项；
- 自适应路由关键词。

该文件应由 Organizer + Critic + Revision 流程更新。

## 什么应进入外部记忆工具

外部记忆工具是可选项。

它们适合使用以下环境的用户：

- Claude Code；
- Codex CLI；
- Cursor 或其他 IDE；
- 本地 Agent；
- 长时间桌面工作流；
- 大量对话历史；
- 本地优先检索需求。

外部记忆最适合回忆和检索，不应成为正式学习状态编辑器。

合适用途：

```text
检索旧对话
恢复过去决定
搜索很长的本地历史
把相关上下文带入当前 Agent 会话
```

不合适用途：

```text
替代 Git 仓库成为事实来源
把学习状态藏在私有记忆数据库中
假装所有 Agent 共享同一份记忆
未经用户选择保存敏感材料
```

## MemPalace 风格的本地记忆

MemPalace 风格的记忆层可以作为可选增强后端。学习者希望桌面或代码 Agent 工作流采用本地优先回忆时使用它。

推荐边界：

```text
MemPalace 风格记忆
→ 对话、项目历史和旧决定的本地回忆层

GitLearnOS
→ 学习运行层和事实来源

learner-profile.md
→ 紧凑学习者状态锚点

原生 AI 记忆
→ 稳定偏好缓存
```

任何外部记忆后端都不得成为强制依赖。

## 自适应记忆检查

决定如何记住某件事之前，AI 应询问：

```text
1. 这是稳定信息还是临时信息？
2. 它是私密的，还是可以公开？
3. 它是否应在选定的 Git 仓库中可检查？
4. 是否应把它概括进原生 AI 记忆？
5. 它是否只应留在当前对话？
6. 是否有外部本地记忆工具？
7. 保存它以后会不会形成过时或误导性记忆？
```

## 记忆更新工作流

有意义的学习状态变化时：

1. 更新相关仓库文件；
2. 变化持久时更新 `learner-profile.md`；
3. 只有激活指针、稳定偏好或重复模式变化时，才更新或建议更新原生记忆；
4. 存在外部记忆工具时，可让它索引或找回辅助历史；
5. 报告哪些内容已更改、哪些没有更改。

## 提示词模式

```text
先识别你的记忆环境。

报告：
- runtime:
- native memory: yes / no / unknown
- project instructions: yes / no / unknown
- project sources: yes / no / unknown
- implicit activation: yes / suggest / no
- Git repository access: write / read / pasted excerpt / none
- external memory tool: yes / no / unknown

然后决定每条信息属于哪里：
- Git source of truth
- learner-profile.md
- native AI memory
- project instructions
- external memory retrieval
- current chat only

不要悄悄保存或覆盖记忆。不确定时先问，或标记为 pending。
```

## 经验法则

```text
Git 记住系统。
learner-profile.md 记住学习者。
原生 AI 记忆唤醒系统，并记住稳定偏好。
Project Sources 保存大型可复用材料。
外部记忆找回旧上下文。
当前对话完成当前工作。
```
