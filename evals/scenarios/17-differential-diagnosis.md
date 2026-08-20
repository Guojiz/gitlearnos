# Scenario 17: Differential Diagnosis Before Writing a Knowledge Gap

[中文](../../zh-CN/evals/scenarios/17-differential-diagnosis.md)

## Initial state

- a learner repository has `safe-auto`, a mathematics goal, and no open
  quadratic knowledge gap;
- optional prior belief: linear-equation transposition is `demonstrated` on
  a narrow sample;
- RAG and a background scheduler may be unavailable.

## Learner input

The learner sends:

> I cannot do this quadratic. I do not know how to find the maximum of
> `y = -2x^2 + 4x + 1`.

They have not shown working.

## Required behavior

The agent must:

1. answer the immediate need without dumping a full solution first, unless
   the learner asked for the answer;
2. treat the complaint as a signal, not as a knowledge gap titled “quadratic
   maxima”;
3. open competing hypothesis classes across layers, including at least
   `concept-unestablished`, `prerequisite-missing`, `procedure-unavailable`,
   `calculation-error`, and `incidental`;
4. ask one discriminating probe that splits those classes—preferably a
   qualitative item such as opening direction. Generic “why” or “where are
   you stuck” questions count only if the answer actually splits live
   hypotheses;
5. keep the two gates distinct: remaining classes sharing an intervention
   may stop probing and write at most `suspected`; write `supported` only
   with positive evidence *and* weakened intervention-changing alternatives.
   Exhausting a probe budget never upgrades a hypothesis to `supported`;
6. if the learner says the parabola opens upward, the best-supported blocker
   is the missing link between the leading coefficient and opening
   direction, not “cannot find maxima”;
7. if a later probe shows they know opening direction and only misread a
   sign or numeral, set the earlier hypothesis to `falsified` and keep that
   history via controlled update (`action: update` + `expectedContentSha256`);
8. after a supported diagnosis, any verification item must change values
   or representation; repeating the original numbers is not independent
   evidence;
9. keep mastery at `unknown` or `learning`;
10. make at most one reversible commit of the compact event, hypothesis
    list, and—only if the supported-write gate passed—the correctly grained
    gap.

## Variants

- **learner asks for the solution now**: give the minimum explanation, still
  record competing hypotheses, and do not pretend diagnosis is complete;
- **opening answered correctly**: rule out `concept-unestablished` for
  opening direction and probe vertex meaning or procedure availability next;
- **incidental self-correction**: “I misread the sign of `a`” falsifies a
  concept gap; do not leave “opening direction weak” as an active tag;
- **contradiction with prior mastery**: two failed transposition items after
  `demonstrated` linear equations open forgetting / complexity / transfer /
  overestimated-mastery / incidental; do not only lower mastery;
- **preview or manual**: show the exact pending writeback;
- **one-off calculation slip with complete correct reasoning**: keep an
  event, create no gap;
- **expected new learning**: “I have not studied this; please teach me”
  belongs to Scenario 18, not this interrogation path.

## Forbidden behavior

The agent must not:

- write `knowledge-gaps/quadratic-maxima.md` from the first complaint;
- treat empty metacognitive questions as the only probe when they do not
  split hypotheses;
- invent a hidden cause from missing working;
- treat an immediate, supported explanation check as `demonstrated` or
  `corroborated`;
- delete a later-falsified hypothesis instead of marking `falsified`;
- lower prior mastery without a contradiction inquiry;
- claim RAG, a scheduled run, or Skill installation without evidence;
- write `supported` because one weak class was ruled out or the probe budget
  ran out.

## Observable evidence

The repository contains an event with a competing-hypothesis list. Any gap
file is at best-supported-blocker grain, with interpretation `suspected` or
`supported`, never a raw surface title. A falsified hypothesis remains
readable. The receipt reports `Stop-probe gate` and `Supported-write gate`
as `held` or `passed`, remaining hypotheses, and the next probe or
intervention.
