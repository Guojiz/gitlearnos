# GitLearnOS RAG-Anything 知识层

[English source](../../../../skills/gitlearnos/references/rag.md)

遵守 Router 的核心契约。完整 GitLearnOS 部署必须具备已验证的 RAG 层。
RAG-Anything 是首个支持的适配器，由唯一主 Agent 使用。Git 保存正式、可读、
版本化的学习记录；RAG 保存可以重建的检索层。RAG 缺失或未经验证时，继续执行
安全的 Git 学习操作，但把部署报告为 `incomplete`。

## 部署门槛

设置或部署时，能访问就先阅读 `GITLEARNOS.md` 和 `START-HERE.md`。询问学习者：

1. 学习目标与学科；
2. 当前资料及其格式；
3. 获授权来源边界与专用 RAG 存储位置；
4. 模型／提供方约束与凭据环境变量名。

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

## 按稳定知识点分类

每个长期知识点都使用稳定 ID，例如 `<subject>/<topic>/<knowledge-point>`，并在
`subjects/<subject>/knowledge/` 下创建规范 Git 记录。来源记录、缺口、模型、
复习、RAG 导入元数据和回执都使用同一 ID。展示标题改变时不要更换 ID。

导入前创建或更新 Git 来源记录，其中必须包含：

- 稳定的 `source_id`、标题、获授权定位／根目录，以及可用时的内容哈希或版本；
- 一个或多个 `knowledge_ids`，以及各自的规范 Git 记录链接；
- 稳定 RAG `doc_id`、提供方／解析器版本、索引位置和回执路径；
- 重建输入和删除边界。

一个来源可以对应多个知识点，一个知识点也可引用多个来源。不能按知识点重复复制
同一本教材。通过适配器元数据或结构化文本前言传入 `source_id`、`knowledge_ids`、
`doc_id`、Git 来源记录路径和页码／章节定位。绝不能手工修改生成的 `kv_store_*`、
`vdb_*`、图或缓存文件。

不能根据单次出现自行晋升。必须有反复证据、学习者明确要求，或清晰长期复用
价值。记录晋升原因，并把 Git 路径与 RAG 文档标识互相连接。

对于归纳后的题型模型，只导入已经记录晋升依据和证据链接的 Git 正式版本。
一次可能成立的诊断不能进入 RAG。保存 Git 版本与稳定 RAG 标识，让后续修订
更新同一知识而不是制造副本。RAG 晋升与学习者掌握彼此独立：知识可以进入检索
层，而学习者仍处于 `learning`。

## 避免重复解析

主 Agent 已经忠实理解图片、截图、题目、板书或短片段时，通过
RAG-Anything 的 `insert_content_list` 路径直接插入忠实结构化记录，而不是
重新解析。按文档化 content_list schema 组装条目：文本必须使用
`{"type": "text", "text": "...", "page_idx": 0}`（字段是 `text`，不是
`content`）；图片使用绝对 `img_path` 加说明；表格使用 Markdown
`table_body`；公式使用 `latex` 加文字描述；自定义类型才可使用原始
`content`。不能重复同等 OCR 或视觉处理。

进程成功退出不足以证明导入成功。必须确认插入报告非零文本长度或多模态条目、
索引含非零 chunk 或等价记录，并且教材特定查询返回可追踪内容。文档状态即使为
`processed`，只要内容与 chunk 都为零，就是空导入失败，不能报告 `enabled`。

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

依赖可用时，使用随附的 `scripts/rag-anything-adapter.py` 作为参考 CLI。它把凭据留在 Git
之外，强制检查获授权根目录和 Git 来源记录，并支持可检查的 ingest、query、
status、delete 与 rebuild 操作。提供方端点、模型 ID、嵌入维度和凭据环境变量名
保持可配置。
默认工作目录是用户数据目录下按仓库区分的文件夹，位于学习仓库之外。如果配置的
工作目录处于学习仓库内，适配器会拒绝运行，防止生成的向量、图数据、chunk 与缓存
被误当成规范学习状态。

[Kimi Code](https://www.kimi.com/code/docs/en/) 兼容配置来自 2026-09-05 对 `https://api.kimi.com/coding/v1` 的真实测试：
聊天与 embeddings 成功，embeddings 返回 1024 维及响应模型 `bge_m3_embed`，完整
文本生命周期通过导入、有来源引用的查询、新进程重开、删除和重建。测试时 Kimi
Code 公共文档没有承诺 embeddings 契约，因此这是已测试兼容性，不是稳定接口保证。
新索引要先探测实际维度，嵌入实现必须可替换；模型或维度改变时绝不能复用旧索引。

## 参考 CLI

当前随附适配器通过结构化插入接收获授权的 UTF-8 文本或 Markdown。PDF、图片、
表格、公式及其他格式使用上游解析器，再应用相同的 Git 身份与回执规则。全局参数
必须放在子命令之前：

```text
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> status
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> ingest --source <file> --source-record <tracked-record> --source-id <id> --knowledge-id <id> --doc-id <id> --authorized-root <root>
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> query --source-id <id> --doc-id <id> --question <question> --expect <source-specific-fact>
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> delete --source-id <id> --doc-id <id>
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> rebuild --source <file> --source-record <tracked-record> --source-id <id> --knowledge-id <id> --doc-id <id> --authorized-root <root>
```

提供方凭据只能通过 `GITLEARNOS_RAG_API_KEY` 或隐藏的 `--prompt-api-key` 输入。
CLI 绝不会把凭据写入 Git 或回执。
CLI 会把运行副本放在配置的 RAG 工作目录，并把可审计镜像发布到学习仓库的
`.gitlearnos/receipts/rag-<doc-id 的 sha256>.json`。提交时要把这份镜像与对应的
来源记录、知识点记录放在同一个 Git 变更中。

## 导入与查询

导入前：

1. 确认资料已获授权且处于批准边界；
2. 创建或更新精简 Git 来源记录和每个关联的稳定知识点记录；
3. 选择原文件解析或 content_list 直接插入；
4. 使用稳定文档标识（集成暴露时用 `doc_id`），并记录 `source_id`、
   `knowledge_ids`、Git 记录路径、来源版本／哈希和检索定位；
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

否则报告 `unavailable`、`unknown` 或 `incomplete`。Dry run、包导入、健康检查、
配置文件或空索引查询都不够。不存在仅拒绝 RAG 仍可完成完整部署的路径。

## 输出

```text
Learning goal:
RAG-Anything: enabled / unavailable / unknown / incomplete
Knowledge IDs:
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
