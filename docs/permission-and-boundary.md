# Permission and Boundary Model

This page explains the permission boundary for GitLearnOS.

For the runtime setup flow, also read [Runtime Self-Adaptation](runtime-self-adaptation.md) and [Local Runtime Note](local-runtime-note.md).

GitLearnOS should start by asking one question:

**What can the AI actually read and change without asking again?**

A review system fails when the AI does not understand its permission boundary.

## 1. Permission levels

### Level 0: no repository access

The AI can only explain the idea and give instructions. It cannot inspect or edit files.

### Level 1: read-only repository access

The AI can inspect the repository and suggest changes, but cannot write files.

### Level 2: write access to one target repository

The AI can create and edit files in one selected repository. This is the recommended default.

### Level 3: broad account access

The AI can reach many repositories or connected services. This is powerful but risky. Avoid this unless there is a strong reason.

### Level 4: local workspace access only

The AI can read and write local files, but this does not automatically mean it can update GitHub.

It must not claim GitHub setup, push, Issues, or remote repository updates unless it has verified those actions.

## 2. Recommended default

Use Level 2:

- one target repository;
- read and write access;
- no account-wide permission by default;
- no secret access;
- no destructive operations.

This gives the AI enough power to work smoothly while keeping the boundary clear.

## 3. Low-friction operation

To reduce repeated permission clicks, the user should:

1. create or choose one target Review OS repository;
2. authorize the AI tool for that repository;
3. allow normal file creation and editing inside that repository;
4. require a report after changes;
5. keep destructive actions blocked.

## 4. Actions the AI may do without asking

If it has write access to the selected repository, the AI may:

- create missing docs;
- create templates;
- update indexes;
- mark incomplete files as `todo`;
- add cleaned examples;
- update dashboards;
- record what changed.

## 5. Actions that require confirmation

The AI must ask before it:

- deletes files;
- changes repository visibility;
- force pushes;
- uploads local private files;
- publishes real study records;
- changes license;
- touches secrets, tokens, cookies, or credentials.

## 6. Runtime honesty rule

The AI must say what it can actually do.

It should not say that a GitHub action has happened unless it can verify it in the repository.

Acceptable wording:

```text
I can edit local files, but I do not have GitHub write access here.
```

```text
I can read this repository, but I need you to grant write access before I can update files.
```

```text
I updated these files in the target repository: ...
```

## 7. Single-AI model

This project assumes one main AI, such as ChatGPT, acts as the maintainer.

Do not require a multi-agent workflow. Other tools may exist, but the main model should be able to read the repository, make decisions, edit files, and report changes.

## 8. What cannot be made fully invisible

Some actions will always need user confirmation because platforms protect the user:

- first-time GitHub connection;
- repository permission grant;
- high-risk writes;
- local file access;
- publishing or changing visibility.

The goal is not zero permission prompts. The goal is to set one clear repository boundary so normal maintenance does not require constant approval.
