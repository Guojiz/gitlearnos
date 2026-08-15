# Demo: SAT Prep Lite

This is a runnable fictional English demo for GitLearnOS and the AceSAT
Education AI-Agent: Build for Impact challenge.

It shows how a student preparing for the SAT can use one Git repository and one
AI tool to turn practice results into models, review sets, delayed checks, and
a dashboard.

No real College Board material, private score report, or copyrighted question text is included.

The fictional learner has limited mobile data, uses a shared phone, studies in
20-minute blocks, and does not have continuous paid tutoring. These stable
constraints are stored in `learner-profile.md`; authorization, privacy, RAG,
and automation configuration live in `gitlearnos.yml`.

To run the interaction rather than only inspect the completed state, use the
repository-level [live demo](../../../LIVE-DEMO.md).

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
→ preserved learning event
→ source record
→ evidence-linked knowledge gap
→ reusable model
→ one accessible review prompt
→ next review date
→ dashboard update
```

## This demo includes

```text
gitlearnos.yml
AGENTS.md
learner-profile.md
subjects/english/goals/main-goal.md
subjects/english/events/2026-07-03_practice-result.md
subjects/english/sources/practice-source-record.md
subjects/english/knowledge-gaps/vocabulary-in-context.md
subjects/english/models/vocabulary-in-context-model.md
subjects/english/reviews/2026-07-03_review-set.md
dashboard.md
```

## What this demo shows

GitLearnOS can support standardized test preparation without storing copyrighted test questions.

It records source status, extracts reusable patterns, marks the next review
date, and generates practice prompts from cleaned mistake models. The agent
takes bounded action instead of only answering a question: it selects the next
task, writes durable state, and decides what requires later evidence.

No background scheduler, measured school impact, free AI access, or fully
offline AI execution is implied.
