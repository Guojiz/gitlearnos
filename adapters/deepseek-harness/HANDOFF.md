# GitLearnOS × DeepSeek Harness — Session Handoff

[中文](../../zh-CN/adapters/deepseek-harness/HANDOFF.md)

State record for one finished development round, so a different agent can
resume without re-deriving the decisions. It is state, not a feature spec.

## What is done (reviewable)

1. **Richer read-only observation in `learning_status`** — it now returns
   `dueReview` (`due` / `upcoming` / `noSignal` from explicit next-review dates),
   `reviewFiles`, and `knowledgeGaps` as evidence inputs, not a Host-ranked
   queue. Pure projection; no write, Git mutation, RAG request, or scheduler
   request.
2. **"Close with one tap" in the protocol references** — after teaching a
   point, close with ONE multiple-choice item whose distractors are the likely
   misconceptions; a wrong distractor supplies evidence for a likely confusion
   without claiming to prove its hidden cause. See
   `skills/gitlearnos/references/{session,question,review}.md` (EN + zh-CN).
3. Docs and eval scenario 16 updated.
4. **Agent-maintained learning queue** — `learning_status` returns `queue`
   (the `Next up` list from `dashboard.md`, verbatim, in the agent's order);
   `templates/dashboard.md` documents the convention and the system prompt
   tells the agent to maintain it. The agent owns the order; the tool only
   reads it, never writes it.
5. **Learning panel baked into the bundle** — the client half
   (`adapters/deepseek-harness/client.js`) registers the `GitLearnOS ▸` dock
   entry (collapsed bar → flat `name (action)` list → one-tap action menu).
   It only reads the queue over a **loopback-only** `/gitlearnos` logical RPC
   channel exposed by the Host half (`ctx.connection.rpc.handle`). No tsdown
   build: the client entry ships in the already-built
   `window.__ModuleLoader__.load` module format. `exports["./client"]`,
   `dsh.client`, and peer dependencies are declared in `package.json`.
   Tests now pass 25/25, including the no-Host-ranking, no-empty-state, and
   presentation-scope boundaries.
6. **Agent-controlled presentation** — beside `Next up`, the main agent writes
   `Panel: expand` or `Panel: collapse`. A stable revision makes each new
   decision apply once; periodic refresh preserves the learner's manual toggle
   until the Agent changes the queue or presentation decision.

## Product direction (aligned via /grill-me)

The Harness-native surface is a "brainless learning" panel:

- one centered bar `GitLearnOS ▸`; the Agent decides whether each new queue
  revision arrives open or folded, while the learner can always toggle it;
- **no categories, only an order** — and that order is the **agent's judgment**
  (reading difficulty / importance / mastery / retention from Git), never
  host-hardcoded;
- the axis is **"learner asks → AI teaches"**: before = agent ranks the queue;
  during = learner asks, AI teaches; after = one-tap multiple-choice close.

## Temporary prototype (superseded)

The dynamic Cordis plugin `glearn-1` previewed this panel before it was baked.
It is no longer the source of truth; the bundle client half now owns the panel.
Stop `glearn-1` whenever convenient — it is runtime-only and dies on restart.

## Deliberately deferred / decided

- Diagnostic multiple-choice as its own UI is **not needed**: the Harness-native
  `ask_user_question` close already works end-to-end and reads well, so it stays.

## Published and installed evidence

- Feature revision `423716104e812aa49f4be5c7e0c9b167edffb77c` is on `main`.
- The official `web` profile is pinned to that exact GitHub revision.
- A fresh Harness process on port 3081 loaded the bundled panel without the old
  dynamic `glearn-1` prototype. The real browser showed the collapsed bar,
  expanded sample list, explicit sample label, and all five actions.
- Choosing `Close with one question` placed the expected prompt in the Harness
  composer and collapsed the panel again. The earlier `invalid client-request
  message` failure was reproduced, traced to an omitted RPC payload, fixed with
  an explicit empty object, and covered by a regression assertion.
- A second fresh process on port 3082 used a synthetic learner repository. The
  real browser verified all four presentation transitions: `expand` opened on
  first load; a manual collapse survived the 30-second refresh; changing the
  queue while keeping `expand` opened the new revision once; changing the
  Agent decision to `collapse` folded it again.
- This proves bundle loading and panel interaction. It does not claim a learner
  write, RAG retrieval, background schedule, or mastery event.

## Commit / rollback

- The reviewed development commits are on `origin/main`. Use `git log` rather
  than a copied count as the authoritative list; the installed revision includes
  the panel, queue, one-tap close, ordering experiment, evidence-boundary
  corrections, the real-runtime RPC fix, and Agent-controlled presentation.
- Rollback: `git revert HEAD` (keeps history) or `git reset --hard HEAD~1`
  (discards the commit). Learner Git state is untouched by this round.

## Next work

No release gate remains for this round. Future work should begin from a
separate, evidence-backed learner scenario instead of extending the demo panel.
