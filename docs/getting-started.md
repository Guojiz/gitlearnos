# Getting Started

Use [QUICKSTART.md](../QUICKSTART.md) for the complete first request.

## Keep two repositories separate

```text
GitLearnOS template
→ protocol, Skills, adapters, templates, examples, evaluations

learner repository
→ private goals, evidence, questions, answers, feedback, current state

project sources or local source folder
→ large textbooks, PDFs, scans, media, and reference files
```

Never place personal learning state in the public template.

## First setup

1. Ask a write-capable agent to guide setup one necessary step at a time.
2. Select a persistent project/source area and place large learning files there.
3. Give it the template, a local or remote Git target, and one subject, goal, or
   real learning event.
4. Let it detect actual Chat/Work/agent, memory, instructions, Skills, read,
   write, Git, source, and scheduler capability.
5. Let it create only the minimum files and configure durable activation.
6. Test setup with a normal learning question or note that does not name
   GitLearnOS.
7. Check the receipt and Git commit.

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

GitHub is optional for the core loop, but useful for private backup,
cross-device continuity, teacher review, shared course materials, and group
work. Keep shared materials separate from private learner state.

See [Git adapters](../adapters/git/README.md) and
[Migration](../MIGRATION-v2.md).
