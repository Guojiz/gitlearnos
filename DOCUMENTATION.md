# Documentation Map

[中文](DOCUMENTATION.zh-CN.md)

English is the primary language of GitLearnOS. Human-facing entry points are
kept clear in both English and Chinese. Machine-facing contracts are maintained
in English first and do not require a Chinese duplicate.

```mermaid
flowchart LR
    H["Learner or judge"] --> W["Website"] --> R["README"] --> Q["Quickstart"] --> D["Live demo"]
    A["Agent or maintainer"] --> G["AGENTS.md"] --> P["GITLEARNOS.md"] --> S["One Skill"] --> L["Learner repository"]
```

## Start here

| Need | English | Chinese |
|---|---|---|
| Understand the product | [README](README.md) | [中文 README](README.zh-CN.md) |
| Start using it | [Quickstart](QUICKSTART.md) | [快速开始](QUICKSTART.zh-CN.md) |
| See a real Agent loop | [Live demo](LIVE-DEMO.md) | [三分钟演示](LIVE-DEMO.zh-CN.md) |
| Resolve common questions | [FAQ](FAQ.md) | [常见问题](FAQ.zh-CN.md) |
| Read the AceSAT case | [Impact statement](docs/acesat-build-for-impact.md) | [影响说明](docs/zh-CN/acesat-build-for-impact.md) |
| Browse the visual site | [Website](https://guojiz.github.io/gitlearnos/) | Use the `中` switch on the same page |

These six entry points are the supported human path. A learner or judge should
not need to read the protocol, Skills, adapters, or evaluation fixtures to
understand the product.

## Machine-facing path

The executable reading order is:

```text
AGENTS.md
→ GITLEARNOS.md
→ skills/gitlearnos/SKILL.md
→ one focused operation Skill
→ learner repository
```

`GITLEARNOS.md` is the canonical behavior contract. `AGENTS.md`, `skills/`,
`evals/`, adapters, and machine templates are maintained in English. Existing
Chinese translations may help a human inspect the system, but they are not
required for every machine-facing file and never override the English source.

## Deeper documentation

Files under `docs/` explain architecture, automation, privacy, deployment,
memory, and learning methods. English versions are primary. A Chinese
counterpart may be provided when the document is part of a common human
workflow; advanced implementation notes may remain English-only.

## Writing standard

Human-facing documentation must:

1. lead with the outcome and a concrete example;
2. use ordinary language before internal terms;
3. distinguish required, optional, and unavailable capabilities;
4. link to the next action instead of duplicating the whole protocol;
5. keep English and Chinese meaning aligned without literal, unnatural
   translation.

When a human-facing pair changes, update both files in the same change. Machine
files change in English first; translate them only when the translation has a
real reader and can be kept accurate.
