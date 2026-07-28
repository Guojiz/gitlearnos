# Adapters

[中文](README.zh-CN.md)

Adapters connect the platform-neutral [GitLearnOS protocol](../GITLEARNOS.md)
to an environment. They may change *how* work runs, never *what counts as
evidence* or *where learning truth lives*.

- [Agent environments](agents/README.md)
- [Local and hosted Git](git/README.md)
- [Automation runtimes](automation/README.md)
- [Optional search and indexing](search/README.md)

Search, databases, vector indexes, and skill managers are optional integrations.
They must be rebuildable from the learner-owned repository and cannot become
the only copy of learning state.
