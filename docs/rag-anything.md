# RAG-Anything Deployment Card

[中文](../zh-CN/docs/rag-anything.md)

GitLearnOS recommends an optional local RAG layer. RAG-Anything is the first
explicitly supported implementation, but it is not a required runtime or a
second agent. Git remains the readable, versioned learning record; RAG is a
rebuildable index operated by the one main agent.

## Configuration and ownership

The learner's `gitlearnos.yml` is the only runtime configuration source. The
relevant shape is:

```yaml
rag:
  provider: rag-anything
  choice: enabled       # enabled | declined | undecided
  ingest: authorized    # authorized | ask
```

Legacy policy documents are migration material, not an effective source of RAG
or automation settings. Do not infer authorization from a Markdown marker.
Never index this public template, its examples, secrets, or an unapproved
source boundary.

The main agent decides what to ingest and query. Use RAG for authorized
textbooks, long-lived course material, and durable knowledge; formalize notes
in Git first; keep one-off exercises and temporary mistakes out until they
become durable. If the agent already understood an image, insert its faithful
Markdown/structure instead of asking RAG to repeat OCR.

## Deployment gate

For a learner deployment, ask for the goal, subject, material, formats, and
whether to enable RAG before installing or ingesting. Then inspect the local
Python, parser, storage, model, and provider constraints. The public-template
maintenance path is exempt from this learner gate.

The upstream package is optional and must be pinned and verified in the actual
environment. A package import, health check, mock result, or dry run is not an
ingest. Report configuration as set/unset; never request or print secrets.

## Machine-readable external receipt

An RAG claim is independently checkable only when the provider emits a JSON
receipt (for example `external/receipts/rag-<doc-id>.json`) with every field
below. The receipt is evidence of one provider operation; the local checker
validates its shape only and never calls or impersonates the provider.

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

`provider`, `doc_id`, `source_boundary`, and non-empty `evidence` for
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
inspected source boundary, and known rebuild/delete paths. Otherwise report
`declined`, `undecided`, `unavailable`, or `reported-only` with the missing
evidence and an undo/delete boundary. GitLearnOS continues to work when RAG is
disabled or unavailable.
