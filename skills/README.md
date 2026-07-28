# GitLearnOS Skills

[中文](../zh-CN/skills/README.md)

One main agent reads `GITLEARNOS.md`, loads the router, and then loads only the
smallest relevant Skill.

```text
gitlearnos              intent router
gitlearnos-setup        bootstrap or migration
gitlearnos-organize     capture, organize, deduplicate, external-feedback sync
gitlearnos-question     learner questions and external question packs
gitlearnos-session      optional live AI tutoring
gitlearnos-source       provenance, availability, privacy
gitlearnos-model        reusable understanding
gitlearnos-review       administer, evaluate, schedule, write back
gitlearnos-maintenance  consistency, automation health, safe undo
```

The core product capabilities are organization, question generation, and
automated writeback. Live tutoring is optional. Responsibilities do not imply
separate agents.
