# GitLearnOS RAG-Anything 知识层

[English source](../../../../skills/gitlearnos/references/rag.md)

遵守 Router 的核心契约。RAG-Anything 是唯一主 Agent 使用的可选本地工具。
Git 保存正式、可读、版本化的学习记录；RAG 保存可以重建的检索层。

## 部署门槛

设置或部署时，能访问就先阅读 `GITLEARNOS.md` 和 `START-HERE.md`。询问学习者：

1. 学习目标与学科；
2. 当前资料及其格式；
3. 是否接受默认建议，启用本地 RAG 知识层，并把 RAG-Anything 作为首个支持
   选项；
4. 获授权的本地存储边界与模型／提供方限制。

回答前不得安装包、创建存储、导入文件、提交或部署。绝不能在聊天中索取秘密；
只检查必要配置是否已设置。

此门槛适用于学习者部署，不适用于维护、编写文档、测试或发布公开 GitLearnOS
模板。其他兼容本地 RAG 实现可以替换 RAG-Anything，而不改变下方规则。

## 判断知识去向

| 输入 | Git | RAG-Anything |
|---|---|---|
| 目标、状态、历史、错误、计划、资料登记 | 是 | 默认否 |
| 教材、长期讲义、课程包、参考书 | 精简登记 | 获授权时导入 |
| 用户笔记、老师方法、课程规则、长期总结 | 正式知识 | 插入供检索 |
| 普通一次性练习或临时错误 | 有用时记录 | 否 |
| 反复错误模式、长期缺口、可复用方法 | 正式晋升 | 晋升后插入 |

不能根据单次出现自行晋升。必须有反复证据、学习者明确要求，或清晰长期复用
价值。记录晋升原因，并把 Git 路径与 RAG 文档标识互相连接。

## 避免重复解析

主 Agent 已经忠实理解图片、截图、题目、板书或短片段时，写结构化 Markdown，
并在当前集成支持时使用 RAG-Anything 的预解析内容直接插入路径。不能重复同等
OCR 或视觉处理。

完整教材、长 PDF、大型长期资料、需要保持文本／图片／表格／公式关系的文档，
或主 Agent 尚未完整检查的资料，才把原文件交给 RAG-Anything。

## 安装最小官方能力

RAG-Anything 上游是 Python 框架；不能假设存在 MCP 服务器或一键服务。优先
使用当前官方包与文档，只选择学习者格式和环境实际需要的依赖。复杂 Office
格式可能需要外部软件；解析器选择可能需要额外模型或包。凭据不得进入 Git 或
聊天。

集成可能提供 Python 调用、本地服务、MCP 工具或其他适配器。必须验证真实接口，
不能记录想象中的接口。

## 导入与查询

导入前：

1. 确认资料已获授权且处于批准边界；
2. 创建或更新精简 Git 来源记录；
3. 选择原文件解析或结构化直接插入；
4. 使用稳定文档标识并在 Git 记录；
5. 防止重复提交；解析器或版本影响未来重建时一并记录。

只有请求依赖用户特定教材、笔记或长期知识时才查询 RAG。检索输出是定位与依据
辅助，不是学习或正确性的证明。重要结论要链接回获授权来源或 Git 正式记录。

## 验证部署

只有实际观察到以下全部条件，才能报告 RAG-Anything 为 `enabled`：

1. 实际包、工具或服务接口可调用；
2. 选定格式需要的解析器／模型依赖可用；
3. 一份获授权且不含秘密的真实资料已经导入或插入；
4. 测试查询通过可追溯标识检索到资料特定事实；
5. 索引不含公开模板、示例、未授权文件和临时练习；
6. 已知索引位置、重建输入与删除／撤销边界。

否则报告 `disabled`、`unavailable` 或 `unknown`。Dry run、包导入、健康检查、
配置文件或空索引查询都不够。

## 输出

```text
Learning goal:
RAG-Anything: enabled / disabled / unavailable / unknown
Authorized boundary:
Git source records:
Ingested or promoted:
Retrieval evidence:
Skipped and why:
Changed files:
Secrets: not inspected / configuration status only
Undo or deletion boundary:
Next action:
```
