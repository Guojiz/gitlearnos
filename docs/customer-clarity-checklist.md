# Customer Clarity Checklist

Use this checklist to review GitLearnOS from a first-time user's perspective.

## A first-time user should understand

- what GitLearnOS is;
- why GitHub is used;
- the difference between the template repository and the user's target repository;
- what goes into GitHub;
- what can stay local;
- which AI tools can run it;
- what permissions the AI actually has;
- what the first setup step is;
- whether Chat, Work, Skills, memory, and Git are actually available;
- where large learning files belong;
- why GitHub may help with backup, teaching, and collaboration;
- what success looks like after setup.

## Main entry path

A new user should be able to follow this path:

1. [README.md](../README.md)
2. [QUICKSTART.md](../QUICKSTART.md)
3. [First Experiment Guide](first-experiment-guide.md)
4. [What Goes Into GitHub](what-goes-into-github.md)
5. [Runtime Self-Adaptation](runtime-self-adaptation.md)
6. [Local Runtime Note](local-runtime-note.md)

## Common customer questions

### Is this a template or my actual learning repository?

Answer: this repository is the template. The user creates a target repository for personal learning data.

### Can this organize my learning data into GitHub?

Answer: yes. It organizes structured learning records into GitHub. It does not require every original file to be uploaded.

### Can I use it locally?

Answer: yes, for testing or local workflows. But local access is not the same as GitHub access.

### Does it require GitHub Actions or API keys?

Answer: GitHub Actions are not required. API credentials depend on the selected
RAG and model providers; keep them outside Git and verify only whether they are set.

### Must I say “use GitLearnOS” or invoke a Skill every time?

Answer: no. After guided setup, durable project/repository instructions and
native memory—when available—should help the agent notice useful questions,
answers, pages, notes, feedback, and results automatically. It should not save
unrelated conversation.

### Should I use Chat or Work?

Answer: use Chat for short daily learning events when it has verified repository
access. Use Work for setup, large imports, multi-file organization, maintenance,
or substantial review. Skills are optional, and account credit treatment must
be checked in the current plan rather than promised universally.

### Where should textbooks and large files go?

Answer: put them in persistent Project Sources or an authorized local source
folder. Keep source locators, selected excerpts, and compact learning state in
Git.

### Why might I add GitHub?

Answer: private backup, cross-device continuity, teacher or tutor review,
shared course materials, and group projects. Keep shared materials separate
from private learner state.

### Can the AI claim it has deployed the system?

Answer: only if it has actually created or updated files in the target repository and can report the changes.

## Red flags

The documentation is unclear if a user might think:

- they should write personal learning data into the template repository;
- local file access means GitHub write access;
- GitHub Actions or API keys are required for the first setup;
- every raw file must be uploaded to GitHub;
- one AI tool can claim permissions it has not verified;
- a Skill must be invoked before the agent can notice learning;
- every large source file belongs in Git;
- Chat, Work, and Codex have identical tools or credit rules;
- the first action is to send a problem before creating the target repository.

## Maintenance rule

When adding new docs, check whether they affect one of these concepts:

- template repository vs target repository;
- hosted Git runtime vs local reproduction;
- structured records vs raw source files;
- AI permissions and manual user steps;
- basic setup vs advanced automation.

If yes, link back to the relevant main guide.
