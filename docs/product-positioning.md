# Product Positioning

GitLearnOS is a lightweight, learner-owned control protocol for one capable,
replaceable AI agent and one Git repository.

It does not replace teachers, schools, books, practice platforms, or the
learner's chosen AI. It connects useful evidence from those channels, generates
the next useful questions, and keeps durable state inspectable and reversible.

## Core promise

```text
organize real evidence
→ ask from the current gap
→ preserve the answer or external feedback
→ verify later, independently
→ commit the next state
```

Success means better later performance, not more generated documents.

## Product boundary

Required:

- one write-capable main AI agent;
- one local or hosted Git repository;
- the GitLearnOS protocol;
- one goal or real learning event.

Optional:

- GitHub, GitLab, Gitea, or another host;
- connected source systems and search;
- a real scheduler;
- databases, vector indexes, OpenSpace, or subject Skills;
- live AI tutoring.

The core does not require a custom app, server, multi-agent framework, or
learner-facing Git work.

## Ownership model

Root files hold shared policy and current views. Subject state lives under
`subjects/<subject>/`. Original answers, notes, and external feedback are
preserved. AI interpretations may change only with linked evidence.

See [GITLEARNOS.md](../GITLEARNOS.md).
