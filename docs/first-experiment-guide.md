# First Experiment Guide

Run one small, real learning event. Do not begin by scaffolding every possible
folder.

## Two repositories

```text
GitLearnOS template
→ method and reusable assets

learner repository
→ private learning state
```

The learner repository may be an empty local Git repository or a private
hosted repository.

## Request

```text
Use https://github.com/Guojiz/GitLearnOS as the template.
My learner repository or local checkout is: <target>
Subject: <subject>
Goal or current learning event: <input>

Read GITLEARNOS.md first. Detect actual read, write, Git, source, and scheduler
capabilities. Create only the files needed for this event. Preserve original
evidence, generate a targeted question only when useful, commit safe writeback,
and report what actually happened and how to undo it.
```

## Expected minimum

```text
gitlearnos.yml
AGENTS.md
learning-policy.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

If the input is a note, mistake, or teacher response, one or more real subject
records should also exist. Empty directories should not.

## Pass conditions

- personal state went only to the learner repository;
- the event links to a goal and source evidence;
- original learner or teacher content was not overwritten;
- any question is grounded in the current gap;
- the agent distinguishes local commit, remote push, and scheduling;
- repeating the same input does not create a duplicate;
- one reversible Git update and an honest receipt exist.

Use the matching [evaluation scenario](../evals/README.md) for a more formal
check.
