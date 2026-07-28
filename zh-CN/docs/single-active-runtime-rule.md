# 单一活跃运行层规则

GitLearnOS 强烈建议一次只使用一个活跃学习运行层。

不要让 ChatGPT、Claude、OpenHanako、Codex、Claude Code、Obsidian agent 或其他工具同时作为学习状态权威，除非已经做了明确接手。

多个平台同时运行会造成漂移：

```text
原生记忆漂移
+ 私有上下文漂移
+ 重复出题
+ learner-profile 冲突
+ reviews / dashboard 不一致
+ 不清楚哪个状态才是事实源
```

## 推荐规则

```text
一个学习者
→ 一个活跃学习运行层
→ 一个学习状态层
→ 一条接手路径
```

## 推荐形态

### 轻量形态

```text
ChatGPT
→ 日常学习运行层

Git 目标仓库
→ 学习状态事实源

本地文件
→ 受保护原始材料
```

### Claude 原生形态

```text
Claude
→ 日常学习运行层

Git 目标仓库
→ 学习状态事实源

Claude Project / Artifacts
→ 工作表面，不是长期事实源
```

### 桌面形态

```text
OpenHanako / HanaAgent
→ 桌面学习运行层

本地 git + Obsidian 或 Git 仓库
→ 学习状态层

本地文件 / desk files
→ 受保护原始材料
```

### 部署形态

```text
Claude Code / Codex / Cursor
→ 只部署或调试 OpenHanako

OpenHanako
→ 部署完成后成为桌面学习运行层
```

## 本地与远程 Git 状态层

所有 Runtime 都以学习者选定的 Git 仓库作为状态层。有连接器时 GitHub 可能
更方便，但不是协议默认项。

本地 git / Obsidian 只有在运行层真的有本地文件访问权限，或者用户手动应用 AI 给出的补丁时，才适合作为状态层。

对 OpenHanako，用户授权后，本地 git / Obsidian 可以作为真正状态层。

## OpenHanako 功能预算

OpenHanako 功能很多，不要默认全开。

```text
通常有用：
- memory
- local file 或 desk access
- selected Skills
- GitLearnOS Maintainer
- Source & Model Extractor
- Practice & Review Coach

需要时才开启：
- scheduled tasks
- portable channel integrations
- extra subagents
- Critic agent
- screenshots or vision

默认避免：
- broad file access
- 太多 Agent
- 不受控定时重写
- 平台并行工作流
```

Maintainer 应该是状态层最终写入者，其他 Agent 只负责准备或审查，避免多 Agent 漂移。

## 接手规则

切换平台时必须刻意接手：

```text
1. 读取当前 dashboard 和 learner-profile。
2. 读取近期 models、knowledge gaps 和 reviews。
3. 写 handoff note。
4. 停止旧运行层。
5. 新运行层从 handoff note 开始。
```

不要让两个运行层同时更新同一份学习状态。
