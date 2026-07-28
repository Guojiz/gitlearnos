# Getting Started

Use [QUICKSTART.md](../QUICKSTART.md) for the complete first request.

## Keep two repositories separate

```text
GitLearnOS template
→ protocol, Skills, adapters, templates, examples, evaluations

learner repository
→ private goals, evidence, questions, answers, feedback, current state
```

Never place personal learning state in the public template.

## First setup

1. Give a write-capable agent the template and a local or remote target.
2. Give it one subject, goal, or real learning event.
3. Let it detect actual read, write, Git, source, and scheduler capability.
4. Let it create only the minimum files needed now.
5. Check the receipt and Git commit.

The minimum useful target is:

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

Git does not preserve empty folders. Sources, models, gaps, handoffs, reviews,
and events appear only on first real use.

## Capability boundary

Local write access is enough for the complete core loop. It does not imply
remote push, GitHub Issues, or scheduler access. The agent must distinguish
local writes, commits, pushes, and background execution in its receipt.

See [Git adapters](../adapters/git/README.md) and
[Migration](../MIGRATION-v2.md).
