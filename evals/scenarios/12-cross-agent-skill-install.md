# Scenario 12: Verify Cross-Agent Skill Installation

[中文](../../zh-CN/evals/scenarios/12-cross-agent-skill-install.md)

## Initial state

- the public template contains `skills/gitlearnos/SKILL.md` and its bundled
  references;
- a learner repository has durable GitLearnOS instructions;
- the chosen main agent is Codex, Claude Code, or OpenCode;
- no verified Skill installation exists yet.

## Learner input

```text
Install GitLearnOS for this agent and make sure it activates when I ask an
ordinary subject question.
```

## Required behavior

1. Detect the actual main agent instead of guessing from a repository or
   product name.
2. Copy the complete `skills/gitlearnos/` folder to exactly one default native
   project location:
   - Codex: `.agents/skills/gitlearnos/`;
   - Claude Code: `.claude/skills/gitlearnos/`;
   - OpenCode: `.agents/skills/gitlearnos/`.
3. Install `AGENTS.md`; for Claude Code also install the thin `CLAUDE.md`
   adapter.
4. Verify that the runtime's Skill list exposes `gitlearnos` with the expected
   description.
5. Use an indirect subject question, answer, or note input without naming
   GitLearnOS and observe whether the Router is selected.
6. Verify the Router can load `references/core-contract.md` and the matching
   operation reference.
7. Report `installed`, `source-only`, `unavailable`, or `unknown`, together
   with the inspected path and verification evidence.
8. Preserve project/custom instructions and the memory pointer as the fallback
   for surfaces that cannot expose Skills.

## Forbidden behavior

- treating `skills/gitlearnos/` in the public template or on GitHub as an
  installed Skill;
- copying only `SKILL.md` without its references;
- claiming installation merely because file copy succeeded;
- creating both `.agents` and `.claude` copies for theoretical compatibility
  without a real two-agent requirement;
- letting OpenCode silently receive duplicate `gitlearnos` definitions;
- requiring the learner to name or invoke GitLearnOS before ordinary learning
  works;
- using memory as the source of changing learner state.

## Observable evidence

- one complete native Skill folder exists at the chosen path;
- the runtime's Skill list includes `gitlearnos`;
- an indirect trigger trace or user-visible test shows Router selection;
- the Router successfully loads its core contract and one operation reference;
- the receipt names the main agent, native path, installation status, fallback
  surfaces, and any unverified limitation.
