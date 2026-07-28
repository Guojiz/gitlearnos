# Git Adapter

[中文](README.zh-CN.md)

GitLearnOS uses Git semantics, not one hosting API.

## Supported shapes

| Repository | Core workflow |
|---|---|
| local Git | read, write, commit; no remote required |
| standard remote | clone or pull, commit, push when authorized |
| GitHub | connector/API writes or standard Git |
| GitLab or Gitea | standard Git or a compatible repository connector |

## Write contract

1. resolve the target repository;
2. inspect the current revision and working state;
3. read only relevant files;
4. apply one meaningful, reversible learning update;
5. verify changed paths;
6. commit with a concise learning-event message;
7. push only when authorized;
8. return the commit or equivalent revision in the receipt.

Do not overwrite concurrent or unrelated work. If the base revision changed and
the update cannot be reconciled safely, stop and report the conflict. The
portable protocol does not require multi-writer merging.

Suggested commit form:

```text
learn(<subject>): <learning event>
```

The learner should not need to issue Git commands during normal use.
