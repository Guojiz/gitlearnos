# Subject Folder Model

GitLearnOS uses one learner-owned repository with focused subject folders. “Subject library” means a folder, not a separate Git repository.

## Canonical shape

```text
my-gitlearnos/
├── AGENTS.md
├── gitlearnos.yml
├── learner-profile.md
├── dashboard.md
├── goals/                       # optional, only truly cross-subject goals
├── subjects/
│   ├── math/
│   │   ├── goals/
│   │   ├── inbox/
│   │   ├── sources/
│   │   ├── knowledge/
│   │   ├── models/
│   │   ├── knowledge-gaps/
│   │   ├── handoffs/
│   │   ├── reviews/
│   │   └── events/
│   └── english/
└── archive/
```

This is a location model, not a scaffolding command. Git does not preserve empty folders, and the agent creates only the active subject and files needed by the current event.

## Root versus subject ownership

| Root | Subject folder |
|---|---|
| authorization, privacy, and automation configuration | subject goals and constraints |
| stable learner preferences | subject sources, knowledge points, and external feedback |
| cross-subject priority view | models and knowledge gaps |
| truly cross-subject goals | questions, results, handoffs, and activities |

The root dashboard links to subject state. It does not copy that state into a second source of truth.

## Automatic routing

Resolve the subject in this order:

1. explicit user statement;
2. existing linked goal or path;
3. clear subject cues in the material;
4. one short question if ambiguity would change the write location.

Natural-language corrections override the latest route. When one event genuinely spans subjects, choose one primary owner and link the secondary subject instead of duplicating the record.

## Naming

Prefer stable, lowercase slugs such as `math`, `english`, `physics`, or `coding`. Reuse an existing learner convention when it is clear. Ask before renaming broadly.

## Migration

For an existing single-subject repository:

1. identify the active subject;
2. route new state under `subjects/<subject>/` immediately;
3. move old files gradually only when paths and links can be preserved safely;
4. ask before a broad move;
5. leave a short migration note when old and new locations temporarily coexist.

The goal is cleaner context with less maintenance, not a perfect folder tree.
