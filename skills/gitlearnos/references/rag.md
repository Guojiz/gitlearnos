# GitLearnOS RAG-Anything Knowledge Layer

Follow the Router's core contract. RAG-Anything is an optional local tool used
by the one main agent. Git remains the formal, readable, versioned learning
record; RAG remains a rebuildable retrieval layer.

## Deployment gate

For setup or deployment, first read `GITLEARNOS.md` and `START-HERE.md` when
accessible. Ask the learner for:

1. the learning goal and subject;
2. the current material and its formats;
3. whether to accept the default recommendation to enable a local RAG knowledge
   layer, using RAG-Anything as the first supported option;
4. the authorized local storage boundary and model/provider constraints.

Wait for the answer before installing packages, creating storage, ingesting
files, committing, or deploying. Never request secrets in chat. Inspect only
whether required settings are configured.

This gate applies to learner deployment, not to maintaining, documenting,
testing, or publishing the public GitLearnOS template. A compatible local RAG
implementation may replace RAG-Anything without changing the rules below.

## Decide where knowledge belongs

| Input | Git | RAG-Anything |
|---|---|---|
| goal, state, history, error, plan, source register | yes | no by default |
| textbook, long-term lecture, course pack, reference book | compact registration | ingest when authorized |
| learner note, teacher method, course rule, durable summary | formal knowledge | insert for retrieval |
| ordinary one-off exercise or temporary mistake | record when useful | no |
| repeated error pattern, durable gap, reusable method | promote formally | insert after promotion |

Do not infer promotion from one occurrence. Require repeated evidence, explicit
learner instruction, or clear durable reuse value. Record why the item was
promoted and link its Git path to its RAG document identifier.

For a synthesized problem model, insert only the formal Git version whose
promotion basis and evidence links are recorded. A plausible one-off diagnosis
stays out of RAG. Store the Git revision and stable RAG identifier so later
refinement updates the same knowledge instead of creating a duplicate. RAG
promotion and learner mastery remain independent: useful knowledge may be
retrievable while the learner is still `learning`.

## Avoid duplicate parsing

If the main agent already faithfully understood an image, screenshot,
question, board, or short excerpt, insert a faithful structured record through
RAG-Anything's `insert_content_list` path instead of re-parsing. Build the list
with the documented content_list schema: text items, images with an absolute
`img_path` plus caption, tables as Markdown `table_body`, equations as `latex`
plus a text description, and custom types with raw content. Do not repeat
equivalent OCR or vision processing.

Give the original file to RAG-Anything's parser when it is a complete textbook,
long PDF, large durable collection, a document whose text/image/table/equation
relationships matter, or material the main agent has not fully inspected.

A text-only or non-multimodal main agent cannot see the image and therefore has
not understood it; it must not synthesize or fabricate a representation,
diagnosis, or question from it. Prefer an available multimodal or
vision-capable helper model to transcribe it, then an authorized local OCR or
parser, then asking the learner to paste the text, or hand the raw original to
RAG-Anything's parser for authorized ingestion. A low-confidence or fragmentary
transcription is still not-read; record it as `needs-transcription` or
`not-yet-read` and ask the learner to confirm before recording gaps, models, or
questions.

## Install the smallest official capability

RAG-Anything upstream is a Python framework; do not assume an MCP server or
one-click service exists. Prefer the current official package and documentation.
Choose only dependencies required by the learner's formats and environment.
Complex Office formats may require external software; parser choices may need
additional models or packages. Keep credentials outside Git and chat.

Pin a current released version for reproducibility and inspect the installed
version; PyPI currently publishes 1.3.1 but also contains an old 0.0.1 release,
so do not accept an unexpected cached, mirrored, or constrained resolution.
Upstream `mineru[core]` has no Python 3.14 distribution. On a machine whose
default `python3` is 3.14, create a Python 3.12 virtualenv and verify the
installed version plus `import raganything, lightrag` before reporting
anything available.

An integration may expose Python calls, a local service, MCP tools, or another
adapter. Verify the actual interface instead of documenting an imagined one.

## Ingest and query

Before ingestion:

1. confirm the source is authorized and inside the approved boundary;
2. create or update its compact Git source record;
3. choose raw parsing or direct content_list insertion;
4. use a stable document identifier (`doc_id` when the integration exposes one)
   and record it in Git so later retrieval can cite the same identifier;
5. prevent duplicate submission and preserve parser/version metadata when it
   affects future rebuilds.

Query RAG only when the request depends on learner-specific textbooks, notes,
or durable knowledge; each query runs an LLM pass over graph and vector
retrieval, so routine questions should stay direct. Treat retrieved output as a
locator and grounding aid, not as proof of learning or correctness. Cite the
returned `doc_id` or file reference when linking an important conclusion back
to an authorized source or formal Git record.

## Verify deployment

Report RAG-Anything as `enabled` only after observing all of these:

1. the actual package, tool, or service interface is callable;
2. the selected parser/model dependencies are available for the chosen format;
3. one authorized non-secret source is really ingested or inserted;
4. a test query retrieves a source-specific fact and the response cites a
   traceable `doc_id` or file reference from the ingested material;
5. the public template, examples, unauthorized files, and temporary exercises
   are absent from the index;
6. the index location, rebuild inputs, and deletion/undo boundary are known.

Otherwise report `disabled`, `unavailable`, or `unknown`. A dry run, package
import, health check, configuration file, or empty-index query is not enough.

## Output

```text
Learning goal:
RAG-Anything: enabled / disabled / unavailable / unknown
Authorized boundary:
Git source records:
Ingested or promoted:
Retrieval evidence:
Skipped and why:
Changed files:
Credentials: not inspected / configuration status only
Undo or deletion boundary:
Next action:
```
