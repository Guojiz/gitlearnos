# AI Runtime Support

GitLearnOS supports any one main AI runtime that can execute the learner-owned
contract honestly. A product label does not prove access: test the current
surface for repository, source, memory, Skill, and scheduler capabilities.

## Core-ready capability

The main agent must be able to:

1. receive a goal or learning event and recognize useful implicit events;
2. read the minimum relevant configuration, dashboard, goal, and evidence;
3. organize evidence and generate a grounded next question;
4. follow write authority and source/privacy rules;
5. write the target, or return the exact pending writeback when it cannot;
6. report changed files, commits, current-agent work, and verified background work.

Live tutoring, Skills, native memory, web search, and visual generation are
optional improvements; RAG is required for complete deployment. A text-only provider cannot see images, screenshots,
boards, or other visual evidence; use verified multimodal or OCR/parser support,
or ask for a faithful transcription. Never infer unseen content.

## Runtime roles

Chat or another daily surface can handle short questions and learning events
when repository access is verified. A Work or coding-agent surface is useful
for setup, imports, migrations, and maintenance. The current agent may perform
an immediate safe write under `safe-auto`; a recurring background job requires a
repository-capable scheduled invocation of the same main agent and an observed run.

## GPT-6 Astra and autonomous Skill use

GPT-6 Astra's stronger general reasoning does not remove the need for durable
instructions. OpenAI's current model guidance says Astra is more sensitive to
instructions supplied through Skills and `AGENTS.md`, so GitLearnOS keeps a
small two-level trigger:

1. `AGENTS.md` tells any repository-aware agent to recognize useful learning
   events and route them without waiting for a Skill command;
2. the `gitlearnos` Skill description names the same events so a runtime that
   scans Skill summaries can select it automatically, while the Skill body
   loads the smallest operation reference.

The model makes the event judgment. The files preserve ownership, evidence,
RAG, and write boundaries across models and conversations. See OpenAI's
[latest-model guide](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra)
and the official [Skill creator guidance](https://github.com/openai/codex/blob/main/codex-rs/skills/src/assets/samples/skill-creator/SKILL.md).

## State boundaries

The learner repository stores changing goals, evidence, configuration, and history.
Project Sources hold large reusable materials. Native memory only wakes the
behavior and caches stable preferences. RAG is rebuildable, managed by the same
main agent, and required for complete deployment. Do not treat hidden runtime memory as proof of
learning state, and do not claim a scheduled run without direct evidence.
