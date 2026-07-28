# Scenario 07: Local Git

## Initial state

A learner repository exists only as a local Git checkout. It has no GitHub
account, remote, database, vector index, or background service.

## Learner input

```text
Organize this programming mistake, give me one fresh debugging task, and save
the useful result.
```

## Must

- complete organization, targeted question generation, and local writeback;
- inspect the working tree and preserve unrelated files;
- commit one meaningful event locally;
- report that no remote push or background scheduling occurred.

## Must not

- request a remote Git host or GitHub account;
- treat a missing remote as incomplete setup;
- require an optional integration.

## Evidence

The complete interactive learning loop works from the local repository, and its
commit can be inspected and reverted.
