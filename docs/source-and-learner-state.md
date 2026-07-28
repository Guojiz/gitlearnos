# Source and Learner State Model

GitLearnOS should use plain project terms instead of borrowed research labels.

The core split is simple:

```text
source layer
→ project or local materials, source records, models, evidence, Git history

learner state layer
→ learner-profile.md, knowledge gaps, review results, dashboard, memory notes
```

These are ordinary implementation terms for this repository. They are not copied platform components and should not be presented as if GitLearnOS implements another tutoring system.

## Source layer

The source layer is the part that should stay grounded and inspectable.

In GitLearnOS, it usually includes:

```text
ChatGPT Project Sources or another persistent project file area
+ local textbooks / PDFs / screenshots / original files
+ sources/
+ models/
+ knowledge-gaps/
+ source-status records
+ Git history
```

This layer answers:

```text
What material is this based on?
Which source did the AI use?
Which concept or problem model was extracted?
Which knowledge gap was found?
Can the learner inspect the evidence?
```

Persistent project sources or external folders may keep the full textbook or
original file. In ChatGPT, the Project **Sources** area is the preferred home
for large materials that should be reusable across Chat and Work conversations.
The chosen Git repository keeps source records, selected excerpts, summaries,
model cards, knowledge-gap records, and links.

## Learner state layer

The learner state layer changes as the learner studies.

In GitLearnOS, it usually includes:

```text
learner-profile.md
+ knowledge-gaps/
+ reviews/
+ dashboard.md
+ automations/ when the runtime supports them
+ native AI memory when available
```

This layer answers:

```text
What is the learner trying to do now?
What knowledge gaps are active?
What explanation style works better?
What has improved?
What should be reviewed next?
```

## Active and passive relation

Native AI memory is active. It may surface automatically.

The Git repository is passive. The AI must read or search it.

Local files are protected source material. The AI should not pretend it has read them unless it actually has access.

```text
native memory
→ active preference cache

project sources
→ large shared materials across related conversations

Git repository
→ passive but inspectable source of truth

local folders
→ protected original source layer

learner-profile.md
→ bridge between active memory and passive repository state
```

## Personalized practice

Personalized practice should come from the learner's actual repository state, not from a generic quiz template.

Default input:

```text
recently split models
+ active knowledge gaps
+ learner-profile.md
+ source records
+ review schedule
```

Default output:

```text
small practice set
+ answer
+ explanation
+ linked source/model/gap/profile entry
+ next review date
```

## Closed loop

GitLearnOS keeps the loop simple:

```text
source
→ split into model
→ identify knowledge gap
→ generate practice
→ learner result
→ update learner-profile.md
→ schedule next review
→ refine future questions
```

This is the core learning loop. It can run in ChatGPT, Claude, a single-context AI tool, Codex, or a local agent as long as the tool respects the repository state and its actual permissions.

## Rule

Do not make this heavier than necessary.

The repository should stay readable. The learner should be able to open the files and understand why the AI made a decision.
