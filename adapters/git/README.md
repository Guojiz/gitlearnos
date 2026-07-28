# Git Adapter

[中文](../../zh-CN/adapters/git/README.md)

GitLearnOS uses Git semantics, not one hosting API.

## Supported shapes

| Repository | Core workflow |
|---|---|
| local Git | read, write, commit; no remote required |
| standard remote | clone or pull, commit, push when authorized |
| GitHub | connector/API writes or standard Git |
| GitLab or Gitea | standard Git or a compatible repository connector |

ChatGPT Chat, Work, Codex, and other agents may expose different repository
tools even in the same product. Verify the current surface. Hidden technical Git
details do not mean Git is absent; a product label does not prove Git is
present.

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

## When to add GitHub

Local Git is enough for one-device private learning. Add a private GitHub remote
or another host when the learner wants:

- off-device backup or cross-device continuity;
- teacher or tutor review with traceable feedback;
- a shared course-material repository;
- group learning or project coordination;
- browser access, connectors, Issues, pull requests, or CI.

Keep shared teaching materials separate from each learner's private state.
Inviting collaborators, changing visibility, or pushing sensitive material
requires explicit authorization. See
[Why Git, and when GitHub helps](../../docs/why-github.md).
