# Getting Started

Use [QUICKSTART.md](../QUICKSTART.md) for the one canonical setup prompt.

## Keep the boundaries clear

```text
GitLearnOS template
→ protocol, Skills, adapters, templates, examples, evaluations

learner repository (default: private)
→ goals, evidence, questions, answers, feedback, current state

Project Sources or an authorized local source folder
→ large textbooks, PDFs, scans, media, and references
```

Never place personal learning state in the public template. A remote Git host
is optional; add one only for chosen backup, synchronization, review,
collaboration, or publishing.

## Core-ready setup

1. Give a write-capable agent the template, a private local or remote target,
   and one subject, goal, or real learning event.
2. Let it read the protocol, ask for the learning goal, subject, and current
   material, recommend local RAG, and wait before learner deployment.
3. Let it detect actual read/write, Git, source, memory, Skill, and scheduler
   capability, then create only the minimum files.
4. Test with an ordinary question or note that does not name GitLearnOS.
5. Check the receipt: changed files, evidence, current-agent work, background
   work actually verified, and the undo boundary.

The learner should not manage folders or commits. `safe-auto` permits only
safe, reversible writeback; `preview` proposes; `manual` waits for approval.

## Immediate versus background

The current agent can answer, organize evidence, and commit an immediate
learning event when authorized. `maintenance` and `due-review` are external
recurring jobs. A reminder, Harness session schedule, or requested task is not
proof that a scheduled main-agent run exists or happened. If the scheduler cannot be
verified, keep interactive learning usable and report automation as incomplete.

## Optional retrieval

Put large materials in Project Sources or an authorized local folder. A local
RAG layer is recommended for substantial durable material but may be declined.
RAG-Anything is the first supported implementation, not a mandatory service.
Git remains the formal source of truth and the main agent remains the decision
maker.

See [Git adapters](../adapters/git/README.md) and
[Migration](../MIGRATION-v2.md).
