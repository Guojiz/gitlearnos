# Public Alpha

> Historical v1 release note. For v2 behavior and status, use
> [GITLEARNOS.md](GITLEARNOS.md) and [README.md](README.md).

GitLearnOS is an early, usable personal learning control layer for one tool-capable main agent. Organization, question generation, automation, and templates will continue to evolve from real use.

The repository was renamed from `Repo-as-Review-OS` to `GitLearnOS`.

## Ready to test

- direct one-main-agent paths for capable ChatGPT Chat or Work sessions and repository agents;
- one repository with automatic routing to `subjects/<subject>/` folders;
- cross-channel input from teachers, class, paper, platforms, and AI;
- automatic organization, linking, deduplication, and external-feedback reconciliation;
- personalized diagnostic, variation, transfer, review, and teacher-handoff questions;
- learner-controlled write modes through `safe-auto`, `preview`, and `manual`;
- immediate writeback and on-handoff checks;
- source, profile, model, gap, handoff, review, and activity templates;
- separate resolution and mastery state;
- optional evidence-based 0–3 scoring for suitable subjects;
- a Chinese demo from teacher handoff through feedback sync to generated verification.

## Try it

```text
Use https://github.com/Guojiz/GitLearnOS as the GitLearnOS template.
Target repository: <private repository>
Subject: <subject>
Learning goal or current input: <content>

Read GITLEARNOS.md and START-HERE.md and use safe-auto. Organize automatically,
generate targeted questions when useful, and actually write safe changes.
Do not default to an AI tutoring session. Report changes, evidence, actual
automation, next action, and undo capability. Keep shared configuration at the root
and subject-specific state under subjects/<subject>/.
```

## Still experimental

- question format and difficulty adaptation across subjects;
- long-term accuracy of deduplication and state linking;
- the best default verification after external feedback;
- whether 0–3 intervals fit every learning goal;
- provider-neutral adapters for the two required recurring jobs;
- longer-term portability evidence.

## Product boundary

GitLearnOS emphasizes cross-channel use, learner ownership, and low deployment cost. It does not claim to be a full tutoring platform. The original `zhongkao` repository remains the practical baseline.

## Safety

Use a private target repository by default. Keep copyrighted originals, private screenshots, teacher originals, credentials, and sensitive identity out of the public template. Automation must be visible, low-risk, and policy-compliant.
