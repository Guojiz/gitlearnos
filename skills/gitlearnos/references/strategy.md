# GitLearnOS Learning Strategy

Follow the Router's core contract. `GITLEARNOS.md` outranks this reference,
and every strategy. A strategy is editable, derived state about how the agent's
assistance changes this learner's independent performance. It binds to agent
behavior only, never to learner behavior.

Three record kinds stay distinct:

- a **model** teaches the learner how to solve the task (subject method);
- the **learner profile** records what the learner is and can access (state and
  constraints);
- a **strategy** records what the agent should do differently because of who
  this learner is (a plan).

A strategy is a plan, not a state. It is a bet the agent places on how to
assist, and later outcomes can falsify it. Profile observations do not work
this way: they are read from evidence and grow stale rather than wrong. Keep
that difference in the record structure below.

## What belongs here

Promote a claim into a strategy only when all three hold:

1. it is about the agent's delivery, support, probing, scheduling, or
   interaction — not the subject matter;
2. it could be wrong and later evidence could show it (falsifiable);
3. acting on it now would change one or more concrete next actions.

Exclusions (route them instead):

- a method for solving tasks in the subject → `models/`;
- device, time, data, language, or access conditions → the profile's
  constraint notes (these are state, not plans, and are not falsifiable);
- a one-off situation, mood, or temporary request → event or nothing.

## Strategy test

A useful strategy answers:

- Which agent action does this change, through which hook and value?
- Under what observable conditions does it apply, and when does it not?
- Is its basis a stated preference or inferred from outcomes?
- What evidence currently supports it, linked to which records?
- What result would weaken or reverse it, and has that result been checked?
- For inferred strategies: which delayed independent check is planned?

## Scope and layering

Every strategy lives at exactly one scope, written once, at the layer where it
actually applies. Do not copy one strategy into several subjects.

Placement test — ask **"does this still hold in a different subject?"**

- **Yes → learner scope.** It is about how this person is assisted regardless
  of subject (for example "one item at a time", "let them try before hinting").
  Store it as a structured entry inside `learner-profile.md`, so the learner's
  current state and their cross-subject assistance plan are one inspectable
  whole.
- **No → subject scope.** It only holds within one subject (for example
  "predict the blank before viewing choices" for vocabulary-in-context, "sketch
  before setting up the equation" for math). Store it as its own file under
  `subjects/<subject>/strategies/<slug>.md`.

Goals stay under `subjects/<subject>/goals/` and are not merged into either
strategy scope.

### Precedence

Read learner-scope active strategies first, then the active subject's
strategies. **Subject scope overrides learner scope. Keep one active winner per
hook per delivery.** If both layers set the same hook, the subject value wins
for that subject; the learner value still applies wherever no subject strategy
sets that hook.

Do not create a subject strategy just to fill the layer. If a rule is genuinely
cross-subject, write it once at learner scope; do not replicate it per subject.

## Stable identity

Every strategy — whether a `learner-profile.md` entry or a subject file —
carries a stable `id` (`strat-<slug>`), integer `version`,
`status: draft | active | archived`, and `basis: stated | inferred`. IDs never
change when prose or a path is revised. Optional relation fields follow the
`models/` vocabulary: `supersedes`, `superseded_by`, `conflicts`, `depends_on`.

A learner-scope entry inside `learner-profile.md`:

```yaml
# under a "## Assistance strategies" section; one block per strategy
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

A subject-scope file `subjects/<subject>/strategies/<slug>.md` uses the same
fields with `scope: subjects/<subject>` in its front matter.

A learner-scope entry is written by `learning_apply` (`kind: strategy`,
`scope: learner`) as exactly this entry body, wrapped in a sentinel comment pair
`<!-- gitlearnos:strategy id=<id> -->` … `<!-- /gitlearnos:strategy -->` inside a
fenced `yaml` block under the `## Assistance strategies` heading. The sentinels
let the tool append a new entry or replace one `id` in place without regenerating
the whole profile, so neighboring observations and other strategies stay
byte-for-byte intact. You supply only the entry body; never hand-edit the
sentinels or rebuild the section by hand. The merge is refused if
`learner-profile.md` has uncommitted local edits; Git is the history, rollback,
and audit layer, so no entry-level checksum is kept.

`check_after_deliveries` is an integer count of deliveries the strategy
constrained; `check_after_event` is a named condition. Both are optional, and
at least one should be set for a stated strategy because it has no outcome
evidence by construction.

Keeping the file merged (learner scope) while each entry keeps its own
`status`/`version` preserves both properties the learner asked for: one
inspectable whole to read, and per-entry revise/archive so a falsified plan can
degrade without touching the stable profile observations around it.

## Hooks are a closed vocabulary

A strategy may bind only to these hooks, and only to their listed values.
Free-text hooks are not allowed: derived state must not become an instruction
channel.

| hook | agent decision changed | example values |
|---|---|---|
| `delivery` | how much and in what form content arrives | `one-item-per-turn`, `batch-then-stepwise`, `plain-text-first`, `summary-then-detail` |
| `support` | what help is offered, and when | `hide-choices-until-prediction`, `probe-before-hint`, `no-answer-until-asked` |
| `probing` | which discriminating probe is picked first | `prefer-qualitative-probe`, `start-with-recognition-cue` |
| `scheduling` | review spacing and session shape | `short-sessions`, `daily-fresh-item`, `retest-before-new-material` |
| `interaction` | tone and turn-taking during live help | `ask-learner-reasoning-first`, `one-question-per-reply` |

A strategy that would need a value outside these lists is either a protocol
change (propose it as such) or not a strategy. Adding a value requires a
protocol version bump, not a per-learner edit.

## Promotion basis

Two different gates; never mix them.

**`basis: stated`.** The learner or a teacher explicitly contributes how they
should be assisted. A stated strategy may be created as `active` in one
commit. Its promotion evidence is the quote and its record link. It requires
no outcome observations, and the learner can revoke it with one sentence,
which sets `status: archived` with the revocation linked. Because it is
unverifiable by design, set a `check_after_*` condition: confirm it softly on
the first delivery it constrains, and record any exception.

**`basis: inferred`.** The agent found a repeated support–outcome pattern.
Inferred strategies are created as `draft`. A `draft` strategy never changes
agent behavior on its own; the agent may propose one in `preview` mode
(proposing is not applying). Promote to `active` only with at least two linked
independent observations where the hooked behavior differs from its
alternative, or a teacher or authoritative source contributes the mechanism.
Do not count repeated copies of one event, one session, or one restated answer
as independent support. Record `promotion_evidence` (event/review links),
`promotion_reason`, and a planned delayed independent `transfer_check`. An
unresolved blocking `conflicts` entry keeps the strategy `draft`.

Drafting an inferred candidate is itself gated: create the entry only when the
hooked action is currently chosen differently and the difference matters for a
real upcoming delivery. If the behavior already flows from a model's method or
a profile constraint, the strategy adds no lever — do not create it.

## Workflow

```text
recurring maintenance run (pattern reconciliation only)
→ scan linked events and reviews for support conditions that differ
→ compare performance under each condition; keep competing readings
→ candidate falsifiable claim with a named hook and value
→ does the hook change an actual next action? no → leave in event or model notes
→ does it hold across subjects? yes → learner scope (profile entry)
                                   no → subject scope (subjects/<subject>/strategies/)
→ stated contribution? → active with quote evidence
→ otherwise → draft, plan the next delivery that tests it
→ later independent result → promote, revise, or mark conflicting
```

Every learning event should already preserve the support actually used
(prompts, hidden items, wait time). If repeated events omit support records,
that is an evidence-quality gap in the event discipline, not a reason to guess
a strategy.

## Evidence boundary

- A strategy being `active` never proves it works on the current item. Only
  outcome records (`event`, `review`) can change mastery state; strategies
  never write `demonstrated`, scores, or receipts.
- A stated strategy records the learner's request, not a diagnosis; do not
  upgrade it into a claim about ability.
- When an outcome contradicts an `active` inferred strategy, do not silently
  delete or only downrank: append the record to `conflicts`, set `draft`, ask
  the learner at most one confirmation question when appropriate, and keep the
  history visible. `falsified` applies to hypotheses; strategies degrade to
  `draft` or `archived` with links.
- The agent may apply at most the `active` set for the current scope, and must
  say so in one short line when a delivery visibly changes because of a
  strategy ("one item at a time — say if you want the rest").

## Trim and archive

Archive a strategy when any holds: the learner revokes or contradicts a stated
one; an inferred one fails its planned transfer check and two later
deliveries; a strategy's hook stops being reachable because the underlying
model or constraint covers it; an archived-subject cleanup leaves no live
link. An `active` strategy that changes no action across its
`check_after_deliveries` count goes back to `draft` with a note. Do not stack
strategies per hook: keep one active winner per hook and scope; the newest
evidence or the more specific scope wins, and the loser archives with a
`superseded_by` link.

## Output

```text
Strategy created / promoted / revised / archived:
Basis: stated | inferred
Hook(s) and values:
Scope: learner (profile entry) | subjects/<subject>
Promotion evidence and reason:
Conflicts / superseded_by:
Planned next check (inferred only):
Files updated:
```
