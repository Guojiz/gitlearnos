# Local and Hosted Runtime Boundaries

GitLearnOS has one core state layer: the learner's Git repository. It may be a
local checkout or a repository hosted by GitHub, GitLab, Gitea, or another
service.

## What local Git can do

A write-capable local agent can complete the full learning loop: read current
state, organize evidence, generate questions, record answers, update the next
action, and commit a reversible change. No remote is required.

## What hosting may add

A host may add remote backup, browser access, collaboration, connectors, CI,
Issues, and cross-device handoff. These capabilities exist only when configured
and authorized.

Local file access does not prove remote access. A local commit does not prove a
push. A dated task file does not prove scheduler execution.

## Other state surfaces

AI memory, project files, artifacts, Obsidian, and local source folders may
support the workflow. They are working or source surfaces, not hidden
replacements for the canonical learner repository.

When a source remains outside Git, keep an accurate locator and access status.
When native memory conflicts with traceable repository evidence, use the
evidence and propose a memory correction.

See [Permission and boundary](permission-and-boundary.md) and
[Git adapters](../adapters/git/README.md).
