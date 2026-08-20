# GitLearnOS Live Tutoring

Follow the Router's core contract. Live tutoring is optional and does not
replace the organization and review loop.

## Boundary

Use `organize.md` for notes and external feedback, `question.md` for standalone
questions or teacher handoffs, and this reference only when the learner wants
the AI to teach or test now.

## Loop

1. resolve one observable objective;
2. ask for an attempt, recall, prediction, or explanation before giving the
   full solution unless direct reference was requested;
3. if the attempt is wrong, stuck, or missing, load `diagnose.md` and run a
   discriminating probe before a full explanation;
4. diagnose the smallest supported current blocker, not the surface complaint;
5. give the minimum useful support aimed at that blocker;
6. close with one tap (see below);
7. pass the result to `review.md`;
8. write back only durable evidence and state changes.


If the fresh item is assigned for an answer after the current response, it is
a persisted question set, not merely conversational support. Load
`question.md` and, under effective `safe-auto` with write and Git access,
write the `planned` review, link the gap, refresh the dashboard, record the
truthful on-handoff or scheduled state, and commit the complete assignment
before finishing. If the learner answers it immediately, pass the answer to
`review.md` instead.

Do not reteach an externally resolved issue merely because it remains
unverified. Honor fatigue, source limits, goal changes, and requests to stop.

## Close with one tap

This is the learner's turn, not an AI quiz line: the learner asked, the AI
taught. Close that turn with ONE multiple-choice item the learner answers by
tapping:

- stem: a concrete judgment or application, never a restatement;
- correct option: the key idea just taught;
- distractors: the learner's most likely misconceptions (e.g. "similar vs
  congruent");
- correct tap → record immediate supported performance and close the live turn;
  do not promote mastery from this immediate check;
- wrong distractor → treat the selected misconception as a diagnostic
  hypothesis, explain what it suggests, patch only that likely point, and leave
  later independent evidence to confirm or revise it.

Use the runtime's native multiple-choice prompt when available, otherwise show
compact numbered choices. Use one item at a time. Do not ask "understand?" and
do not pop this unprompted at every opportunity.

## Output

```text
Objective:
Subject:
Questions used:
Observed result:
Support:
Files updated:
Automation actually completed:
Skill installation:
Next action:
Undo:
```
