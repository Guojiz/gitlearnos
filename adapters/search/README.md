# Optional Search Adapter

[中文](../../zh-CN/adapters/search/README.md)

Core GitLearnOS reads linked Markdown directly. Search is optional when a
repository becomes too large for path and link navigation.

A search adapter may index source records, models, gaps, reviews, and events,
but:

- the index must be rebuildable from Git;
- search output is a locator, not learning evidence by itself;
- access controls must match the underlying repository and sources;
- learner records must not leave the approved boundary;
- missing search results must not be treated as proof that no evidence exists.

Vector search, keyword search, and hosted retrieval systems all follow this
boundary. None is required for v2 conformance.

RAG-Anything is the recommended optional local adapter for multimodal learning
materials. Its index may additionally contain authorized original textbooks,
course packs, notes, and formal knowledge promoted from Git. Follow the
[deployment card](../../docs/rag-anything.md) and the Skill's
[`rag.md`](../../skills/gitlearnos/references/rag.md) decision rules. Do not
index the public template, examples, unauthorized files, or temporary
exercises. A package import or empty health check is not deployment evidence;
verify one real authorized ingest and one traceable retrieval.
