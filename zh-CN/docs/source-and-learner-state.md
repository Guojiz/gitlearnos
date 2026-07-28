# 来源与学习者状态模型

[English source](../../docs/source-and-learner-state.md)

GitLearnOS 应使用普通项目术语，不借用其他研究项目的专有标签。根目录英文 [`GITLEARNOS.md`](../../GITLEARNOS.md) 仍是唯一正式协议。

核心分层很简单：

```text
来源层
→ 项目或本地材料、来源记录、模型、证据、Git 历史

学习者状态层
→ learner-profile.md、知识缺口、复习结果、仪表盘、记忆备注
```

这些只是本仓库的实现术语，不是复制来的平台组件，也不应让人误以为 GitLearnOS 实现了另一套辅导系统。

## 来源层

来源层应当有依据、可检查。

在 GitLearnOS 中，它通常包括：

```text
ChatGPT Project Sources 或其他持久项目文件区
+ 本地教材 / PDF / 截图 / 原始文件
+ sources/
+ models/
+ knowledge-gaps/
+ 来源状态记录
+ Git 历史
```

这一层回答：

```text
结论基于什么材料？
AI 实际使用了哪个来源？
提取了什么概念或问题模型？
发现了什么知识缺口？
学习者能否检查证据？
```

持久项目 Sources 或外部文件夹可以保留完整教材或原始文件。在 ChatGPT 中，需要由 Chat 和 Work 对话复用的大型材料，优先放入 Project 的 **Sources** 区域。选定的 Git 仓库保存来源记录、选定片段、摘要、模型卡、知识缺口记录和链接。

## 学习者状态层

学习者状态层会随学习过程变化。

在 GitLearnOS 中，它通常包括：

```text
learner-profile.md
+ knowledge-gaps/
+ reviews/
+ dashboard.md
+ 运行环境支持时的 automations/
+ 可用时的原生 AI 记忆
```

这一层回答：

```text
学习者现在想完成什么？
哪些知识缺口仍然活跃？
哪种解释方式更有效？
哪里已经改善？
下一步应复习什么？
```

## 主动层与被动层

原生 AI 记忆相对主动，可能在后续对话中自动出现。

Git 仓库相对被动，AI 必须读取或搜索它。

本地文件是受保护的来源材料。AI 没有实际访问时，不得声称读过。

```text
原生记忆
→ 主动的偏好缓存

项目 Sources
→ 相关对话共享的大型材料

Git 仓库
→ 被动但可检查的事实来源

本地文件夹
→ 受保护的原始来源层

learner-profile.md
→ 主动记忆与被动仓库状态之间的桥梁
```

## 个性化练习

个性化练习应来自学习者真实的仓库状态，而不是通用测验模板。

默认输入：

```text
最近拆分的模型
+ 活跃知识缺口
+ learner-profile.md
+ 来源记录
+ 复习安排
```

默认输出：

```text
小型练习集
+ 答案
+ 解释
+ 已链接的来源 / 模型 / 缺口 / 画像条目
+ 下一复习日期
```

## 闭环

GitLearnOS 保持一个简单闭环：

```text
来源
→ 拆分为模型
→ 识别知识缺口
→ 生成练习
→ 学习者结果
→ 更新 learner-profile.md
→ 安排下一次复习
→ 改进后续问题
```

只要工具尊重仓库状态和真实权限，这个闭环可以运行在 ChatGPT、Claude、单上下文 AI 工具、Codex 或本地 Agent 中。

## 规则

不要把系统做得不必要地沉重。

仓库必须保持可读。学习者应能打开文件，并理解 AI 为什么作出某个判断。
