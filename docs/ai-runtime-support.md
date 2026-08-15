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

Live tutoring, Skills, native memory, web search, visual generation, and RAG
are optional improvements. A text-only provider cannot see images, screenshots,
boards, or other visual evidence; use verified multimodal or OCR/parser support,
or ask for a faithful transcription. Never infer unseen content.

## Runtime roles

Chat or another daily surface can handle short questions and learning events
when repository access is verified. A Work or coding-agent surface is useful
for setup, imports, migrations, and maintenance. The current agent may perform
an immediate safe write under `safe-auto`; a recurring background job requires a
repository-capable scheduled invocation of the same main agent and an observed run.

## State boundaries

The learner repository stores changing goals, evidence, configuration, and history.
Project Sources hold large reusable materials. Native memory only wakes the
behavior and caches stable preferences. RAG is optional, rebuildable, and
managed by the same main agent. Do not treat hidden runtime memory as proof of
learning state, and do not claim a scheduled run without direct evidence.
