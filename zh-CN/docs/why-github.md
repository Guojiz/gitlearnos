# 为什么核心是 Git，GitHub 又有什么用

这个路径为了兼容旧链接而保留。GitLearnOS v2 要求的是 Git 行为，不是 GitHub。

## 为什么 Git 是核心

Git 为学习状态提供稳定文件、改动历史、可撤销更新和冲突检查所需的明确版本。
因此不依赖数据库或专有运行环境，也能检查证据与 AI 写回。

## GitHub 增加什么

GitHub 可以增加浏览器访问、远程备份、协作、Pull Request、Issues、Actions
和方便的 AI 连接器。这些是有用的适配能力，不是学习语义。

## 有用的部署形态

### 私有学习者备份

```text
Chat 或 Agent
→ 本地学习者仓库
→ 私有 GitHub 远程仓库
```

用于异地备份、跨设备连续性或恢复。只有策略允许且已验证远程目标时，才能自动推送。

### 学习者与教师

```text
私有学习者仓库
↔ 受邀教师或导师
→ 评论、审阅或提交反馈
```

Agent 可以准备聚焦问题包，保留学习者尝试，并协调返回的反馈。教师无需理解整个 GitLearnOS 结构。只分享相关材料，不再需要时移除访问权限。

### 共享教学材料

```text
共享课程仓库
→ 课程、作业、评分标准、可公开示例

彼此分开的私有学习者仓库
→ 个人答案、缺口、反馈与复习历史
```

不要把全班共享资料与每位学习者的私密状态放在同一个仓库。学习者仓库链接共享来源，不要把私密记录复制回课程仓库。

### 小组学习或项目协作

共享仓库可以保存共同目标、来源、作品、决定和团队反馈。除非所有人明确选择共享记录，否则个人掌握证据仍归各学习者所有。

### 公开示例

为可复用方法和脱敏示例使用独立公开仓库或公开安全文件夹。绝不能只为方便分享就公开私密学习者仓库。

## ChatGPT 特别说明

OpenAI 当前文档说明本地 Project 可以进行 Git 操作，也指出 ChatGPT 日常界面可能隐藏 Git 命令等技术细节。能力仍随界面和授权变化。具备已验证仓库权限的 Chat 对话可以在不调用 Skill 的情况下运行日常学习闭环；设置、多文件维护和可见技术审查可能更适合 Work 或 Codex。

Skills 和额度处理也会随套餐、工作区和界面变化。Chat 不提供 Skills 时，使用项目指令、自动发现的 `AGENTS.md` 和原生记忆。若当前套餐中 Chat 能保留有限 Work 额度，则优先用于简短日常交互，但不要把该账号行为说成通用产品保证。

官方参考：

- [Projects and chats](https://learn.chatgpt.com/docs/projects)
- [Use ChatGPT](https://learn.chatgpt.com/docs/use-chatgpt)
- [Memories](https://learn.chatgpt.com/docs/customization/memories)
- [Skills and plugins](https://learn.chatgpt.com/docs/skills-and-plugins)

## 隐私与控制

添加远程仓库或协作者之前：

1. 默认保持仓库私有；
2. 把大型或私密原件分离到 Project Sources 或本地存储；
3. 只授予最低必要仓库权限；
4. 确认将要推送的内容；
5. 记录推送、邀请或可见性变更是否真正成功。

同一核心闭环也能在本地 Git、GitLab、Gitea 或其他标准 Git 托管服务中运行。
只验证了本地提交时，不能声称已完成远程 push 或 GitHub 动作。

见 [Git 适配器](../adapters/git/README.md)。
