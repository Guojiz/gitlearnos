# 单一活跃运行层规则

GitLearnOS 强烈建议：同一时间只使用一个活跃学习运行层。

不要让 ChatGPT、Claude、OpenHanako、Codex、Obsidian agent 或其他工具同时成为学习状态的权威，除非已经做了明确接手。

多个平台同时运行会造成：

```text
原生记忆漂移
+ 私有 agent 上下文漂移
+ 重复生成题单
+ learner-profile 冲突更新
+ 仓库状态不一致
+ 事实源不清楚
```

## 推荐规则

```text
一个学习者
→ 一个活跃学习运行层
→ 一个学习状态层
→ 一条接手路径
```

## 合理设置

### 轻量设置

```text
ChatGPT 或 Claude
→ 日常学习运行层

Git 目标仓库
→ 学习状态事实源

本地文件
→ 受保护原始材料
```

### 桌面设置

```text
OpenHanako / HanaAgent
→ 日常桌面学习运行层

本地 git + Obsidian 或 Git 仓库
→ 学习状态层

本地文件 / desk files
→ 受保护原始材料
```

### 部署设置

```text
Claude Code / Codex / Cursor
→ 只用于部署或调试 OpenHanako

OpenHanako
→ 部署完成后成为活跃学习运行层
```

## 桌面端 GitHub 可选

在 OpenHanako 桌面设置里，GitHub 有用，但不是强制。

如果学习者主要在一台电脑上工作，想要本地优先、快速编辑、私人笔记、Markdown 导航和 git 历史，本地 git + Obsidian 可能已经足够。

这种情况下，把本地 git + Obsidian 视为学习状态层。

只有需要云同步、跨设备接手、公开模板分享或远程 AI 访问时，才优先使用 GitHub。

## 便携访问渠道

OpenHanako 的消息或社交平台接入可以增强便携性。

这些渠道只能作为输入和通知渠道，不是新的学习状态权威。

```text
便携渠道
→ 快速输入和通知

OpenHanako
→ 活跃 agent 运行层

本地 git / Obsidian / GitHub
→ 学习状态层
```

重要学习结果仍然必须写回选定的学习状态层。

## 功能预算规则

OpenHanako 功能很多，不要默认全开。

```text
通常有用：
- memory
- 本地文件或 desk access
- selected Skills
- 一个 Maintainer agent
- 一个 Source and Model Extractor
- 一个 Practice and Review Coach

需要时才开：
- scheduled tasks
- 便携渠道集成
- 额外 subagents
- Critic agent
- screenshots 或 vision

默认避免：
- 过宽文件权限
- 太多 agents
- 不受控定时重写
- 并行平台工作流
```

这能减少 token 浪费、上下文漂移和状态冲突。

## 接手规则

如果切换平台，必须做明确接手：

```text
1. 读取当前 dashboard 和 learner-profile。
2. 读取最近 models、knowledge gaps 和 reviews。
3. 写接手记录。
4. 停止旧运行层。
5. 新运行层从接手记录开始。
```

永远不要让两个运行层同时更新学习状态。
