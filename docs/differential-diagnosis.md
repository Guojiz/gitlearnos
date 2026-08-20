# Differential Diagnosis

[中文](../zh-CN/docs/differential-diagnosis.md)

GitLearnOS already records evidence, updates state, and retests. That is not
enough. An agent that writes the first complaint into a knowledge gap will
mis-model the learner. An agent that only “likes to ask follow-ups” will
stop doing so when the model changes.

Differential diagnosis is therefore protocol, not personality.

The canonical rules live in [GITLEARNOS.md](../GITLEARNOS.md) and
[skills/gitlearnos/references/diagnose.md](../skills/gitlearnos/references/diagnose.md).
This page is the human explanation.

## The upgraded loop

Old, incomplete loop:

```text
evidence → knowledge gap → practice → review → update
```

Required loop when the signal is an error, a stuck attempt, or a clash with
prior mastery:

```text
signal → hypotheses → probe → best-supported diagnosis → intervention → independent check → revise
```

## Why the first label is usually wrong

A learner says: “I cannot find the maximum of this quadratic.”

A weak agent records: knowledge gap = quadratic maxima.

A better agent asks where they are stuck, then still records the same gap if
they say “I do not know how to find the maximum.”

The actual cause may be any of:

- no stable link between the leading coefficient and opening direction;
- no image of a vertex;
- forgotten vertex formula;
- arithmetic;
- misread language;
- an incidental slip.

Until those are split, the surface complaint is not a knowledge gap.

## What a good probe looks like

Not: “Why don’t you understand?”

Yes: “For `y = -2x^2 + 4x + 1`, do not compute. Does this parabola open up
or down?”

If the learner says up, “cannot find the maximum” was the symptom. The
best-supported diagnosis is the missing link between `a` and opening direction.
That is what may be written.

If they answer down correctly, opening is provisionally ruled out; the next
probe should split vertex meaning from formula memory from calculation.

About 1–3 such items is a default strategy, not a conversation style or a
hard invariant. Stop probing when remaining hypotheses share the next
intervention, the learner asks to be taught, or further probes will not pay.

## Write barrier

There are two gates. Stop probing when remaining alternatives share an
intervention. Write `supported` only when a specific hypothesis has positive
evidence *and* alternatives that would change the teaching action are
weakened. Shared intervention or an exhausted probe budget never upgrades a
label to `supported` by themselves.

Incidental slips stay events. Retracted hypotheses stay in the record as
`falsified`. Deleting a wrong tag is worse than leaving a denied one.

## Contradiction is a scientific event

If the repository previously treated linear equations as well mastered, and
the learner now fails two transposition items, the agent must not only lower
a score. It should ask whether this is forgetting, extra complexity,
parameters, an over-optimistic prior sample, or a bad day—then probe once.

Mastery is a belief with a duty to seek disconfirming evidence.

## Related files

- Protocol: [GITLEARNOS.md](../GITLEARNOS.md)
- Skill: [diagnose.md](../skills/gitlearnos/references/diagnose.md)
- Gap template: [templates/knowledge-gap.md](../templates/knowledge-gap.md)
- Eval: [evals/scenarios/17-differential-diagnosis.md](../evals/scenarios/17-differential-diagnosis.md)
