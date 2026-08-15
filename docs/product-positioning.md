# Product Positioning

GitLearnOS is a lightweight control protocol for one capable, replaceable
main AI agent and one learner-owned Git repository. Its core promise is simple:

```text
organize real evidence
→ ask from the current gap
→ preserve the answer or external feedback
→ verify later, independently
→ commit the next state
```

The learner gets a durable, inspectable record without turning learning into
another app or asking them to operate Git. The protocol connects teachers,
books, practice platforms, projects, peers, and AI; it does not replace them.

## Core-ready boundary

Required:

- one main agent that can really read and write;
- one private local or hosted Git repository;
- the GitLearnOS protocol and durable project instructions;
- one subject, goal, or real learning event.

GitHub is an optional remote, not a core dependency. A database, vector index,
server, multi-agent runtime, custom app, live tutoring, and scheduler are also
optional. Default to private state and ask before publishing, inviting others,
or pushing sensitive material.

## Operating boundary

The current agent answers first and may perform a safe, reversible write under
`safe-auto` when evidence, target, goal, and privacy are clear. `preview`
returns the exact proposal; `manual` requires approval. A recurring
`maintenance` or `due-review` is a scheduled invocation of the same main agent and is complete
only after a real repository-capable scheduler is observed running it.

## Harness and retrieval layers

The DeepSeek Harness adapter is a Developer Preview with code-backed bounded
status, routing, one `gitlearnos.yml`-authorized learning transaction, and a read-only agent-
maintained queue panel with five conversation actions. Its fuller learning
cockpit is a target direction, not a claim that current code supplies RAG,
cold-session scheduling, or autonomous ranking. DeepSeek's default provider is
text-only, while Harness can use either a configured third-party multimodal
model or a vision/OCR bridge plugin chosen by the user.

Local RAG-Anything is the first recommended retrieval implementation, but it
is optional. Git remains the formal source of truth; RAG is rebuildable and
holds authorized long-lived material. The same main agent owns decisions.

See [GITLEARNOS.md](../GITLEARNOS.md) and the single canonical prompt in
[Quickstart](../QUICKSTART.md).
