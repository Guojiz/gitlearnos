# GitLearnOS Skills

[中文](../zh-CN/skills/README.md)

GitLearnOS ships one self-contained installable Skill folder:

```text
skills/gitlearnos/
├── SKILL.md             one discoverable Router
├── agents/openai.yaml   optional OpenAI interface metadata
└── references/          operations, core contract, and subject methods
```

Only the Router's `name + description` enters the initial Skill list. It loads
one operation reference and, when useful, one subject reference. This preserves
progressive disclosure without making nine Skills compete for the same
learning event.

`skills/gitlearnos/` is the distributable source folder, not proof of
installation. Setup copies the whole folder to the active main agent's native
location and verifies discovery:

| Main agent | Default project location |
|---|---|
| Codex | `.agents/skills/gitlearnos/` |
| Claude Code | `.claude/skills/gitlearnos/` |
| OpenCode | `.agents/skills/gitlearnos/` |

See the [Agent adapter](../adapters/agents/README.md). Core product capabilities
remain organization, question generation, and automated writeback. Live
tutoring is optional.
