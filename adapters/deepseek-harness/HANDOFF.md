# GitLearnOS × DeepSeek Harness — Session Handoff

[中文](../../zh-CN/adapters/deepseek-harness/HANDOFF.md)

State record for one finished development round, so a different agent can
resume without re-deriving the decisions. It is state, not a feature spec.

## What is done (reviewable)

1. **Richer read-only observation in `learning_status`** — it now returns
   `dueReview` (`due` / `upcoming` / `noSignal` from explicit next-review dates),
   `reviewFiles`, `knowledgeGaps`, and an ordered `actions` queue (due reviews
   first by next-check date, then gaps). Pure projection; no write, Git
   mutation, RAG request, or scheduler request.
2. **"Close with one tap" in the protocol references** — after teaching a
   point, close with ONE multiple-choice item whose distractors are the likely
   misconceptions; a wrong distractor names the exact confusion. See
   `skills/gitlearnos/references/{session,question,review}.md` (EN + zh-CN).
3. Docs and eval scenario 16 updated. `npm run test:dsh` passes 18/18;
   `npm run check:dsh` passes.
4. **Agent-maintained learning queue** — `learning_status` returns `queue`
   (the `Next up` list from `dashboard.md`, verbatim, in the agent's order);
   `templates/dashboard.md` documents the convention and the system prompt
   tells the agent to maintain it. The agent owns the order; the tool only
   reads it, never writes it.

## Product direction (aligned via /grill-me)

The Harness-native surface is a "brainless learning" panel:

- one centered bar `GitLearnOS ▸`, collapsed by default; tap to expand a flat
  ordered list of knowledge points, each rendered as `name (action)`;
- **no categories, only an order** — and that order is the **agent's judgment**
  (reading difficulty / importance / mastery / retention from Git), never
  host-hardcoded;
- the axis is **"learner asks → AI teaches"**: before = agent ranks the queue;
  during = learner asks, AI teaches; after = one-tap multiple-choice close.

## Temporary prototype (not committed, dies on restart)

A dynamic Cordis plugin `glearn-1` previews this panel in the current session.
It is NOT part of the bundle and disappears on process restart.

## Deliberately deferred

- Baking the client UI into the bundle (needs tsdown build + ~6
  `@deepseek-ai/dsh-*` peerDependencies + `ctx.remote` typed RPC; costly and
  upstream-breakage-prone during Developer Preview).
- The client UI itself (the panel) is still only the temporary `glearn-1`
  dynamic plugin; the queue data layer is baked, the panel is not.
- Diagnostic multiple-choice as its own UI (now documented in the references;
  no UI yet).

## Commit / rollback

- One local commit on `main`, NOT pushed. See `git log -1` for the SHA.
- Rollback: `git revert HEAD` (keeps history) or `git reset --hard HEAD~1`
  (discards the commit). Learner Git state is untouched by this round.

## Next decision

1. Bake the panel client UI into the bundle (costly) or keep it as a separate
   deliverable.
2. Keep or stop the `glearn-1` prototype.
