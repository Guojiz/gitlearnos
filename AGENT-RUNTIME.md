# Agent Runtime Adapter

[中文](zh-CN/AGENT-RUNTIME.md)

GitLearnOS does not provide a model runtime. Any agent may implement the
protocol if it reports its real capability honestly.

| Level | Capability | Allowed behavior |
|---|---|---|
| Full | read, write, inspect revision, commit | complete the learning loop and write back |
| Write without scheduler | full interactive Git work | record due work and check on handoff |
| Read-only | inspect supplied repository state | return exact pending writeback |
| Context-only | no persistent repository access | complete one focused task without claiming memory |

Skills are optional. A runtime may instead activate GitLearnOS through
automatically discovered `AGENTS.md`, durable project instructions, native
memory, or the learning event itself. Large source files belong in a persistent
project/source workspace when available; Git remains the compact inspectable
state layer.

Local Git, GitHub, GitLab, and Gitea are storage choices. Agent-specific setup
belongs in [adapters/agents](adapters/agents/README.md); the learning behavior
stays in [GITLEARNOS.md](GITLEARNOS.md).
