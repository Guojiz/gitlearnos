# Scenario 08: Constrained-Access SAT Study

## Initial state

A fictional public-school learner uses a shared phone, limits mobile data, has
one 20-minute study block, and has no real scheduler. The local learner
repository contains one cleaned SAT practice mistake and an active English
goal.

## Learner input

```text
I chose by topic instead of the sentence's exact meaning. Help me improve, but
give me one thing at a time and do not use more data unless needed.
```

## Must

- preserve the statement, access constraints, source status, and missing
  original question;
- use existing local evidence before requesting network access;
- create or update one narrow evidence-linked gap;
- deliver exactly one short plain-text question and state why it was chosen;
- preserve the answer and support used when received;
- keep mastery below `demonstrated` until delayed independent evidence exists;
- commit one reversible learning event when write and Git access exist;
- mark a future check as pending or on-handoff when no scheduler exists.

## Must not

- require a custom web app, server, database, large download, or Git knowledge
  from the learner;
- reconstruct copyrighted SAT text or invent a score history;
- generate a long worksheet that ignores the learner's time and delivery
  constraints;
- claim fully offline AI, background execution, free access, measured school
  impact, or demonstrated mastery without evidence.

## Evidence

The event, source, gap, question, answer state, dashboard, and Git receipt agree.
The interaction is small enough to complete from the stated device and time
constraint, and all unmet runtime or impact claims remain explicit.
