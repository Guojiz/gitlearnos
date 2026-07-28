# Migrating to GitLearnOS v2

[中文](MIGRATION-v2.zh-CN.md)

GitLearnOS v2 is a gradual migration, not a destructive rewrite. New work
should follow [GITLEARNOS.md](GITLEARNOS.md); existing learner evidence may
move only when links and history can be preserved safely.

## What changed

| Before | v2 |
|---|---|
| GitHub treated as the operating core | local or hosted Git is the core; GitHub is one adapter |
| behavior repeated across many documents | `GITLEARNOS.md` is the single protocol |
| root-level subject files | `subjects/<subject>/...` |
| `sessions/` | `events/` containing useful learning events, never full chat logs |
| `repo-as-review-os*` Skills | replace references with `gitlearnos*` Skills |
| universal confidence and 0–3 scoring | optional subject-level evaluation |
| reminder text treated as automation | only verified execution counts as completed |

## Safe migration order

1. Commit or otherwise preserve the current repository state.
2. Add `gitlearnos.yml`, `learning-policy.md`, and a root dashboard if missing.
3. Choose one active subject and route all new state to
   `subjects/<subject>/`.
4. Move old files only when their links can be updated and checked.
5. Keep original answers, notes, and teacher feedback unchanged. Add linked
   corrections instead of replacing them.
6. Move useful records from `sessions/` to `events/`; leave chat transcripts
   out of the durable state.
7. Replace Skill references with `skills/gitlearnos*/`; old Skill names are not
   part of v2.
8. Run the relevant scenarios in `evals/` before calling the migration
   complete.

Old and new paths may temporarily coexist. Do not perform a bulk move merely
to make the tree look clean.

## Git hosting

An existing Git repository does not need to move. It simply becomes one
hosted Git target. The same protocol also works with GitLab, Gitea, another
standard remote, or a local repository with no remote.

## Completion check

A migrated repository passes when one real learning event can be organized,
questioned, answered, written back, and reverted without fabricating evidence,
mastery, scheduler execution, or remote access.
