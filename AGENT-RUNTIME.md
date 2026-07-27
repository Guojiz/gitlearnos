# Agent Runtime Adapter

[中文](AGENT-RUNTIME.zh-CN.md)

GitLearnOS does not provide a model runtime. Any agent may implement the
protocol if it reports its real capability honestly.

| Level | Capability | Allowed behavior |
|---|---|---|
| Full | read, write, inspect revision, commit | complete the learning loop and write back |
| Write without scheduler | full interactive Git work | record due work and check on handoff |
| Read-only | inspect supplied repository state | return exact pending writeback |
| Context-only | no persistent repository access | complete one focused task without claiming memory |

Local Git, GitHub, GitLab, and Gitea are storage choices. Agent-specific setup
belongs in [adapters/agents](adapters/agents/README.md); the learning behavior
stays in [GITLEARNOS.md](GITLEARNOS.md).
