# Why Git, and When GitHub Helps

This path is kept for old links. GitLearnOS v2 requires Git behavior, not
GitHub.

## Why Git is core

Git gives learning state stable files, change history, reversible updates, and
an explicit version for conflict checks. Those properties make evidence and
AI writeback inspectable without requiring a database or proprietary runtime.

## What GitHub adds

GitHub can add browser access, remote backup, collaboration, pull requests,
Issues, Actions, and convenient AI connectors. These are useful adapter
capabilities, not learning semantics.

## Useful deployment shapes

### Private learner backup

```text
Chat or agent
→ local learner repository
→ private GitHub remote
```

Use this for off-device backup, cross-device continuity, or recovery. Automatic
push is allowed only when policy permits it and the remote is verified.

### Learner and teacher

```text
private learner repository
↔ invited teacher or tutor
→ comments, review, or committed feedback
```

The agent can prepare a focused question pack, preserve the learner's attempt,
and reconcile the returned feedback. The teacher should not need to understand
the entire GitLearnOS structure. Share only the relevant material and remove
access when it is no longer needed.

### Shared teaching materials

```text
shared course repository
→ lessons, assignments, rubrics, public-safe examples

separate private learner repositories
→ personal answers, gaps, feedback, and review history
```

Do not put a class's shared materials and every learner's private state in one
repository. Link a shared source from the learner repository instead of copying
private records back into the course repository.

### Group learning or project work

A shared repository can hold common goals, sources, artifacts, decisions, and
team feedback. Personal mastery evidence remains owned by each learner unless
everyone explicitly chooses a shared record.

### Public examples

Use a separate public repository or public-safe folder for reusable methods and
anonymized examples. Never publish a private learner repository merely to make
sharing easier.

## ChatGPT-specific note

OpenAI's current documentation describes Git operations for local projects and
notes that ChatGPT's everyday interface may hide technical details such as Git
commands. Capability still varies by surface and authorization. A Chat
conversation with verified repository access can run the daily learning loop
without invoking a Skill; Work or Codex may be more suitable for setup,
multi-file maintenance, and visible technical review.

Skills and credit treatment also vary by plan, workspace, and surface. If Chat
does not expose Skills, use project instructions, discovered `AGENTS.md`, and
native memory. If Chat preserves a limited Work allowance in the learner's
current plan, prefer it for short daily interactions, but do not present that
account behavior as a universal product guarantee.

Official references:

- [Projects and chats](https://learn.chatgpt.com/docs/projects)
- [Use ChatGPT](https://learn.chatgpt.com/docs/use-chatgpt)
- [Memories](https://learn.chatgpt.com/docs/customization/memories)
- [Skills and plugins](https://learn.chatgpt.com/docs/skills-and-plugins)

## Privacy and control

Before adding a remote or collaborator:

1. keep the repository private by default;
2. separate large/private originals into Project Sources or local storage;
3. grant the minimum repository access;
4. confirm what will be pushed;
5. record whether a push, invitation, or visibility change actually succeeded.

The same core loop works in local Git, GitLab, Gitea, or another standard Git
host. Never claim a remote push or GitHub action when only a local commit was
verified.

See [Git adapters](../adapters/git/README.md).
