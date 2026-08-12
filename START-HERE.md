# Start Here

[中文](zh-CN/START-HERE.md)

GitLearnOS runs through an existing AI agent with Git repository access.

## Agent path

1. Read [GITLEARNOS.md](GITLEARNOS.md).
2. Identify the learner's target Git repository or local checkout.
3. Unless clearly maintaining or publishing the public template, treat the user
   as the learner. Ask for the learning goal, subject, and current material;
   recommend enabling a local RAG knowledge layer; stop before learner
   installation or deployment until the learner answers. Template maintenance,
   documentation, tests, and open-source release are exempt from this gate.
4. Guide the learner to a persistent project/source area for large learning
   files.
5. Detect actual Chat/Work/agent, memory, instructions, Skills, read, write,
   commit, push, source, RAG, and scheduling capability.
6. Configure durable activation so future learning events do not require a
   Skill name.
7. Read the target policy, dashboard, active subject goal, and only related
   evidence.
8. When Skills are supported, install the complete
   [`skills/gitlearnos/`](skills/gitlearnos/) folder in the main agent's native
   location, verify discovery, and route through its single Router.
9. Perform safe work, commit one meaningful learning event, and return the
   required receipt.

## Important boundaries

- Personal state belongs only in the learner repository.
- GitHub is one optional Git host, not a core requirement.
- Chat and Work may both be valid; actual tools and limits must be checked.
- Skills are optional; `AGENTS.md`, Claude Code's thin `CLAUDE.md` adapter,
  project instructions, and memory preserve activation across conversations.
- Large originals belong in Project Sources or an authorized local source
  folder by default.
- Ordinary conversation is not a learning record.
- Original answers, notes, and external feedback are preserved.
- A due automation should produce a concrete question, not only a reminder.
- Without real write or scheduling capability, return pending work honestly.

For a copyable setup request, see [QUICKSTART.md](QUICKSTART.md).
