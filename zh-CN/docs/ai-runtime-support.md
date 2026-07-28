# AI 运行环境支持

本页是补充说明。

当前主线运行路径请先读：

- [运行环境自适应](runtime-self-adaptation.md)
- [自动化运行环境矩阵](automation-runtime-matrix.md)
- [本地运行说明](../../docs/local-runtime-note.md)
- [Skill 与记忆运行层](skill-and-memory-runtime.md)
- [单一活跃运行层规则](single-active-runtime-rule.md)

## 核心想法

GitLearnOS 不绑定某一个 AI 产品，但必须有清楚的运行边界。

一个工具是否可用，取决于它能不能诚实说明：自己能读什么、能写什么、长期学习状态保存在哪里。

## 必要能力

一个合适的日常运行层应该具备：

1. 仓库或状态层访问能力；
2. 文件创建和修改能力，或者在不能编辑时给出精确手动补丁；
3. 项目规则或稳定记忆；
4. 权限边界；
5. 诚实的来源处理；
6. 改动汇报能力。

## 支持的运行角色

```text
ChatGPT
→ 原生日常学习运行层
→ 最适合搭配 GitHub connector / MCP / 仓库访问

Claude
→ 原生日常学习运行层
→ 适合 project context、artifacts 和仓库辅助工作

OpenHanako / HanaAgent
→ 可选桌面增强运行时
→ 本地文件、书桌、skills、定时任务、桥接频道、subagent

Claude Code / Codex / Cursor / CLI agents
→ OpenHanako 的部署和源码辅助工具
→ 不是本仓维护的日常辅导层
```

项目应该描述能力，而不是强制绑定品牌；同时也不能假装所有工具都有同样权限。

## 为什么记忆重要

AI 只应该记住稳定偏好：

```text
使用 GitLearnOS 时，一次只使用一个活跃学习运行层和一个选定的 Git 状态层。
仓库可以在本地，也可以使用任意标准 Git 托管服务。本地原始文件视为受保护
来源，只有需要时才请求最小摘录。每次改动都要汇报。
```

如果没有记忆或项目规则，用户每次都要重复同样的设置。

## 最小运行环境

```text
一个 AI 工具
+ 一个目标 Git 仓库或一个可访问的本地状态层
+ 一个规则文件
+ 诚实汇报
```

## 最佳原生运行环境

```text
一个主原生 AI 工具
+ Git 仓库连接器
+ 项目记忆或持久规则
+ 清楚的权限边界
+ 必要时上传本地文件摘录
```

## 本地优先路径

本地工作区可以测试或运行这套方法，但本地访问不等于 GitHub 访问。

只有当活跃运行层真的能访问本地文件，或者 AI 给出精确补丁让用户手动应用时，才使用本地 git 或 Obsidian。

边界说明见 [本地运行说明](../../docs/local-runtime-note.md)。
