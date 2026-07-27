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

Answer: no. Those are optional advanced layers.

### Can the AI claim it has deployed the system?

Answer: only if it has actually created or updated files in the target repository and can report the changes.

## Red flags

The documentation is unclear if a user might think:

- they should write personal learning data into the template repository;
- local file access means GitHub write access;
- GitHub Actions or API keys are required for the first setup;
- every raw file must be uploaded to GitHub;
- one AI tool can claim permissions it has not verified;
- the first action is to send a problem before creating the target repository.

## Maintenance rule

When adding new docs, check whether they affect one of these concepts:

- template repository vs target repository;
- hosted Git runtime vs local reproduction;
- structured records vs raw source files;
- AI permissions and manual user steps;
- basic setup vs advanced automation.

If yes, link back to the relevant main guide.
