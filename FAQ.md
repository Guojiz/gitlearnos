# FAQ

## What is GitLearnOS?

GitLearnOS is a Git-native learning protocol for one capable AI agent and one
learner-owned repository. It organizes evidence, generates targeted questions,
records answers and external feedback, and keeps each useful update reversible.

It is not a standalone tutoring app or a GitHub-only workflow.

## Is this repository my learning repository?

No. This is the public template: protocol, Skills, adapters, examples, and
evaluations. Personal learning records belong in a separate private repository.

## What do I need?

- an AI agent that can read and write a Git repository;
- a local or remote learner repository;
- one subject, goal, or real learning event.

Start with [QUICKSTART.md](QUICKSTART.md).

## Is GitHub required?

No. Local Git, GitHub, GitLab, Gitea, and other standard Git remotes follow the
same core protocol. GitHub is useful for private backup, cross-device
continuity, teacher or tutor review, shared course materials, and group work.
Keep shared materials separate from private learner state.

## Must I invoke GitLearnOS or a Skill every time?

No. After guided setup, `AGENTS.md` or project instructions provide mandatory
behavior, native memory may provide an active cross-conversation trigger, and
the agent should notice useful questions, answers, photographed pages, notes,
feedback, and results automatically. Skills are optional workflow guides. The
agent should not save incidental conversation.

## Should I use Chat or Work?

Use Chat for everyday learning when the current project/session has verified
repository access. Use Work for setup, large imports, multi-file organization,
maintenance, or substantial review. Capability, Skill availability, and credit
treatment vary by plan and surface, so check the current account rather than
assuming.

## Do I have to upload every source?

No. Put large files, screenshots, books, raw exports, and private working files
in persistent Project Sources or an authorized local source folder. Keep a
source record in Git with an accurate locator, availability, and the part the
agent actually used.

See [Source and learner state](docs/source-and-learner-state.md).

## Does GitLearnOS save chat history?

No. It stores useful learning events and evidence, not ordinary conversation or
hidden reasoning. Original answers, notes, and teacher feedback are preserved;
AI summaries and plans may be revised as evidence changes.

## How is mastery decided?

Reading, completion, immediate imitation, and a teacher resolving a question
do not prove mastery. The minimum states are `unknown`, `learning`, and
`demonstrated`; demonstration requires a later independent answer, plus transfer
when the goal calls for it.

## Does it require a scheduler, server, database, or vector store?

No. These are optional adapters. A scheduler is needed only for true background
execution. Without one, the agent may check due work when it next runs, but it
must not claim that a background task was created or completed.

## What should the first repository contain?

```text
gitlearnos.yml
AGENTS.md
learning-policy.md
dashboard.md
learner-profile.md
subjects/
└── <subject>/
    └── goals/
        └── main-goal.md
```

Other subject folders appear only when real content needs them.

## How can I trust an agent's claims?

Ask for the required receipt: mode, subject, organized evidence, questions,
changed paths, automation actually completed, next action, and undo boundary.
No access, write, push, scheduling, or mastery claim should appear without
verifiable evidence.

## How do I migrate an older repository?

Follow [MIGRATION-v2.md](MIGRATION-v2.md). New files use the subject-folder
model immediately; old paths may move gradually when links can be preserved.
