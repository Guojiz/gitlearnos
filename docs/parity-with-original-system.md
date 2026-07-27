# Parity with the Original Learning Repository

This comparison is non-normative. [GITLEARNOS.md](../GITLEARNOS.md) defines v2
requirements.

The original `zhongkao` repository is GitLearnOS's practical implementation baseline. It tests whether the lightweight file workflow remains useful in real study.

## Behaviors that must survive

1. one durable learner-owned repository with subject folders;
2. honest separation of source, summary, and missing material;
3. mistakes transformed into reusable recognition models;
4. old items returning after time passes;
5. a dashboard that produces one concrete next action;
6. another capable agent able to resume from inspectable state;
7. local/private material protected by default;
8. small, readable files that the learner can understand.

## Behaviors strengthened in GitLearnOS

The reusable toolkit adds explicit:

- cross-channel capture from teachers, class, paper, platforms, and AI;
- automatic organization, linking, and deduplication;
- personalized learner questions and external help-seeking packs;
- learner-owned automation policy and transparent writeback receipts;
- separate question-resolution and mastery states;
- learner-profile evidence links;
- optional knowledge-gap types and confidence when evidence supports them;
- learner attempt before mastery claims;
- hint-level tracking;
- optional 0–3 observable evidence scoring for suitable subjects;
- transfer and delayed-recall checks;
- deterministic next-review dates;
- selective event writeback.

## What Git alone cannot supply

Git does not organize by itself, generate questions, inspect unavailable
originals, run an AI model, or guarantee background execution. One active main
AI runtime supplies those capabilities when authorized.

## Parity test

The template passes practical parity only when a learner can complete this loop without building a new platform:

```text
material, mistake, or external feedback
→ automatic organization and linking
→ targeted learner questions or a teacher handoff
→ feedback or learner result
→ reusable state
→ automatic writeback and next action
```

Folder creation alone is not parity.
