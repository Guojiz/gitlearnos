# 中英文对齐规则

[English documentation policy](../DOCUMENTATION.md)

所有中文内容统一放在根目录 `zh-CN/`。英文是正式版本；中文面向学习者、评委和需要中文说明的维护者。

## 路径规则

翻译文件尽量镜像英文路径：

```text
README.md                         ↔ zh-CN/README.md
docs/architecture.md             ↔ zh-CN/docs/architecture.md
templates/learning-policy.md     ↔ zh-CN/templates/learning-policy.md
evals/scenarios/01-bootstrap.md  ↔ zh-CN/evals/scenarios/01-bootstrap.md
skills/gitlearnos-review/SKILL.md ↔ zh-CN/skills/gitlearnos-review/SKILL.md
```

因此，判断一个中文文件对应哪个英文文件时，只需去掉开头的 `zh-CN/`。

## 必须同步的人类入口与运行规则

| 内容 | 英文正式版本 | 中文版本 |
|---|---|---|
| 产品入口 | [README](../README.md) | [中文 README](README.md) |
| 使用说明 | [Quickstart](../QUICKSTART.md) | [快速开始](QUICKSTART.md) |
| 常见问题 | [FAQ](../FAQ.md) | [常见问题](FAQ.md) |
| 文档导航 | [Documentation map](../DOCUMENTATION.md) | [文档地图](DOCUMENTATION.md) |
| 运行演示 | [Live demo](../LIVE-DEMO.md) | [三分钟演示](LIVE-DEMO.md) |
| AceSAT 说明 | [Impact statement](../docs/acesat-build-for-impact.md) | [影响说明](docs/acesat-build-for-impact.md) |

这些入口发生实质变化时，中英文必须在同一次改动中更新。核心运行、记忆、来源、Git、Agent 适配、教学协作和验收场景同样属于强制镜像，具体列表由 [`scripts/check-language-alignment.mjs`](../scripts/check-language-alignment.mjs) 执行检查。

中文不要求逐字翻译，但目标、必需条件、限制、链接和下一步必须一致。尤其不得出现英文已要求“无需显式调用即可主动识别”，中文仍要求用户点名 Skill 的分叉。

## Skills 必须同步

`skills/` 下每一份 Markdown 文件都必须在 `zh-CN/skills/` 下有同路径中文
阅读版。修改 Skill 时，两种语言必须在同一个改动中更新。

翻译不得改变机器接口：YAML `name`、状态值、枚举、路径和输出字段保持英文；
说明、边界和操作步骤翻译为清楚的中文。每份中文 Skill 都链接英文原文，并
明确根目录英文 `GITLEARNOS.md` 是唯一正式协议。这样既保持“祖宗之法”，也
让中文维护者能完整理解工作流。

## 可以只保留英文的内容

纯机器执行契约、评测实现和非核心高级技术说明可以只保留英文。面向 Agent 的核心运行说明与所有 Skills 必须有中文阅读版。已有中文翻译不能覆盖英文正式版本，也不能阻塞英文机器文件更新。

## 本地化内容

`zh-CN/examples/demo-zhongkao-lite/` 是独立的中文学习场景，不是某个英文示例的逐字翻译，因此不要求存在同路径英文副本。它仍然必须遵守同一 GitLearnOS 协议和证据规则。

## 每次修改的检查

1. 中文文件只能出现在 `zh-CN/` 下；
2. 翻译文件尽量与英文使用相同的相对路径和文件名；
3. 所有强制人类入口与核心运行规则的含义保持一致；
4. 每份 Skill 都有同路径中文版本，YAML `name` 与标题结构对齐；
5. 所有相对链接、图片和官网中文链接可以打开；
6. 学习者仓库仍使用 `AGENTS.md`，不会把模板的语言目录复制进去。
