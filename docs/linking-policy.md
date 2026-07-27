# Documentation Linking Policy

GitLearnOS documentation should be easy for both humans and AI agents to navigate.

## Rule

Use clickable Markdown links in human-facing documents.

Use plain paths when the text is meant to be copied into an AI prompt, shell command, file tree, or machine-readable instruction.

## Use Markdown links in

- README files;
- Quickstart files;
- Start Here files;
- public-facing guides;
- contribution guides;
- document index sections;
- prose that points a human to another file.

Example:

```md
Read [QUICKSTART.md](../QUICKSTART.md) first.
```

## Plain paths are acceptable in

- copy-paste prompts for AI tools;
- code blocks;
- file trees;
- YAML front matter;
- skill routing tables;
- examples where the path itself is the payload;
- AGENTS or SKILL instructions where machine readability matters more than human clicking.

Example:

```text
Start with QUICKSTART.md and docs/skill-and-memory-runtime.md.
```

## Why

AI tools can understand both plain paths and Markdown links.

Humans navigate faster with links.

Therefore, public reader paths should be clickable, while prompt payloads and machine-facing snippets can stay plain.
