# GitLearnOS RAG-Anything Knowledge Layer

## Setup and adapter contract

Setup completes provider selection, credentials, storage and source authorization once.
Inspect existing `gitlearnos.yml` first; reuse answered choices. Ask only for missing
facts. Keep the main agent independent from RAG's generation and embedding models.
Store separate `rag.chat` and `rag.embedding` blocks with `base_url`, `model`, and
`api_key_env`; embedding also requires `dimensions`. These environment variable
names refer to secrets; never store actual keys in YAML. No provider is selected
implicitly. Kimi is a historical compatibility example only.

Before reporting knowledge-ready, install the chosen dependencies, verify both
endpoints, commit an authorized source record and provisional knowledge-point
links, ingest it, then run a known-fact acceptance query with traceable evidence.
Persist the resulting receipt in a follow-up Git commit. No material or missing
credentials means setup remains incomplete, with the precise missing item shown.
Do not repeat setup in ordinary learning; repair only changed or failed components.
Changing an embedding model or dimension requires a new index and replay, never
silent reuse. Independent provider addresses and credentials must remain separate.

Daily learning follows: recognize event → identify goal and tentative knowledge
points → retrieve only if relevant → answer/diagnose/practice → save original
evidence and justified interpretation in Git → synchronize durable RAG material.
Classification may start provisional. Preserve IDs or record aliases/supersession
when splitting or merging points; do not rewrite historical evidence. A topic
can link many sources, and a source can support many topics. Teacher feedback can
revise an AI diagnosis; neither a retrieval hit nor a prompted correct answer
proves independent mastery. Schedule the next check only when evidence warrants it.

The adapter's operations have these boundaries:

- `query --question <text> [--knowledge-id <id>]`: ordinary read-only retrieval
  across active sources. Return evidence text, source and document IDs, locator,
  version/hash, and `ok`, `no-hit`, or `stale`. No expected answer is required.
  Connection errors are failures, not no-hit results. A failed read does not
  prove the index needs synchronization: do not mark documents pending or ingest
  again unless source versions or inspected provider state justify it. The main
  agent compares contradictory sources, cites evidence, and states uncertainty.
- `verify --source-id <id> --doc-id <id> --question <text> --expect <fact>`:
  setup/regression acceptance only; match the fact in retrieved evidence, not
  generated answers. Successful verification does not prove mastery.
- `ingest`: synchronize a committed source version with stable identity.
- `rebuild`: explicit update of an existing document; preserve prior Git evidence,
  mark synchronization pending, delete the owned old index entry, insert the
  replacement, then verify. Index replacement is recoverable, not atomic.
- `delete`: remove the receipt-owned indexed document. The current adapter retains
  LLM cache; this is not an erasure guarantee. Full source erasure requires the
  provider's cache deletion workflow and authorization for that boundary.
- `status`: inspect recorded evidence; a receipt is historical evidence, not a
  live service health check. Report Git persistence, RAG synchronization, and
  learner mastery separately.

Save the learning event and source version first, with `pending` synchronization
and the intended document ID. Commit successful or failed sync evidence separately.
An outage must not roll back learning evidence or block unrelated authorized Git
writes. Retry only pending documents after inspecting actual provider state;
identical active ingestion is refused to prevent duplicates. After deletion during
a failed rebuild, recover from the preserved Git source and receipt, not by
fabricating success. The adapter never commits Git on the learner's behalf.

Generated indexes may live outside Git (default), or in an explicitly ignored,
untracked directory inside it. Commit compact knowledge/source records and receipts;
do not commit vectors/caches. Git rollback alone does not roll back the index:
reconcile source hashes and replay affected documents. An unavailable RAG leaves a
usable incomplete edition; it does not cancel existing write authority.

Follow the Router's core contract. A verified RAG layer is required for a
complete GitLearnOS deployment. RAG-Anything is the first supported adapter
used by the one main agent. Git remains the formal, readable, versioned
learning record; RAG remains a rebuildable retrieval layer. When RAG is absent
or unverified, continue safe Git learning operations but report the deployment
as `incomplete`.

## Deployment gate

For setup or deployment, first read `GITLEARNOS.md` and `START-HERE.md` when
accessible. Ask the learner for:

1. the learning goal and subject;
2. the current material and its formats;
3. the authorized source boundary and dedicated RAG storage location;
4. the model/provider constraints and credential environment variable name.

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

## Classify by stable knowledge point

Give every durable knowledge point a stable ID such as
`<subject>/<topic>/<knowledge-point>` and create its canonical Git record under
`subjects/<subject>/knowledge/`. Use the same ID across source records, gaps,
models, reviews, RAG ingestion metadata, and receipts. A display-title change
does not change the ID.

Before ingestion, create or update the Git source record. It must include:

- stable `source_id`, title, authorized locator/root, and content hash or
  version when available;
- one or more `knowledge_ids` and links to their canonical Git records;
- stable RAG `doc_id`, provider/parser version, index location, and receipt
  path;
- rebuild input and deletion boundary.

One source may map to many knowledge points and one knowledge point may cite
many sources. Do not duplicate a textbook into one copy per knowledge point.
Pass `source_id`, `knowledge_ids`, `doc_id`, the Git source-record path, and a
page/section locator into the adapter as metadata or a structured text preamble.
Never hand-edit generated `kv_store_*`, `vdb_*`, graph, or cache files.

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
with the documented content_list schema: text items use
`{"type": "text", "text": "...", "page_idx": 0}` (the field is `text`, not
`content`); images use an absolute `img_path` plus caption; tables use Markdown
`table_body`; equations use `latex` plus a text description; custom types may
use raw `content`. Do not repeat equivalent OCR or vision processing.

Treat a successful process exit as insufficient ingestion evidence. Confirm
that the insertion reports nonzero text length or multimodal items, the index
contains nonzero chunks or equivalent records, and a source-specific query
returns traceable content. A `processed` document with zero content and zero
chunks is an empty ingestion failure, not `enabled`.

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

The bundled `scripts/rag-anything-adapter.py` is the reference CLI when its Python
dependencies are available (including PyYAML for `gitlearnos.yml`, OpenAI client,
and NumPy). Verify imports in the selected virtualenv during setup. It keeps
credentials outside Git, enforces an
authorized root and Git source record, and supports inspectable ingest, query,
verify, status, delete, and rebuild operations. Provider endpoints, model IDs,
embedding dimensions, and credential variable names remain configurable.
Its default working directory is a repository-specific folder under the user's
data home, outside learner Git. An internal directory must be explicitly ignored and untracked.

The [Kimi Code](https://www.kimi.com/code/docs/en/) compatibility profile is based on a real 2026-09-05 test against
`https://api.kimi.com/coding/v1`: chat and embeddings succeeded, embeddings
returned 1024 dimensions and response model `bge_m3_embed`, and the complete
text lifecycle passed ingest, source-cited query, new-process reopen, deletion,
and rebuild. Kimi's public Code documentation did not document an embeddings
contract at test time, so treat this as tested compatibility, not a guaranteed
stable provider interface. Probe the actual dimension in a new index and keep
the embedding implementation replaceable. Never reuse an index with a changed
embedding model or dimension.

## Reference CLI

This release's bundled adapter accepts authorized UTF-8 text or Markdown through
structured insertion. Use upstream parsing for PDF, image, table, equation, and
other formats, then apply the same Git identity and receipt rules. Global flags
must precede the subcommand:

```text
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> status
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> ingest --source <file> --source-record <tracked-record> --source-id <id> --knowledge-id <id> --doc-id <id> --authorized-root <root>
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> query --question <question> --knowledge-id <id>
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> verify --source-id <id> --doc-id <id> --question <question> --expect <source-specific-fact>
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> delete --source-id <id> --doc-id <id>
python skills/gitlearnos/scripts/rag-anything-adapter.py --learner-root <repo> rebuild --source <file> --source-record <tracked-record> --source-id <id> --knowledge-id <id> --doc-id <id> --authorized-root <root>
```

Set each credential through the environment variable named by `rag.chat.api_key_env`
or `rag.embedding.api_key_env`. `--prompt-api-key` provides hidden input for the
chat credential only; the embedding credential is configured separately. The CLI
never writes credentials to Git or receipts.
It keeps its operational copy under the configured RAG working directory and
publishes the auditable mirror as
`.gitlearnos/receipts/rag-<sha256-of-doc-id>.json` in the learner repository.
Commit source and knowledge-point records before ingestion; commit the receipt
mirror afterwards, including failure evidence when synchronization did not complete.

## Ingest and query

Before ingestion:

1. confirm the source is authorized and inside the approved boundary;
2. create or update its compact Git source record and every linked stable
   knowledge-point record;
3. choose raw parsing or direct content_list insertion;
4. use a stable document identifier (`doc_id` when the integration exposes one)
   and record it together with `source_id`, `knowledge_ids`, Git record path,
   source version/hash, and retrieval locator;
5. prevent duplicate submission and preserve parser/version metadata when it
   affects future rebuilds.

Query RAG only when the request depends on learner-specific textbooks, notes,
or durable knowledge. Ordinary queries return retrieved evidence rather than
requiring a generated answer; unrelated general questions should stay direct. Treat retrieved output as a
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

Otherwise report `unavailable`, `unknown`, or `incomplete`. A dry run, package
import, health check, configuration file, or empty-index query is not enough.
There is no complete-deployment path that merely declines RAG.

## Output

```text
Learning goal:
RAG-Anything: enabled / unavailable / unknown / incomplete
Knowledge IDs:
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
