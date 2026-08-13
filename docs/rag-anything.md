# RAG-Anything Deployment Card

[中文](../zh-CN/docs/rag-anything.md)

GitLearnOS recommends enabling a local RAG knowledge layer by default while
allowing the learner to decline. RAG-Anything is the first explicitly supported
and recommended implementation, not the only compatible implementation.
It is useful when a learner has textbooks, long PDFs, course packs, notes, or
durable personal knowledge that should be retrieved later. GitLearnOS still
works without it.

## Ownership

```text
                    one Main Agent
                 /        |        \
               Git   RAG-Anything   other tools
```

Git owns formal state and memory. RAG-Anything owns a rebuildable search index.
The main agent owns every routing, ingestion, promotion, and query decision.
Do not add a second RAG agent.

## Read, ask, then deploy

The deployment agent must complete this order:

1. read `GITLEARNOS.md` and `START-HERE.md` completely;
2. identify the learner repository without confusing it with this template;
3. ask the learner for the learning goal, subject, current materials and
   formats, and whether to enable RAG-Anything;
4. wait for the answer before installation, initialization, ingestion, commit,
   or deployment;
5. inspect the local Python, storage, parser, model, and provider constraints;
6. install only the smallest official upstream capability needed;
7. ingest one authorized real source and run one traceable real query;
8. report exact status and undo boundaries.

This learner deployment gate does not apply to maintaining, documenting,
testing, or publishing the public GitLearnOS template.

Never ask for API keys or secrets in chat. Report configuration as set or
unset without exposing values.

## Upstream installation boundary

Follow the current [official RAG-Anything repository](https://github.com/HKUDS/RAG-Anything).
Install a version-pinned upstream package for reproducibility:

```bash
python3.12 -m venv .rag-venv
.rag-venv/bin/pip install "raganything==1.3.1"
```

Resolve two compatibility risks explicitly, then verify:

1. PyPI currently publishes `raganything` 1.3.1, but an older 0.0.1 release
   also exists. Pin the intended current release and inspect the installed
   version instead of accepting an old cached, mirrored, or constrained
   resolution.
2. Upstream `raganything` depends on `mineru[core]`, which has no Python 3.14
   distribution, and newer releases pin `Requires-Python <3.14`. macOS
   Homebrew's default `python3` is often 3.14, so use a Python 3.12 virtualenv.

Verify the version and import before reporting anything available:
`.rag-venv/bin/python -c "import importlib.metadata as m; import raganything, lightrag; print(m.version('raganything'))"`.

For direct structured insertion in 1.3.1, a text block uses
`{"type": "text", "text": "...", "page_idx": 0}`. Do not substitute a
generic `content` field for a text block: the call may exit successfully while
indexing zero characters and zero chunks. Verify nonzero indexed content and a
traceable source-specific retrieval before reporting RAG as `enabled`.

Optional extras expand format support, while Office documents and parser
choices can require additional system packages, models, or platform-specific
setup. Do not blindly install every extra. Do not assume an MCP server, Docker
service, or web API exists unless the current integration actually provides and
verifies it.

## Routing summary

- Textbooks and foundational long-term materials: register in Git and ingest
  into RAG when authorized.
- Notes and durable personal knowledge: formalize in Git, then insert into RAG.
- One-off exercises and temporary mistakes: handle now; optionally record in
  Git; do not ingest yet.
- Repeated errors or reusable methods: promote to formal Git knowledge, then
  insert into RAG with a linked identifier.
- Already-understood image or screenshot: insert faithful Markdown/structured
  content; do not repeat equivalent OCR.
- Long or relationship-rich original document: allow RAG-Anything to parse the
  original when authorized.
- General question: answer directly. Query RAG only when personal sources or
  durable knowledge matter.

## Acceptance check

`enabled` requires a callable integration, dependencies for the chosen format,
one real authorized ingest, one source-specific retrieval with traceable ID,
an inspected index boundary, and a known rebuild/delete path. Package import,
configuration, health, mock output, or dry-run output alone does not pass.
