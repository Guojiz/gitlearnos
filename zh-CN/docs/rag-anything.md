# RAG-Anything 部署卡

[English](../../docs/rag-anything.md)

完整 GitLearnOS 部署必须具备获授权且已验证的 RAG 层。RAG-Anything 是首个明确
支持的实现，并由唯一主 Agent 作为工具使用。Git 是可读、可版本化的学习记录；
RAG 是可重建的索引。缺少已验证 RAG 时，Git 学习闭环仍可用，但部署状态为
`incomplete`。

## 配置与职责

学习者的 `gitlearnos.yml` 是唯一运行时配置来源，相关结构如下：

```yaml
rag:
  required_for_complete: true
  provider: rag-anything
  status: pending       # pending | configured | verified | unavailable | failed
  working_dir: ""
  parser_output_dir: ""
  ingest:
    enabled: true
    scope: per-source
    authorization: explicit
```

旧的策略文档仅用于迁移，不是生效的 RAG 或自动化配置来源。不能从 Markdown 标记
推断授权。绝不能索引这个公开模板、示例、秘密或未经批准的资料边界。

`working_dir` 留空时，随附适配器会在用户数据目录中推导仓库专属目录。生成的向量、
chunk、图数据与缓存留在学习仓库之外；配置到学习仓库内部的工作目录会被拒绝。
只有可审计的回执镜像发布到 `.gitlearnos/receipts/`。

主 Agent 决定导入和查询内容。每个长期知识点使用稳定的
`<subject>/<topic>/<knowledge-point>` ID，并在导入前创建 Git 记录。对获授权的
教材、长期课程材料和持久知识使用 RAG；
先把笔记正式整理到 Git；一次性练习和临时错误在变得持久前不要导入。如果 Agent
已经理解图片，应插入忠实 Markdown／结构，而不是让 RAG 重复 OCR。

## 部署门槛

学习者部署时，先询问目标、学科、材料、格式、获授权来源边界、RAG 存储位置和
提供方约束，再安装或导入。随后检查实际 Python、解析器、存储、模型和提供方限制。维护公开模板不受此学习者门槛
限制。

所选上游包必须在实际环境中固定并验证版本。仅有包导入、健康检查、mock
结果或 dry run 都不算导入。只报告配置已设置／未设置，绝不索取或打印秘密。

## 已验证兼容性快照

2026-09-05，随附适配器在 macOS 上使用 RAG-Anything 1.3.1、LightRAG 1.5.6、
MinerU 3.4.4 和 [Kimi Code](https://www.kimi.com/code/docs/en/) OpenAI-compatible
endpoint 完成了真实文本生命周期。
测试导入一份获授权的合成 UTF-8 来源，使用准确的 `source_id`、`doc_id` 出处检索
到来源特定代码和时间，随后删除、重建、重新打开并再次查询该文档。实际观察到的
embedding 响应模型为 `bge_m3_embed`，维度为 1024。Kimi Code 公共文档没有承诺
该 embeddings 接口，因此这是已测试的兼容性快照，不是稳定 provider 保证。当前
随附适配器验证文本与 Markdown；PDF 和多模态解析仍走上游解析器路径。

## 机器可读的外部回执

只有提供方在 `.gitlearnos/receipts/` 下写出的 JSON 回执包含下列所有字段时，RAG
声明才可独立检查。随附适配器发布 `rag-<doc-id 的 sha256>.json`；其他适配器可使用
不同但不会碰撞的名称。回执证明一次提供方操作；本地检查器只检查结构，不会调用
或冒充提供方。

```json
{
  "schema": "gitlearnos.external-receipt/v1",
  "kind": "rag",
  "provider": "rag-anything",
  "source_id": "math/algebra-course",
  "knowledge_ids": ["math/algebra/quadratic-functions"],
  "doc_id": "course/algebra.pdf",
  "git_source_record": {"path": "subjects/math/sources/algebra-course.md", "base_revision": "0123456789abcdef", "content_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
  "source_boundary": {"root": "/authorized/materials", "allowlist": ["course/algebra.pdf"], "evidence": "allowlist inspected before ingest"},
  "ingest": {"status": "completed", "run_id": "ing-2026-08-15T07:00Z", "evidence": "provider response and non-zero chunks"},
  "query": {"status": "completed", "run_id": "qry-2026-08-15T07:02Z", "evidence": "source-specific hit for doc_id"},
  "rebuild": {"status": "available", "evidence": "documented replay from source boundary"},
  "delete": {"status": "available", "evidence": "provider delete by doc_id"},
  "observed_at": "2026-08-15T07:02:00Z"
}
```

`provider`、`source_id`、非空 `knowledge_ids`、`doc_id`、Git 来源记录路径／基础版本／
内容哈希、`source_boundary` 以及 `ingest`、`query`、`rebuild`、`delete`
各自的非空 `evidence` 都是必需的。`status` 必须明确（`completed`、`available`、
`unavailable` 或 `failed`）。回执不授予授权，也不证明学习者掌握；必须提供
`rebuild` 和 `delete` 路径，保证索引可撤销。

## 文本标记只能报告

`dashboard.md`、`automation.md`、Harness 面板或其他仓库文件中的 `RAG: enabled`
及回执链接，都只是仓库提供的观察，永远不是独立验证。除非读取到有效机器回执并
具备提供方自身证据，否则标记必须显示为 `reported-only`。不能把句子、日期、提示词
或包导入升级为已验证状态。

## 验收

只有在获授权的真实导入、资料特定查询、检查过资料边界、稳定 Git 知识点／来源
关联且已知重建／删除路径之后，才能报告 `enabled`。否则报告 `unavailable`、
`incomplete` 或带缺失证据及撤销边界的 `reported-only`。
