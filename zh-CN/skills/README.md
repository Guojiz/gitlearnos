# GitLearnOS Skills

[English](../../skills/README.md)

GitLearnOS 只发布一个自包含、可安装的 Skill 文件夹：

```text
skills/gitlearnos/
├── SKILL.md             唯一可发现 Router
├── agents/openai.yaml   可选 OpenAI 界面元数据
└── references/          操作、核心契约和学科方法
```

初始 Skill 清单只出现 Router 的 `name + description`。触发后，它只加载一个
操作参考文件，必要时再加载一个学科参考文件。这样既保持渐进式披露，也避免九个
Skills 为同一个学习事件竞争触发。

`skills/gitlearnos/` 是可分发源文件夹，不代表已经安装。设置流程把整个文件夹
复制到当前主 Agent 的原生位置，并验证是否真的被发现：

| 主 Agent | 默认项目位置 |
|---|---|
| Codex | `.agents/skills/gitlearnos/` |
| Claude Code | `.claude/skills/gitlearnos/` |
| OpenCode | `.agents/skills/gitlearnos/` |

详见 [Agent 适配器](../adapters/agents/README.md)。核心产品能力仍是整理、出题和
自动写回；实时辅导是可选项。
