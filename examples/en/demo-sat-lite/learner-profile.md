# Learner Profile

## Active goal

- [Improve vocabulary in context](subjects/english/goals/main-goal.md)

## Evidence-backed observation

- Context-clue selection needs further independent checking; see the linked
  review records.

No broader learner trait is inferred from this small fictional example.

## Assistance strategies

```yaml
- id: strat-one-thing-at-a-time
  version: 1
  status: active
  basis: stated
  scope: learner
  hooks:
    delivery: one-item-per-turn
    support: wait-for-response-before-next
  applies_when: any assigned question, review delivery, or explanation step sequence
  does_not_apply_when: the learner asks for more at once, or explicitly revokes
  promotion_evidence:
    - subjects/english/events/2026-07-03_practice-result.md
    - subjects/english/reviews/2026-07-03_review-set.md
  promotion_reason: explicit learner contribution ("give me one thing at a time"); delivery already follows it in the linked review set
  conflicts: []
  check_after_deliveries: 4
  check_after_event: first contradicting outcome
```

This entry records what the agent should do differently, not what the learner is.
It is a stated, falsifiable plan: the learner can revoke it in one sentence, and
a contradicting outcome moves it back to `draft` with the record linked. See
`skills/gitlearnos/references/strategy.md`.
