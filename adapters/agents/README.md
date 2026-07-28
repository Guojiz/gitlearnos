# Agent Adapter

[中文](../../zh-CN/adapters/agents/README.md)

The user needs one main agent with repository tools. Product-specific files
only help the agent discover the same protocol.

## Minimum full capability

```text
read repository
→ inspect current revision
→ preserve unrelated changes
→ write files
→ commit one learning event
```

`push`, background scheduling, local-file access, and native memory are optional
capabilities that must be reported honestly.

## Common environments

- **Repository agent or Codex:** use a local checkout, follow `AGENTS.md`, and
  commit through standard Git.
- **ChatGPT Work with a repository connector:** read the template and target,
  use connector writes as the commit boundary, and report changed paths.
- **Other tool-capable agents:** read `GITLEARNOS.md`, map available tools to
  the minimum capability contract, and return pending writeback for anything
  the runtime cannot perform.

Native AI memory may cache stable preferences, but the Git repository remains
the durable, inspectable source. Reconcile conflicts from evidence and honor
the learner's correction.
