# Adaptive Rules

GitLearnOS should not treat every rule as fixed.

A learning system changes with the user's goal, time pressure, material quality, current stage, runtime environment, memory capability, and repository access.

## Core idea

Principles are stable. Strategies are adjustable.

Stable principles:

- keep sources traceable;
- do not invent missing material;
- link files to goals;
- report changes;
- protect local material;
- use the chosen Git repository as the durable operating layer;
- use a persistent project/source workspace for large learning materials when
  available;
- keep learner state inspectable;
- record knowledge gaps when they appear, at best-supported-blocker grain,
  after intervention-changing alternatives are ruled out or substantially
  weakened;
- keep falsified hypotheses in the record instead of deleting them;
- adapt to the actual AI environment instead of pretending every tool has the same abilities.

Adjustable strategies:

- how detailed a card should be;
- whether to create a full card now or queue it for later;
- whether to prioritize speed or completeness;
- whether to archive, merge, or rewrite;
- how often to review an item;
- which automation should run first;
- whether to use native memory, project instructions, or only the current context;
- whether the input should trigger GitLearnOS without an explicit invocation;
- whether Chat, Work, or another capable surface is the lightest useful path;
- whether to write back directly to GitHub or produce a handoff card.

## Runtime self-awareness

Before acting, the AI should identify its environment.

```text
What am I?
→ ChatGPT / Claude / Zhipu / Codex / Claude Code / local agent / single-context agent / unknown

What can I access?
→ local Git / hosted Git writeback / hosted Git read-only / pasted excerpts / local files / project sources / no files

What memory do I have?
→ native memory / project instructions / skill memory / external memory / no stable memory

What can activate me in a future conversation?
→ AGENTS.md / project instructions / native memory / Skill / explicit prompt only

What should I avoid claiming?
→ repository updates, local-file reading, long-term memory, or completed automation if unavailable
```

The system should adapt to the answer.

## Adaptive memory and learner profile

Memory is important, but not every platform provides it.

Use `learner-profile.md` as the repository-level memory anchor. Native AI memory
can summarize stable parts of it and actively remind the agent that GitLearnOS
should notice implicit learning events, but the repository remains the source
of truth.

### If the AI has native memory

Examples: ChatGPT memory, Claude memory, or another persistent memory layer.

The AI may store:

- long-term learning goals;
- stable preferences;
- preferred explanation style;
- durable constraints;
- repeated mistake patterns;
- repository operating preferences.
- that GitLearnOS is installed and should consider questions, answers, notes,
  images, feedback, and results without waiting for an invocation;
- the target project or repository pointer.

The AI should not store:

- temporary tasks;
- raw private notes;
- stale knowledge gaps;
- one-off practice results;
- sensitive source details;
- information that is better kept in GitHub history.

### If the AI has project instructions but no real memory

Use project instructions for stable operating rules only.

Do not pretend project instructions are a live learner profile.

Keep changing learner state in GitHub.

### If the AI has only one context window

Use the current context for the current task only.

Do not claim long-term memory.

Ask the user to paste the needed repository excerpts or read them through a tool if available.

Write valuable output back to GitHub manually or through a tool-enabled step.

## Learner profile sync

`learner-profile.md` should be checked during organizer/critic maintenance.

The AI should update it when:

- a major goal changes;
- a knowledge gap is repeatedly observed;
- a knowledge gap is resolved;
- the preferred explanation style changes;
- a new subject becomes active;
- review results show a stable pattern;
- AI memory and GitHub disagree.

Use this rule:

```text
Git learner-profile.md = inspectable source of truth
Native AI memory = compact cache for stable preferences
Project instructions = stable operating rules
Current chat = temporary workspace
```

If native memory and GitHub conflict, trust GitHub first, then suggest updating memory.

Native memory is especially important on a Chat surface that has repository
tools but does not expose Skills. It activates the habit; automatically
discovered `AGENTS.md` and project instructions supply mandatory rules; Git
supplies current evidence.

## Keywords for adaptive routing

These keywords help an AI decide how to run the workflow.

```text
runtime: ChatGPT / Claude / Zhipu / Codex / Claude Code / local-agent / single-context
memory: native-memory / project-instructions / external-memory / none
activation: agents-md / project-instructions / native-memory / skill / explicit-only
access: writeback / read-only / project-sources / pasted-excerpt / local-only / no-file-access
mode: setup / organize / critique / revise / practice / explain / visualize / write / handoff
stage: sprint / building / maintenance
source: complete / excerpt-only / local-only / missing / uncertain
privacy: public-safe / private / sensitive / local-only
output: writeback / handoff-card / user-copy / draft-only
gap: new / repeated / active / resolved / uncertain
```

The AI should use these labels when reporting what it can safely do.

## Stage-aware behavior

The AI should recognize the current stage:

### Sprint stage

When time is short, prioritize useful output over perfect structure.

Create lightweight cards, mark missing parts, and backfill later.

### Building stage

When time is available, expand lightweight notes into full cards, models, knowledge gaps, dashboards, learner profile updates, and review cycles.

### Maintenance stage

When the system is stable, focus on cleanup, review scheduling, learner-profile sync, knowledge-gap cleanup, and detecting stale items.

## Material completeness

If the source is complete, build a full card.

If the source is incomplete, create a queue item and label what is missing.

If the user only remembers a clue, save the clue but do not treat it as a full source.

## Adaptive optimization loop

The repository should improve itself over time.

```text
use
→ observe friction
→ update rules or templates
→ update learner profile
→ record or resolve knowledge gaps
→ generate better practice
→ review results
→ simplify or refine the workflow
```

Optimization should be small and safe. Do not rewrite the whole repository just to make it look cleaner.

## Practical rule

Do not make the repository beautiful at the cost of learning.

The repository exists to serve the user's goal, not itself.
