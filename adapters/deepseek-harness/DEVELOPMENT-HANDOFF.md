# GitLearnOS × DeepSeek Harness Development Handoff Card

[中文](../../zh-CN/adapters/deepseek-harness/DEVELOPMENT-HANDOFF.md)

## Mission

Take ownership of the next stage of GitLearnOS development on the official
DeepSeek Harness.

Do not treat this card, the current adapter, or the existing roadmap as a
feature specification. Study both systems in full, use the running product,
identify the highest-leverage opportunities and weaknesses yourself, and make
the development decisions that best advance the product's learning purpose.

## Product intent

GitLearnOS should make a capable main agent materially better at noticing,
organizing, revisiting, and acting on real learning evidence while keeping the
learner in control of durable state. DeepSeek Harness should be used for its
native strengths rather than as a place to copy prompts or reproduce another
agent environment.

The result should feel native, useful, and distinct. Technical novelty matters
only when it improves the learning loop, reduces learner effort, or makes the
system more truthful, observable, and dependable.

## Authority

You may independently research, design, implement, refactor, test, and document
changes inside this public template. Choose the scope and order from evidence.
You may use subagents and the Harness's own extension surfaces when they offer
real leverage.

Do not wait for a predetermined feature list. Ask the maintainer only when a
decision requires new authority, exposes private data, changes publication or
visibility, incurs an exceptional external cost, or cannot be resolved through
the repositories and official documentation.

## Non-negotiable invariants

- Read `AGENTS.md` and `GITLEARNOS.md` completely before changing anything.
- The learner's Git repository remains the formal, inspectable learning truth.
- One main agent owns learning decisions; helpers, retrieval, workflows, and UI
  do not become competing authorities.
- Answering the learner's immediate need comes before repository administration.
- Evidence, interpretation, mastery, and external-system status remain clearly
  distinguishable.
- Never claim a write, commit, retrieval, ingestion, scheduled run, delivery,
  or learning result without direct evidence.
- Preserve the setup gate, effective write authority, privacy boundaries,
  reversible Git behavior, modality limits, and honest automation semantics.
- Do not weaken Harness security or turn `safe-auto` into unrestricted approval.
- Do not send learner material, credentials, or private state to an unapproved
  service. Use synthetic fixtures for development and evaluation.
- Preserve unrelated work. English is canonical; keep required Chinese reading
  pairs aligned.

## Working method

Begin from the current checked-out and installed reality, not from assumptions.
Inspect the official Harness version, its lifecycle and extension contracts,
the current GitLearnOS adapter, evaluation evidence, and known failures. Use
official upstream sources for unstable behavior.

Actively survey the existing DeepSeek Harness ecosystem on GitHub before
building from scratch. Relevant maintained plugins, bundles, tools, examples,
infrastructure, and adjacent open-source projects may be reused, composed,
adapted, or improved upstream when that produces a stronger result. Treat
ecosystem discovery as engineering work: verify compatibility against the
installed Harness version; inspect source, license, maintenance state,
security and data boundaries, dependency and installation cost, overlap with
GitLearnOS, and real runtime behavior. Pin what is integrated, preserve
attribution, and test the assembled system. Popularity or apparent fit alone
is not sufficient evidence, and integration must not weaken the invariants in
this card.

Form your own product hypothesis. Test it against realistic learner behavior,
including cases where the user does not name GitLearnOS and where the agent
must decide that no GitLearnOS operation is appropriate. Prefer the smallest
coherent product increment that proves the hypothesis, but do not mistake a
thin wrapper, prompt-only change, mocked success, or documentation promise for
native development.

Treat failures as product evidence. Fix what the evidence supports, rerun the
relevant evaluation, and keep any unresolved limitation explicit rather than
optimizing the report for a passing label.

## Definition of a valid handback

Return only after the work has a reviewable implementation and proportional
verification. The handback must state:

- the product judgment you made and why;
- what changed, with exact paths and version boundaries;
- what was exercised in the real Harness rather than only mocked;
- the observable evidence, including failures and unchanged-state checks;
- the safety, privacy, cost, and compatibility consequences;
- what remains unknown or deliberately deferred;
- the commit, publication state, rollback boundary, and next decision.

Do not report “fully adapted,” “native,” “installed,” or “passed” as a general
impression. Tie every such statement to a defined scope and reproducible
evidence.

## Starting evidence

The repository, its Git history, the installed Harness profile, and existing
evaluation artifacts are starting evidence—not instructions about what to
build. Verify that they are current before relying on them.
