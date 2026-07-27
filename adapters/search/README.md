# Optional Search Adapter

[中文](README.zh-CN.md)

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
