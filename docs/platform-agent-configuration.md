# Agent Runtime Configuration

Configure GitLearnOS by capability, not by brand hierarchy.

## Required contract

The one active main agent should follow:

```text
one target repository and learning-policy
→ notice implicit learning events
→ organize any learning channel
→ generate targeted questions
→ automate safe writeback
→ separate resolution from mastery
→ one explicit next action and receipt
```

## Capability matrix

| Runtime capability | Configuration |
|---|---|
| repository and connected-source tools | direct execution; verify then write |
| repository checkout and file tools | follow local instructions and preserve worktree |
| native memory but no write access | organize or teach; return pending writeback |
| no stable memory or files | one focused task from pasted state |

## ChatGPT example

```text
state: private Git target repository
behavior: AGENTS.md or project instructions; router Skill when available
sources: large files in Project Sources; connected files/apps only when authorized
memory: activation pointer and stable preference cache only
writeback: canonical target files
```

Use Chat for routine questions, answers, note photos, and feedback when it has
repository access, even if Skills are unavailable. Use Work for guided setup,
large imports, multi-file organization, and maintenance. The agent should use
available tools directly and should not ask the learner to reproduce operations
it can safely perform.

## Repository-agent example

Codex, Claude Code, Cursor, or a similar agent can run GitLearnOS directly when it is the chosen active runtime. It should read repository instructions, inspect existing changes, and use the same learning evidence standard.

## One-main-agent standard

ChatGPT Chat, Work, and comparable tool-capable runtimes can organize, generate
questions, teach when needed, write, and verify in one workspace when their
actual tools permit it. Do not decompose these responsibilities into agents. A
real scheduler may extend background execution, but canonical state remains in
the target.

## Memory instruction

```text
Use the target repository as canonical GitLearnOS state. Use native memory for the GitLearnOS activation pointer, target, stable preferences, and durable patterns. Notice useful learning events without waiting for an explicit Skill invocation. When memory and repository evidence conflict, inspect timestamps and update the stale layer explicitly.
```

## Honest reporting

Always report actual read/write/source access. A drafted prompt is not an automation; a proposed patch is not a repository update; a generated question set is not learner evidence until attempted.
