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
   Tests now pass 23/23, including the no-Host-ranking and no-empty-state
   boundaries.

## Product direction (aligned via /grill-me)

The Harness-native surface is a "brainless learning" panel:

- one centered bar `GitLearnOS ▸`, collapsed by default; tap to expand a flat
  ordered list of knowledge points, each rendered as `name (action)`;
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
- The bundle client half is committed locally but NOT pushed; it reaches real
  sessions only after push + reinstall (see "Next decision").

## Commit / rollback

- The development commits are local on `main` and NOT pushed. Use `git log`
  rather than a copied count as the authoritative list; current `HEAD` includes
  the panel, queue, one-tap close, ordering experiment, and final evidence-boundary
  corrections.
- Rollback: `git revert HEAD` (keeps history) or `git reset --hard HEAD~1`
  (discards the commit). Learner Git state is untouched by this round.

## Next decision

1. Push and reinstall (`dsh plugin add github:Guojiz/gitlearnos#<sha>`) so the
   baked panel reaches real sessions — this needs your authority.
