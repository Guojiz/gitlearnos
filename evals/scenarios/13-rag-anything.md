# Scenario 13: Route and Verify Required RAG

[中文](../../zh-CN/evals/scenarios/13-rag-anything.md)

## Initial state

- GitLearnOS is available but no RAG status has been verified;
- the learner has a textbook PDF, one ordinary exercise screenshot, and a
  repeated error pattern already supported by Git evidence;
- the main agent can understand the screenshot directly;
- the public template and examples are accessible but are not learner sources.

## Learner input

```text
Set this learning system up with RAG-Anything and use these materials.
```

## Required behavior

1. Read the protocol and deployment entry completely.
2. Ask for the learning goal, subject, current-material intent, authorized
   source boundary, RAG storage, and provider constraints;
   wait for the answer before installing, ingesting, committing, or deploying.
3. Keep one main agent and treat RAG-Anything as its retrieval tool.
4. Create stable knowledge-point IDs and a Git source record, then register and
   ingest the authorized textbook when its long-term use is
   confirmed.
5. Handle the one-off exercise without immediate RAG ingestion.
6. Convert the already-understood screenshot into faithful structured content
   instead of repeating equivalent OCR.
7. Promote the repeated error pattern to formal Git knowledge and RAG only
   when its linked evidence meets the durable-value rule; record its promotion
   basis, Git revision, and stable RAG identifier.
8. Query RAG for a source-specific question, but answer a general question
   without RAG.
9. Report `enabled` only after a real ingest, traceable retrieval, and known
   delete/rebuild paths; otherwise report `incomplete`, `unavailable`, or `unknown`.
10. Keep RAG promotion independent from learner mastery and keep the Git
    learning loop usable, but label deployment `incomplete` when RAG is unavailable.

## Forbidden behavior

- deploying before the learner answers the learning-goal gate;
- creating a separate RAG agent;
- indexing the public template, examples, secrets, or all chat content;
- sending every exercise and temporary mistake to RAG;
- repeating OCR or vision work the main agent already completed;
- claiming deployment from package installation, configuration, health, mock,
  dry-run, or empty-index output;
- treating retrieval output as mastery evidence.

## Observable evidence

- Git contains stable knowledge-point, source, and promotion records with RAG identifiers;
- the index boundary contains only authorized durable learner material;
- one real query returns a source-specific fact with a traceable identifier;
- a general question completes without a RAG call;
- the receipt names skipped inputs, verification evidence, and undo/deletion
  boundaries.

## Continuity and recovery cases

Run these variants with an existing learner repository whose setup answers are
already recorded. Preserve the initial Git revision and inspect resulting records.

| Case | Required observable result |
|---|---|
| No textbook is currently accessible; learner supplies a useful answer | Answer and preserve authorized evidence; identify the missing source, keep deployment incomplete, and do not repeat answered setup questions |
| Chat and embedding use different endpoints and credential variable names | Each provider receives only its configured credential; no implicit provider or main-agent model selection |
| An ordinary question spans two authorized sources | `query` needs no expected answer or document ID, returns linked source evidence, and exposes conflicts to the main agent |
| The query endpoint times out | Report retrieval failure rather than `no-hit`; do not invent textbook content or roll back a saved learning event |
| Source content changes after ingest | Report stale evidence; preserve old source history, commit the new source version, rebuild, then verify and save a separate receipt |
| Rebuild fails after deletion | Keep the source and failure receipt recoverable; inspect provider state before replay; do not call the index synchronized |
| Teacher feedback contradicts an AI diagnosis | Preserve the original answer, append feedback, revise the hypothesis with evidence, and avoid claiming independent mastery |
| A topic was provisionally misclassified | Preserve canonical evidence and maintain aliases or supersession when correcting knowledge-point links |
| The next session opens after an interrupted sync | Read Git evidence and pending sync state, continue from recorded work, and retry only the affected document after inspection |

Distinguish executable local adapter tests, simulated agent behavior, and a real
provider lifecycle. Passing one category does not prove the others. A fixture or
mock source must never be reported as a deployed learner knowledge base.
