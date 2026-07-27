# Scenario 01: Bootstrap

## Initial state

An empty learner-owned Git repository and one write-capable main agent.

## Learner input

```text
Use GitLearnOS. My first subject is mathematics. I want to improve geometry.
```

## Must

- detect real repository and Git capability;
- create only `gitlearnos.yml`, the thin agent entry, policy, dashboard,
  profile, and the active mathematics goal;
- use `safe-auto` unless the learner requests another mode;
- leave one concrete next action;
- commit the setup and report changed paths.

## Must not

- ask the learner to create folders or commit;
- create empty folders for every possible record type;
- claim background scheduling without a scheduler.

## Evidence

The minimum files exist, link to one another, and one reversible Git commit
contains only the bootstrap event.
