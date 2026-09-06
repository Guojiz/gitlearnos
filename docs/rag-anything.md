# RAG-Anything Deployment Card

[中文](../zh-CN/docs/rag-anything.md)

Complete GitLearnOS deployment requires an authorized, verified RAG layer.
RAG-Anything is the first explicitly supported implementation and remains a
tool of the one main agent. Git is the readable, versioned learning record;
RAG is a rebuildable index. Without verified RAG, the Git learning loop stays
usable but deployment status is `incomplete`.

## Configuration and ownership

The learner's `gitlearnos.yml` is the only runtime configuration source. The
relevant shape is:

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

Legacy policy documents are migration material, not an effective source of RAG
or automation settings. Do not infer authorization from a Markdown marker.
Never index this public template, its examples, secrets, or an unapproved
source boundary.

When `working_dir` is empty, the bundled adapter derives a repository-specific
directory under the user's data home. Generated vectors, chunks, graph data,
and caches stay outside learner Git. The adapter rejects a configured working
directory inside the learner repository; only the auditable receipt mirror is
published under `.gitlearnos/receipts/`.

The main agent decides what to ingest and query. Give each durable knowledge
point a stable `<subject>/<topic>/<knowledge-point>` ID and create its Git
record before ingestion. Use RAG for authorized
textbooks, long-lived course material, and durable knowledge; formalize notes
in Git first; keep one-off exercises and temporary mistakes out until they
become durable. If the agent already understood an image, insert its faithful
Markdown/structure instead of asking RAG to repeat OCR.

## Deployment gate

For a learner deployment, ask for the goal, subject, material, formats,
authorized source boundary, RAG storage, and provider constraints before
installing or ingesting. Then inspect the local Python, parser, storage, model,
and provider constraints. The public-template
maintenance path is exempt from this learner gate.

The selected upstream package must be pinned and verified in the actual
environment. A package import, health check, mock result, or dry run is not an
ingest. Report configuration as set/unset; never request or print secrets.

## Validated compatibility snapshot

On 2026-09-05, the bundled adapter completed a real text lifecycle on macOS
with RAG-Anything 1.3.1, LightRAG 1.5.6, MinerU 3.4.4, and the
[Kimi Code](https://www.kimi.com/code/docs/en/) OpenAI-compatible endpoint. An
authorized synthetic UTF-8 source was ingested,
a source-specific code and schedule were retrieved with exact `source_id` and
`doc_id` provenance, the document was deleted, rebuilt, reopened, and queried
again. The observed embedding response model was `bge_m3_embed` with 1024
dimensions. Kimi's public Code documentation did not promise that embeddings
interface, so this is a tested compatibility snapshot rather than a stable
provider guarantee. The bundled adapter currently verifies text and Markdown;
PDF and multimodal parsing still use the upstream parser path.

## Machine-readable external receipt

An RAG claim is independently checkable only when the provider emits a JSON
receipt under `.gitlearnos/receipts/`. The bundled adapter publishes
`rag-<sha256-of-doc-id>.json`; another adapter may use another collision-safe
name. The receipt is evidence of one provider operation; the local checker
validates its shape only and never calls or impersonates the provider.

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

`provider`, `source_id`, non-empty `knowledge_ids`, `doc_id`, the Git source
record path/base revision/content hash, `source_boundary`, and non-empty `evidence` for
`ingest`, `query`, `rebuild`, and `delete` are mandatory. `status` must be
explicit (`completed`, `available`, `unavailable`, or `failed`). A receipt does
not grant authorization and does not prove learner mastery. `rebuild` and
`delete` paths are required so the index remains reversible.

## Text markers are reported-only

Text in `dashboard.md`, `automation.md`, a Harness panel, or any other
repository file may say `RAG: enabled` or link to a receipt. Such markers are
observations supplied by the repository, never independent verification. A
marker must be rendered as `reported-only` unless a valid machine receipt is
read and the external provider's own evidence is available. Do not upgrade a
state from a sentence, date, prompt, or package import.

## Acceptance

Report `enabled` only after an authorized real ingest, source-specific query,
inspected source boundary, stable Git knowledge/source linkage, and known
rebuild/delete paths. Otherwise report `unavailable`, `incomplete`, or
`reported-only` with the missing evidence and an undo/delete boundary.
