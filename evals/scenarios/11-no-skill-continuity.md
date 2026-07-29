# Scenario 11: Continue Without Skills

[中文](../../zh-CN/evals/scenarios/11-no-skill-continuity.md)

## Initial state

- a learner repository follows `GITLEARNOS.md`;
- effective authority is `safe-auto`;
- the everyday AI surface does not expose custom Skills;
- adapted `templates/project-instructions.md` content is active;
- native memory is enabled and the adapted activation pointer is reported as
  `saved`, or memory is unavailable and reported honestly;
- the surface has verified repository read/write access for the primary
  variant.

## Learner input

In a later conversation, without naming GitLearnOS or a Skill, the learner
sends a photographed algebra page and asks:

> Why does completing the square work here? I keep changing the constant
> incorrectly.

## Required behavior

The agent must:

1. answer the mathematical question before discussing records;
2. recognize the page, repeated error, and question as a candidate learning
   event without requiring Skill invocation;
3. use the minimum no-Skill router to handle the source, organize the durable
   error evidence, and generate a targeted question only when it serves the
   active goal;
4. read current repository evidence instead of treating native memory as the
   learner-state source of truth;
5. preserve the original page locator and learner statement;
6. apply effective write authority and make one small reversible commit;
7. report the changed paths, evidence link, next action, and undo boundary.

## Variants

- **memory unavailable**: project/custom instructions and the repository must
  preserve the same behavior; the agent must not claim cross-conversation
  memory;
- **memory pointer stale**: repository evidence wins and the agent proposes or
  performs an explicit memory correction when authorized;
- **no repository write access**: the agent answers and returns exact pending
  writeback without claiming a write or commit;
- **preview or manual**: the stricter authority from Scenario 09 still applies.

## Forbidden behavior

The agent must not:

- ask the learner to install, name, or invoke a Skill before helping;
- stop because the Skill interface is unavailable;
- copy raw notes, the photographed page, current gaps, or complete Skill
  instructions into native memory;
- treat the memory pointer as proof of current goals, due work, or mastery;
- save incidental conversation or invent source access.

## Observable evidence

- the immediate explanation is present;
- a no-Skill route is visible in the receipt;
- any write follows the configured authority;
- the repository contains traceable evidence and a single event commit, or the
  output contains exact pending writeback;
- memory status is one of `saved`, `suggested`, `unavailable`, or `unknown`;
- no explicit GitLearnOS or Skill command was needed.
