# Quickstart

[中文](zh-CN/QUICKSTART.md)

## You need

- one AI agent that can read and write a Git repository;
- one local or remote target repository;
- one subject, goal, or current learning event.

The agent may initialize a new local Git repository when its environment
supports that operation. A GitHub account is not required.

ChatGPT Work already provides file and Git operations. For most use, point it
at a persistent local worktree and keep GitHub out of the learning loop. A
remote is only needed when the learner chooses sync, collaboration, backup, or
publishing.

## Send one request

```text
Use https://github.com/Guojiz/GitLearnOS as the GitLearnOS template.
My learning Git repository or local checkout is: <target>
Subject: <subject>
Goal: <goal>
Current material or learning event: <input>

Read GITLEARNOS.md and START-HERE.md first. Use
skills/gitlearnos/SKILL.md when Skills are supported. Detect actual repository,
Git, source, and scheduling capability. Use safe-auto: organize useful
evidence, generate targeted questions when they serve the goal, and commit safe
reversible writeback. Preserve original answers, notes, and external feedback.
Do not store the full conversation or claim mastery without delayed independent
evidence. Finish with changed files, actual automation, the next action, and
the undo boundary.
```

Do not manually create the GitLearnOS folder tree when the agent can do it.

## Minimum first result

```text
AGENTS.md
gitlearnos.yml
learning-policy.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

Only the current subject and real files should exist. Sources, models, gaps,
handoffs, reviews, and events appear on first use.

## Everyday requests

```text
Organize these class notes and give me two fresh questions about the part I
still cannot do.
```

```text
Prepare my unresolved geometry issue as a question pack for tomorrow's tutor.
```

```text
My teacher resolved it. Save this feedback, stop the old reteaching task, and
check me again later with a new problem.
```

```text
Record this only. Do not generate questions or schedule a review.
```

```text
Undo the last learning update.
```

The learner states the event and intent, not repository paths.

## Success check

Setup is working when the agent can:

- identify the active goal, evidence, due work, and one next action;
- explain why a generated question serves the current gap;
- preserve original evidence while revising AI interpretation;
- write and commit safe changes without asking the learner to manage Git;
- say exactly what automation and repository work actually ran;
- complete the same loop in local Git without GitHub.

Without write access, the agent should return exact pending writeback and say
clearly that the repository did not change.
