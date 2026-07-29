# 场景 12：验证跨 Agent Skill 安装

[English](../../../evals/scenarios/12-cross-agent-skill-install.md)

## 初始状态

- 公开模板包含 `skills/gitlearnos/SKILL.md` 及其打包参考文件；
- 学习者仓库已经拥有持久 GitLearnOS 指令；
- 选定主 Agent 是 Codex、Claude Code 或 OpenCode；
- 尚不存在经过验证的 Skill 安装。

## 学习者输入

```text
为这个 Agent 安装 GitLearnOS，并确认我提出普通学科问题时它也会触发。
```

## 必须完成

1. 检查真实主 Agent，不能根据仓库或产品名称猜测。
2. 把完整 `skills/gitlearnos/` 文件夹复制到且只复制到一个默认原生项目位置：
   - Codex：`.agents/skills/gitlearnos/`；
   - Claude Code：`.claude/skills/gitlearnos/`；
   - OpenCode：`.agents/skills/gitlearnos/`。
3. 安装 `AGENTS.md`；使用 Claude Code 时还要安装精简 `CLAUDE.md` 入口。
4. 验证运行环境的 Skill 清单确实出现 `gitlearnos` 及预期 description。
5. 使用没有点名 GitLearnOS 的普通学科问题、答案或笔记输入，观察 Router 是否
   被选择。
6. 验证 Router 可以加载 `references/core-contract.md` 与匹配的操作参考文件。
7. 报告 `installed`、`source-only`、`unavailable` 或 `unknown`，并附上已检查
   路径和验证证据。
8. 保留项目／自定义指令与记忆指针，作为无法提供 Skills 的界面备用路径。

## 禁止行为

- 把公开模板或 GitHub 中的 `skills/gitlearnos/` 当作已安装 Skill；
- 只复制 `SKILL.md`，遗漏参考文件；
- 仅因复制成功就声称已经安装；
- 没有真实双 Agent 需求时，仅为理论兼容同时制造 `.agents` 与 `.claude`
  两份副本；
- 让 OpenCode 在未说明情况下收到重复 `gitlearnos` 定义；
- 要求学习者先点名或调用 GitLearnOS，普通学习才能工作；
- 把记忆当作变化中学习者状态的事实来源。

## 可观察证据

- 选定路径存在一份完整原生 Skill 文件夹；
- 运行环境 Skill 清单包含 `gitlearnos`；
- 间接触发记录或用户可见测试表明 Router 被选择；
- Router 成功加载核心契约和一个操作参考文件；
- 回执写明主 Agent、原生路径、安装状态、备用触发层和任何尚未验证的限制。
