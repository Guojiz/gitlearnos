# GitLearnOS Evaluation

[中文](../zh-CN/evals/README.md)

GitLearnOS is evaluated through documented learning scenarios, not exact text
matching. A human, an AI agent, or an optional skill-evaluation system may run
the same cases.

Each scenario defines:

1. initial state;
2. learner input;
3. required behavior;
4. forbidden behavior;
5. observable evidence.

Passing means the repository and receipt satisfy every required invariant. The
question wording, filenames, and prose may vary when links and ownership remain
clear.

## Core scenarios

- [Bootstrap from one request](scenarios/01-bootstrap.md)
- [Organize useful notes](scenarios/02-organize-notes.md)
- [Reconcile teacher feedback](scenarios/03-teacher-feedback.md)
- [Generate a due review](scenarios/04-due-review.md)
- [Write back an independent answer](scenarios/05-answer-writeback.md)
- [Avoid fabrication and duplicates](scenarios/06-no-fabrication.md)
- [Run without GitHub](scenarios/07-local-git.md)
- [Adapt to constrained-access SAT study](scenarios/08-constrained-access-sat.md)
- [Recognize an implicit learning event](scenarios/09-implicit-learning-event.md)
- [Use GitHub for teaching collaboration](scenarios/10-github-teaching-collaboration.md)
- [Continue without Skills](scenarios/11-no-skill-continuity.md)
- [Verify cross-agent Skill installation](scenarios/12-cross-agent-skill-install.md)
- [Route and verify optional RAG-Anything](scenarios/13-rag-anything.md)

These scenarios are the v2 acceptance gate. OpenSpace, a database, a vector
index, RAG-Anything, and a particular Git host are not required.
