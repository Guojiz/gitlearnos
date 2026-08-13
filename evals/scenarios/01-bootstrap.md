# Scenario 01: Bootstrap

## Initial state

An empty learner-owned Git repository and one write-capable main agent.

## Learner input

```text
Use GitLearnOS. My first subject is mathematics. I want to improve geometry.
```

## Must

- detect real repository and Git capability;
- create only `gitlearnos.yml`, the thin agent entry, policy, automation state,
  dashboard, profile, and the active mathematics goal;
- assign the learner's IANA time zone and explicit recurring times for
  `maintenance` and `due-review`, using the documented defaults if accepted;
- when a repository-capable scheduler exists, create both jobs and verify each
  with a real safe test; otherwise record them as requested and report
  deployment automation `incomplete`;
- use `safe-auto` unless the learner requests another mode;
- leave one concrete next action;
- commit the setup and report changed paths.

## Must not

- ask the learner to create folders or commit;
- create empty folders for every possible record type;
- claim background scheduling without a scheduler.

## Evidence

The minimum files exist, link to one another, and one reversible Git commit
contains only the bootstrap event. `automation.md` distinguishes requested,
configured, verified, and unavailable state without inventing a scheduler.
