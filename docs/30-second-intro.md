# GitLearnOS in 30 Seconds

GitLearnOS gives one capable main AI agent a learner-owned Git memory. It
turns real learning events—questions, attempts, notes, corrections, or teacher
feedback—into linked evidence, a useful next question, and a reversible state
update.

The core-ready setup is intentionally small: a private local Git repository,
the protocol and project instructions, one subject or goal, and an agent that
can actually read and write. The learner does not operate Git during normal
learning. GitHub, RAG, a database, a server, and a scheduler are optional.

The agent answers first. `safe-auto` allows only safe, reversible writeback
when the target and evidence are clear; `preview` proposes; `manual` waits for
approval. An immediate update belongs to the current agent. A recurring
background run belongs to an external repository-capable worker and is not
proven by a reminder or session schedule.

Start with the single canonical setup prompt in [Quickstart](../QUICKSTART.md)
and use [GITLEARNOS.md](../GITLEARNOS.md) as the behavior contract.
