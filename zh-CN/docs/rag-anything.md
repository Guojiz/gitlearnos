# RAG-Anything 部署卡

[English](../../docs/rag-anything.md)

GitLearnOS 推荐可选的本地 RAG 层。RAG-Anything 是首个明确支持的实现，但不是
必需的运行时，也不是第二个 Agent。Git 仍是可读、可版本化的学习记录；RAG 是由
唯一主 Agent 管理、可以重建的索引。

## 配置与职责

学习者的 `gitlearnos.yml` 是唯一运行时配置来源，相关结构如下：

```yaml
rag:
  provider: rag-anything
  choice: enabled       # enabled | declined | undecided
  ingest: authorized    # authorized | ask
```

旧的策略文档仅用于迁移，不是生效的 RAG 或自动化配置来源。不能从 Markdown 标记
推断授权。绝不能索引这个公开模板、示例、秘密或未经批准的资料边界。

主 Agent 决定导入和查询内容。对获授权的教材、长期课程材料和持久知识使用 RAG；
先把笔记正式整理到 Git；一次性练习和临时错误在变得持久前不要导入。如果 Agent
已经理解图片，应插入忠实 Markdown／结构，而不是让 RAG 重复 OCR。

## 部署门槛

学习者部署时，先询问目标、学科、材料、格式及是否启用 RAG，再安装或导入。随后
检查实际 Python、解析器、存储、模型和提供方限制。维护公开模板不受此学习者门槛
限制。

上游包是可选的，必须在实际环境中固定并验证版本。仅有包导入、健康检查、mock
结果或 dry run 都不算导入。只报告配置已设置／未设置，绝不索取或打印秘密。

## 机器可读的外部回执

只有提供方发出的 JSON 回执（例如 `external/receipts/rag-<doc-id>.json`）包含下列
所有字段时，RAG 声明才可独立检查。回执证明一次提供方操作；本地检查器只检查结构，
不会调用或冒充提供方。

```json
{
  "schema": "gitlearnos.external-receipt/v1",
  "kind": "rag",
  "provider": "rag-anything",
  "doc_id": "course/algebra.pdf",
  "source_boundary": {"root": "/authorized/materials", "allowlist": ["course/algebra.pdf"], "evidence": "allowlist inspected before ingest"},
  "ingest": {"status": "completed", "run_id": "ing-2026-08-15T07:00Z", "evidence": "provider response and non-zero chunks"},
  "query": {"status": "completed", "run_id": "qry-2026-08-15T07:02Z", "evidence": "source-specific hit for doc_id"},
  "rebuild": {"status": "available", "evidence": "documented replay from source boundary"},
  "delete": {"status": "available", "evidence": "provider delete by doc_id"},
  "observed_at": "2026-08-15T07:02:00Z"
}
```

`provider`、`doc_id`、`source_boundary` 以及 `ingest`、`query`、`rebuild`、`delete`
各自的非空 `evidence` 都是必需的。`status` 必须明确（`completed`、`available`、
`unavailable` 或 `failed`）。回执不授予授权，也不证明学习者掌握；必须提供
`rebuild` 和 `delete` 路径，保证索引可撤销。

## 文本标记只能报告

`dashboard.md`、`automation.md`、Harness 面板或其他仓库文件中的 `RAG: enabled`
及回执链接，都只是仓库提供的观察，永远不是独立验证。除非读取到有效机器回执并
具备提供方自身证据，否则标记必须显示为 `reported-only`。不能把句子、日期、提示词
或包导入升级为已验证状态。

## 验收

只有在获授权的真实导入、资料特定查询、检查过资料边界且已知重建／删除路径之后，
才能报告 `enabled`。否则报告 `declined`、`undecided`、`unavailable` 或带缺失证据
及撤销边界的 `reported-only`。禁用或不可用 RAG 时 GitLearnOS 仍可运行。
