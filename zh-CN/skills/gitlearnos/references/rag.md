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

对于归纳后的题型模型，只导入已经记录晋升依据和证据链接的 Git 正式版本。
一次可能成立的诊断不能进入 RAG。保存 Git 版本与稳定 RAG 标识，让后续修订
更新同一知识而不是制造副本。RAG 晋升与学习者掌握彼此独立：知识可以进入检索
层，而学习者仍处于 `learning`。

## 避免重复解析

主 Agent 已经忠实理解图片、截图、题目、板书或短片段时，通过
RAG-Anything 的 `insert_content_list` 路径直接插入忠实结构化记录，而不是
重新解析。按文档化 content_list schema 组装条目：文本条目、带绝对
`img_path` 和说明的图片、以 Markdown `table_body` 表示的表格、以 `latex`
加文字描述表示的公式，以及带原始内容的自定义类型。不能重复同等 OCR 或
视觉处理。

完整教材、长 PDF、大型长期资料、需要保持文本／图片／表格／公式关系的文档，
或主 Agent 尚未完整检查的资料，才把原文件交给 RAG-Anything。

纯文本或非多模态主 Agent 看不见图片，因此没有“理解”它；绝不能据此合成或编造
表示、诊断或题目。优先用可用的多模态或视觉助手模型转写，其次用获授权的本地
OCR 或解析器，再次请学习者粘贴文字，或把原文件交给 RAG-Anything 解析器做获
授权导入。低置信度或碎片化的转写仍不算“已读”：记为 `needs-transcription` 或
`not-yet-read`，并在记录缺口、模型或题目之前请学习者确认。

## 安装最小官方能力

RAG-Anything 上游是 Python 框架；不能假设存在 MCP 服务器或一键服务。优先
使用当前官方包与文档，只选择学习者格式和环境实际需要的依赖。复杂 Office
格式可能需要外部软件；解析器选择可能需要额外模型或包。凭据不得进入 Git 或
聊天。

为保证可复现，必须固定一个当前发布版本并检查实际安装版本。PyPI 当前发布
1.3.1，但也保留旧的 0.0.1，不能接受缓存、镜像或依赖约束导致的异常旧版解析。
上游 `mineru[core]` 没有 Python 3.14 发行版。默认 `python3` 为 3.14 的机器要
创建 Python 3.12 虚拟环境，并在声称可用前验证安装版本以及
`import raganything, lightrag`。

集成可能提供 Python 调用、本地服务、MCP 工具或其他适配器。必须验证真实接口，
不能记录想象中的接口。

## 导入与查询

导入前：

1. 确认资料已获授权且处于批准边界；
2. 创建或更新精简 Git 来源记录；
3. 选择原文件解析或 content_list 直接插入；
4. 使用稳定文档标识（集成暴露时用 `doc_id`）并在 Git 记录，让后续检索能
   引用同一标识；
5. 防止重复提交；解析器或版本影响未来重建时一并记录。

只有请求依赖用户特定教材、笔记或长期知识时才查询 RAG；每次查询都会对图与
向量检索跑一次 LLM，普通问题应直接回答。检索输出是定位与依据辅助，不是学习
或正确性的证明。重要结论链接回获授权来源或 Git 正式记录时，引用返回的
`doc_id` 或文件引用。

## 验证部署

只有实际观察到以下全部条件，才能报告 RAG-Anything 为 `enabled`：

1. 实际包、工具或服务接口可调用；
2. 选定格式需要的解析器／模型依赖可用；
3. 一份获授权且不含秘密的真实资料已经导入或插入；
4. 测试查询检索到资料特定事实，且响应引用已导入资料的可追溯 `doc_id` 或
   文件引用；
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
Credentials: not inspected / configuration status only
Undo or deletion boundary:
Next action:
```
