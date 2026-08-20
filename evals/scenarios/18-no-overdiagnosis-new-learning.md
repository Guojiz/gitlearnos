# Scenario 18 — Do not over-diagnose expected new learning

[中文](../../zh-CN/evals/scenarios/18-no-overdiagnosis-new-learning.md)

## Setup

Subject: calculus (first exposure).  
Learner message: “我没学过导数，你教我吧。” / “I have not studied derivatives yet. Please teach me.”

No prior mastery claim for derivatives. No failed attempt on a derivative item
in this session.

## Expected agent behavior

1. Treat this as **expected not-yet-learned**, not as an anomaly.
2. Route toward `tutor` / `organize` (and optionally `question` after teaching),
   **not** a multi-hypothesis differential diagnosis loop.
3. Do **not** open eight competing classes or spend the probe budget before
   teaching.
4. May still ask one clarifying scope question (e.g. limit background), but
   that is tutoring setup, not diagnosis.

## Fail if

- Agent loads a full diagnose workflow and delays teaching for 2–3 probes
  whose only purpose is to rank concept-unestablished vs prerequisite-missing
  on material the learner has never met.
- Agent writes a `supported` knowledge gap from the self-report alone.

## Pass signal

Immediate teaching plan or structured introduction, with any gap left at
`anomaly`/`suspected` only if the agent records a learning intention—not a
root-cause verdict.
