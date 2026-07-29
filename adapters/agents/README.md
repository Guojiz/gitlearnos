# Agent Adapter

[中文](../../zh-CN/adapters/agents/README.md)

The user needs one main agent with repository tools. Product-specific files
only help the agent discover the same protocol.

## Minimum full capability

```text
read repository
→ inspect current revision
→ preserve unrelated changes
→ write files
→ commit one learning event
```

`push`, background scheduling, local-file access, project sources, Skills, and
native memory are optional capabilities that must be reported honestly.

## Common environments

- **Repository agent or Codex:** use a local checkout, follow `AGENTS.md`, and
  commit through standard Git.
- **ChatGPT Chat with verified repository tools:** use it for everyday
  questions, answers, notes, images, and feedback. Do not depend on Skills;
  project instructions, `AGENTS.md`, memory, and the event itself must activate
  the workflow.
- **ChatGPT Work with a local project or repository connector:** use it for
  setup, large imports, multi-file organization, and maintenance. Use standard
  Git or connector writes as the commit boundary and report changed paths.
- **Other tool-capable agents:** read `GITLEARNOS.md`, map available tools to
  the minimum capability contract, and return pending writeback for anything
  the runtime cannot perform.

## Skill discovery by agent

The repository's [`skills/gitlearnos/`](../../skills/gitlearnos/) folder is the
canonical distributable source. It is not automatically installed merely
because it exists in the template.

| Agent | Durable project instructions | Native project Skill path | GitLearnOS default |
|---|---|---|---|
| Codex | `AGENTS.md` | `.agents/skills/gitlearnos/` | copy the complete Skill folder there |
| Claude Code | `CLAUDE.md` → `AGENTS.md` | `.claude/skills/gitlearnos/` | add the thin `CLAUDE.md` adapter and copy the complete Skill folder |
| OpenCode | `AGENTS.md` | `.agents/skills/gitlearnos/`, `.claude/skills/gitlearnos/`, or `.opencode/skills/gitlearnos/` | prefer `.agents/skills/gitlearnos/` |
| ChatGPT surface without repository Skills | project/custom instructions | account or surface dependent | install project instructions and memory pointer; report Skill unavailable |

This mapping follows the current product documentation:

- [Codex Build skills](https://learn.chatgpt.com/docs/build-skills.md) documents
  repository discovery under `.agents/skills/`;
- [Claude Code Skills](https://code.claude.com/docs/en/skills) documents
  project Skills under `.claude/skills/`, automatic relevant invocation, and
  direct `/skill-name` invocation;
- [OpenCode Agent Skills](https://opencode.ai/docs/skills) documents native
  `.opencode/skills/` plus compatibility with both `.agents/skills/` and
  `.claude/skills/`;
- [OpenCode Rules](https://opencode.ai/docs/rules/) loads project
  `AGENTS.md` and uses `CLAUDE.md` only as a fallback.
- [Claude Code memory](https://code.claude.com/docs/en/memory) documents the
  `@AGENTS.md` import used by the thin Claude adapter.

### What differs in practice

- **Claude Code** uses `CLAUDE.md` as its project instruction entry when that
  file is present. GitLearnOS uses Claude Code's documented `@AGENTS.md` import
  instead of duplicating the rules. A project Skill is listed from
  `.claude/skills/`; Claude may select it from its description or the learner
  may invoke `/gitlearnos`. The Skill body and bundled references load only
  when used.
- **OpenCode** puts discovered Skill names and descriptions in its native
  `skill` tool. The agent chooses a Skill by calling that tool, and OpenCode
  permissions may allow, ask, deny, or hide it. `AGENTS.md` wins over
  `CLAUDE.md`, while all three documented project Skill directories are
  scanned.
- **Codex** uses `AGENTS.md` for repository instructions and the open
  `.agents/skills/` location for project Skills. The same folder is therefore
  the cleanest shared default for Codex and OpenCode.

GitLearnOS needs no MCP server or plugin for these core behaviors. MCP remains
an optional adapter when a learner wants external services; the portable
behavior is the Skill folder plus durable project instructions.

GitLearnOS deliberately uses one installable Skill with on-demand references.
Do not install all operation references as separate Skills: doing so expands
the initial metadata list and makes several descriptions compete for the same
event.

### Verification

After copying the complete folder, verify rather than infer:

1. inspect the active runtime's Skill list and find `gitlearnos`;
2. confirm its displayed description matches
   [`SKILL.md`](../../skills/gitlearnos/SKILL.md);
3. use an indirect learning input without naming GitLearnOS;
4. confirm the selected Skill can load `references/core-contract.md` and the
   matching operation reference;
5. report `installed`, `source-only`, `unavailable`, or `unknown`.

A file visible in GitHub or present under the template's top-level `skills/`
is only `source-only`. It becomes `installed` only after native discovery is
observed.

Native AI memory should cache the activation pointer, target, and stable
preferences when available, but the Git repository remains the durable,
inspectable source. Reconcile conflicts from evidence and honor the learner's
correction.

## Portable activation order

Use every supported layer, but depend on them in this order:

```text
repository AGENTS.md or durable project instructions
→ native memory activation pointer
→ optional router Skill
→ current learner input
```

The first layer preserves mandatory behavior. Memory helps a new conversation
notice the system. Skills refine a workflow but are not required. If a platform
has neither automatic instructions nor memory, explain that the learner must
start from the project/repository or provide a short activation prompt.

Large textbooks, PDFs, scans, and media belong in the platform's persistent
project source area or an authorized local source folder. Git stores compact
state, source locators, selected evidence, and history.
