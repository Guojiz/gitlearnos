# Skill, Memory, and State

GitLearnOS separates behavior, durable state, and temporary context.

```text
Skill or repository rules
→ how the agent should behave

Target repository
→ current inspectable learning state

Native AI memory
→ optional activation pointer and cache for stable preferences and durable patterns

Current chat or workspace
→ temporary active work
```

## Tool-capable Chat or Work path

When a Chat or Work conversation can read sources and write to the target
repository:

1. recognize whether the input is a candidate learning event;
2. load the router when available or use canonical repository/project rules;
3. inspect only active target state;
4. answer the immediate request;
5. organize input or generate targeted questions directly when useful;
6. write policy-authorized state changes to canonical files;
7. update native memory only when the activation pointer, a stable preference,
   or a durable pattern changed.

Do not make native memory the only copy of learner state. Do not make the user manually copy files the authorized runtime can update.

## Skill path

Start with:

```text
skills/gitlearnos/SKILL.md
```

Then load one focused subskill. Skills store behavior, not changing personal state.

Use one main agent. Loading different skills does not imply separate agents.

Skills are optional. If the active Chat surface does not expose them,
`AGENTS.md`, project instructions, memory, and event recognition must preserve
the same behavior.

## Repository-instruction path

If custom skills are unavailable, use `START-HERE.md` and `AGENTS.md` as the executable contract. Do not compensate by loading every documentation file.

## Native memory

Good candidates:

- stable language and explanation preferences;
- long-term goals;
- durable privacy constraints;
- repeated patterns supported by multiple observations;
- the chosen target-repository rule;
- the fact that GitLearnOS is active and should notice implicit learning events;
- the active project/repository pointer.

Keep out by default:

- one-off errors;
- due dates and temporary tasks;
- raw private notes;
- incomplete sources;
- unverified hypotheses;
- full review history.

## Conflict rule

When memory and repository state disagree:

1. inspect timestamps and evidence;
2. identify which layer is stale;
3. update it explicitly;
4. record unresolved uncertainty instead of silently choosing a convenient version.

## Fallback

In a single-context or read-only environment, provide only the files needed for
one task and return a pending writeback block. Long-term continuity resumes
after that block is written to the target repository. Large source files remain
in the persistent project source area or authorized local folder.
