# Demo: SAT Prep Lite

This is a fictional English demo for GitLearnOS.

It shows how a student preparing for the SAT can use one Git repository and one
AI tool to turn practice results into models, review sets, delayed checks, and
a dashboard.

No real College Board material, private score report, or copyrighted question text is included.

## Main goal

```text
Improve SAT Reading and Writing accuracy in 6 weeks by turning repeated mistakes into reusable models.
```

## Current weak points

- Vocabulary in context questions are inconsistent.
- Rhetorical synthesis questions take too long.
- Grammar mistakes repeat because only the answer is reviewed.
- Old mistakes fade before the next full practice test.

## How the repository handles one mistake

```text
practice result
→ source record
→ mistake pattern
→ reusable model
→ review prompt
→ next review date
→ dashboard update
```

## This demo includes

```text
gitlearnos.yml
AGENTS.md
learning-policy.md
learner-profile.md
subjects/english/goals/main-goal.md
subjects/english/sources/practice-source-record.md
subjects/english/models/vocabulary-in-context-model.md
subjects/english/reviews/2026-07-03_review-set.md
dashboard.md
```

## What this demo shows

GitLearnOS can support standardized test preparation without storing copyrighted test questions.

It records source status, extracts reusable patterns, marks the next review
date, and generates practice prompts from cleaned mistake models. No background
scheduler is implied.
