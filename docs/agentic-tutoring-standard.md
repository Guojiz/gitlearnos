# GitLearnOS Evaluation Standard

GitLearnOS is evaluated as a learner-owned, cross-channel control layer for one external main agent.

The standard is not feature parity. It is whether the toolkit organizes real learning, generates useful questions, automates durable state, and preserves user control at low deployment cost.

## Capability direction

Ask:

1. Are learning outputs grounded in accessible sources?
2. Does learner state evolve from interaction evidence?
3. Do weak points drive adapted questions?
4. Do results affect future behavior?
5. Is personalization inspectable?
6. Can skills extend the workflow?

Add GitLearnOS-specific questions:

7. Can learning happen with teachers, paper, platforms, and AI without platform lock-in?
8. Can one main agent coordinate the workflow?
9. Can the learner inspect, override, and undo automation?
10. Can subject-specific state be routed into `subjects/<subject>/` without making the learner manage paths?

## Acceptance tests

### A. One-message capture

Given “my teacher resolved this; here are my notes,” the agent:

- finds the existing goal and gap;
- records provenance and privacy correctly;
- updates resolution without inventing mastery;
- retires obsolete AI teaching;
- schedules verification only under learner policy;
- reports changed files.

Fail if the learner must name paths or repeat the event in several forms.

### B. Automatic organization

New notes, mistakes, feedback, and platform results are classified, linked, deduplicated, and turned into a clear next action.

Fail if organization means copying everything into new files or producing a pretty summary disconnected from state.

For repeated mathematics or science errors, automatic organization must
preserve the learner's original judgment, distinguish evidence from diagnostic
hypothesis, link same-pattern observations, and promote a reusable model only
from sufficient evidence. The promoted model must contain recognition cues,
an answer structure, limits or traps, and a fresh transfer check.

Fail if the system merely copies a problem and answer, invents a cause, creates
a model from one ambiguous occurrence, or treats model creation as mastery.

### B1. Subject routing

The agent infers the subject, writes subject-specific state under `subjects/<subject>/`, keeps shared policy at the root, and asks only when an incorrect write is plausible. A learner correction immediately overrides the inference.

Fail if the learner must choose folders, every subject becomes a separate repository, or empty subject trees are created in advance.

### B2. School and self-study balance

School deadlines, teacher constraints, and assessment formats remain visible without erasing learner-chosen self-study goals. Shared concepts reuse one model and evidence history. Policy can reserve self-study time and change priorities during exam weeks.

Fail if the repository becomes only a homework queue or, conversely, ignores explicit school obligations.

### B3. Diverse learning needs

The same toolkit supports course follow-up, remediation, exams, advanced study, open exploration, projects, research, and practical skills by changing task form and evidence contract.

Fail if every goal becomes a worksheet, every result uses 0–3 regardless of fit, or open-ended work is forced into a knowledge-gap lifecycle.

### C. Targeted question generation

Every generated set links to a goal, source/model, gap, and purpose. It records difficulty, time, answer or rubric, and novelty. The format fits the subject.

Fail if questions are generic, random, duplicate a demonstration, reveal answers prematurely, or cannot be scored.

### D. Teacher handoff

The system creates a usable external question pack containing the problem locator, learner attempt, exact blocker, and requested feedback. Returned feedback reconciles into source, gap, model, and dashboard state without forced AI reteaching.

### E. Automation contract

- `safe-auto` performs low-risk, reversible work without repeated confirmation;
- `preview` and `manual` behave as declared;
- repeated input is idempotent;
- each completed write has a receipt;
- prompts and dates are not misreported as scheduled automation;
- learner deployment assigns an IANA time zone and explicit recurring local
  times to both `maintenance` and `due-review`;
- deployment automation is complete only after both real scheduler entries and
  one observed repository-capable test run of each;
- no-work occurrences skip silently without filler, notification, or commit;
- scheduled writers use occurrence idempotency, a writer lock, and a checked
  Git base revision;
- one event is atomic and undoable when the runtime supports it.

### F. User control

The learner can say “record only,” “do not store this,” “no review,” “always link teacher feedback,” or “undo the last update” and the agent obeys within safe technical limits.

Destructive, visibility, privacy, secret, and policy-changing actions require approval.

### G. Optional AI tutoring

When requested, the system can run:

```text
observable objective
→ learner attempt
→ diagnosis
→ adaptive support
→ fresh verification
→ evidence score
→ writeback
```

Fail if AI tutoring is forced for organization or externally resolved work.

### H. Evidence integrity

- resolution and mastery are separate;
- reported, source-supported, and demonstrated evidence remain distinct;
- generated questions are not marked complete before an attempt;
- exposure or self-report alone does not create score 3;
- contradictory evidence adjusts confidence rather than erasing history.

### I. Source integrity

Full, excerpt, summary-only, local-only, missing, and uncertain sources remain distinct. The agent never invents unavailable source content. Public examples contain only safe fictional data.

### J. Lightweight deployment

The basic control layer must not require a custom server, database, vector store, GitHub Actions, API key beyond the chosen AI runtime, desktop agent, multi-agent orchestration, or copying the entire template.

## Automation levels

| Level | Required behavior |
|---|---|
| immediate | process the current event and actually write state |
| on handoff | inspect due work, inbox, and waiting feedback when an agent resumes |
| background | require real recurring `maintenance` and `due-review` tasks with repository access, explicit local times and IANA time zone, plus verified test runs |

Interactive learning can operate at the first two levels. A learner deployment
must nevertheless configure and verify the background level; until then its
automation status is `incomplete`, never silently downgraded to on-handoff.

## Product quality levels

### Level 0 — archive

Files exist, but goals, provenance, and next actions are unclear.

### Level 1 — organized state

Inputs connect to goals, sources, gaps, and dashboard.

### Level 2 — question engine

The system generates purposeful, grounded, scoreable questions from learner state.

### Level 3 — automated cross-channel continuity

Teacher feedback, paper notes, platform results, AI work, and review outcomes reconcile automatically with transparent writeback and user control.

### Level 4 — adaptive continuity

Repeated evidence changes question selection, difficulty, support, scheduling, and learner models while remaining traceable.

The main demo should meet Level 3 before the public alpha claims Level 4.

## Non-goals

GitLearnOS does not claim to be a full tutoring platform. It succeeds when the learner can report a real event once, receive useful organization or questions, and retain control of the resulting durable state.
