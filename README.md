# GitLearnOS

<p align="center">
  <img src="website/media/gitlearnos-harness-mascot.png" width="240" alt="GitLearnOS comic book Agent wearing an orange Git-branch harness">
</p>

<p align="center"><strong>Learner-owned Git memory · GitLearnOS-exclusive native DeepSeek Harness support</strong></p>

**[Open the core-ready Quickstart →](QUICKSTART.md)**

[中文](zh-CN/README.md) ·
[Website](https://guojiz.github.io/gitlearnos/) ·
[Documentation map](DOCUMENTATION.md) ·
[Protocol](GITLEARNOS.md)

![GitLearnOS overview](docs/assets/gitlearnos-map.svg)

## The core promise

GitLearnOS gives one capable, replaceable main AI agent a learner-owned Git
memory. It notices useful learning events, connects evidence to a goal, guides
the next action, and leaves an inspectable, reversible record.

Learning can happen with a teacher, in class, on paper, in a book, on a
practice platform, in a project, with peers, or with another AI. GitLearnOS
does not move all learning into one application. The main agent connects only
the evidence that is useful for the learner's next decision.

The core is ready with a private local Git repository, one write-capable agent,
the GitLearnOS protocol, and one subject or real learning event. GitHub and
other remotes are optional. During normal learning, Git stays in the
background: the learner should not have to manage folders, branches, or
commits.

The default recommendation is **private**. Add a remote only when the learner
chooses backup, cross-device continuity, teacher review, collaboration, or
publishing, and keep private answers and gaps separate from shared material.

## Core-ready, then everyday learning

The agent answers the immediate request first. Under `safe-auto`, it may then
make the smallest safe writeback when the target, evidence, goal, and privacy
boundary are clear. `preview` proposes the exact change without writing;
`manual` waits for approval. Original answers, notes, and external feedback
are preserved; AI interpretations remain revisable and must link to evidence.

Once configured, a learner should not need to say “use GitLearnOS” or name a
Skill. A question, attempted answer, page photo, class note, teacher comment,
practice result, or repeated difficulty can be a learning event. Incidental
conversation is not stored.

```text
goal and real input
→ organize traceable evidence
→ ask from the current gap
→ keep the answer or external feedback
→ recheck independently later
→ update state with one reversible Git commit
```

The success condition is better independent performance on later questions,
not a larger pile of generated notes. A normal receipt distinguishes what the
current agent did immediately from what an external worker actually ran.

## A small, useful repository

```text
gitlearnos.yml
AGENTS.md
automation.md
dashboard.md
learner-profile.md
subjects/
└── <subject>/
    ├── goals/
    ├── sources/
    ├── models/
    ├── knowledge-gaps/
    ├── reviews/
    └── events/
```

Only create folders when real learning evidence needs them. Root files hold
shared configuration and current views; subject folders hold focused state. Large
textbooks, PDFs, scans, media, and long-lived references belong in Project
Sources or an authorized local folder. Git keeps compact state, provenance,
selected excerpts, and history.

## GitLearnOS-exclusive native DeepSeek Harness surface

GitLearnOS ships an installable native bundle for the official DeepSeek Harness
Developer Preview. It brings a complete, verifiable Git learning transaction
and an agent-controlled panel into Harness: the main agent owns the ordered
`Next up` queue and presentation decision, while the learner keeps the final
manual toggle. The Host remains bounded plumbing; it does not invent a ranking
or turn panel state into learning evidence.

The code in this repository currently proves:

- a no-build Host plus browser bundle discovered by the Harness profile;
- `learning_status` and `learning_route` bounded, read-only observations;
- one `gitlearnos.yml`-authorized `learning_apply` transaction that atomically applies typed
  event, knowledge-gap, model, review, and dashboard operations in one
  reversible Git commit (with strict learner identity, setup/config, base
  revision, and write-authority checks); `learning_record` remains a
  compatibility wrapper;
- a loopback-only, read-only panel that shows the agent-maintained queue,
  respects `Panel: expand|collapse`, and labels development sample data;
- five queue actions that place a review, practice, close-with-one-question,
  ask-a-teacher, or read-notes request into the conversation input.

RAG provider access and cold-session recurring workers remain separate layers;
they are not built into this bundle. DeepSeek's official provider is text-only:
images, screenshots, boards, and other visual evidence require a verified
multimodal provider or an authorized OCR/parser path. An immediate
multiple-choice answer is supported evidence, not proof of mastery. The narrow
roadmap is richer visual editing, a RAG bridge, and an external recurring
worker. See the [launch note](docs/deepseek-harness-launch.md) and the
[adapter's limits and verification steps](adapters/deepseek-harness/README.md).

## RAG and background work are separate layers

For substantial textbooks, course packs, notes, or durable personal knowledge,
we recommend (but do not require) a local RAG layer. [RAG-Anything](https://github.com/HKUDS/RAG-Anything)
is the first explicitly supported option, not a lock-in.

- **Git** is the formal, readable source of learning truth.
- **RAG** is a rebuildable retrieval layer for authorized sources and promoted
  durable knowledge; it is managed by the same main agent, not a second agent.
- **The current agent** can organize evidence and commit an immediate change.
- **Background automation** is an external repository-capable worker. A date,
  reminder, Harness session schedule, or `requested` marker is not proof that
  a worker ran. `maintenance` and `due-review` are complete only after each
  recurring task is created and observed in a real scheduler.

RAG may be declined and GitLearnOS still works. One-off exercises do not enter
RAG automatically. If the main agent already understands an image, preserve a
faithful Markdown or structured representation instead of repeating OCR; a
text-only agent must not infer unseen visual content.

## Start with one subject

Use the [core-ready Quickstart](QUICKSTART.md), which contains the single
canonical setup prompt. It asks the agent to identify the private target,
confirm the learning goal, subject, and current material, recommend local RAG,
wait before learner deployment, detect actual capabilities, and report the
undo boundary. The website CTA links to that same source; it does not create a
repository or pretend that a button provisioned a scheduler.

The [AceSAT demo](LIVE-DEMO.md) shows the loop with a fictional learner using
short, text-first interactions. It still requires a capable AI runtime; local
Git is not the same as a completely offline AI system. Fully offline use would
also require a local model and local tooling that the current runtime actually
supports.

See the [impact statement](docs/acesat-build-for-impact.md) and the completed
[SAT fixture](examples/en/demo-sat-lite/) for the evidence behind the demo.

## Truth before completeness

- Original evidence is preserved; corrections are linked records, not silent rewrites.
- Important conclusions point to traceable evidence; missing evidence stays `unknown`.
- External resolution and delayed independent mastery remain separate.
- A dashboard is a current view, never a second source of truth.
- GitLearnOS never claims a write, commit, RAG retrieval, scheduler run, Skill
  installation, or mastery without direct evidence.

See [GITLEARNOS.md](GITLEARNOS.md) for the full behavior contract,
[QUICKSTART.md](QUICKSTART.md) for deployment, and
[Evaluation](evals/README.md) for documented end-to-end scenarios.

## Project status

This branch develops the Git-native v2 protocol and the DeepSeek Harness
Developer Preview. MIT License; see [LICENSE](LICENSE).
