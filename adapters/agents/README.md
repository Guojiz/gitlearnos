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

`push`, background scheduling, local-file access, project sources, Skills, and
native memory are optional capabilities that must be reported honestly.

## Common environments

- **Repository agent or Codex:** use a local checkout, follow `AGENTS.md`, and
  commit through standard Git.
- **ChatGPT Chat with verified repository tools:** use it for everyday
  questions, answers, notes, images, and feedback. Do not depend on Skills;
  project instructions, `AGENTS.md`, memory, and the event itself must activate
  the workflow.
- **ChatGPT Work with a local project or repository connector:** use it for
  setup, large imports, multi-file organization, and maintenance. Use standard
  Git or connector writes as the commit boundary and report changed paths.
- **Other tool-capable agents:** read `GITLEARNOS.md`, map available tools to
  the minimum capability contract, and return pending writeback for anything
  the runtime cannot perform.

Native AI memory should cache the activation pointer, target, and stable
preferences when available, but the Git repository remains the durable,
inspectable source. Reconcile conflicts from evidence and honor the learner's
correction.

## Portable activation order

Use every supported layer, but depend on them in this order:

```text
repository AGENTS.md or durable project instructions
→ native memory activation pointer
→ optional router Skill
→ current learner input
```

The first layer preserves mandatory behavior. Memory helps a new conversation
notice the system. Skills refine a workflow but are not required. If a platform
has neither automatic instructions nor memory, explain that the learner must
start from the project/repository or provide a short activation prompt.

Large textbooks, PDFs, scans, and media belong in the platform's persistent
project source area or an authorized local source folder. Git stores compact
state, source locators, selected evidence, and history.
