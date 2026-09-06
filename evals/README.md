# GitLearnOS Evaluation

[中文](../zh-CN/evals/README.md)

GitLearnOS is evaluated through documented learning scenarios, not exact text
matching. A human, an AI agent, or an optional skill-evaluation system may run
the same cases.

Each scenario defines:

1. initial state;
2. learner input;
3. required behavior;
4. forbidden behavior;
5. observable evidence.

Passing means the repository and receipt satisfy every required invariant. The
question wording, filenames, and prose may vary when links and ownership remain
clear.

## Core scenarios

- [Bootstrap from one request](scenarios/01-bootstrap.md)
- [Organize useful notes](scenarios/02-organize-notes.md)
- [Reconcile teacher feedback](scenarios/03-teacher-feedback.md)
- [Generate a due review](scenarios/04-due-review.md)
- [Write back an independent answer](scenarios/05-answer-writeback.md)
- [Avoid fabrication and duplicates](scenarios/06-no-fabrication.md)
- [Run without GitHub](scenarios/07-local-git.md)
- [Adapt to constrained-access SAT study](scenarios/08-constrained-access-sat.md)
- [Recognize an implicit learning event](scenarios/09-implicit-learning-event.md)
- [Use GitHub for teaching collaboration](scenarios/10-github-teaching-collaboration.md)
- [Continue without Skills](scenarios/11-no-skill-continuity.md)
- [Verify cross-agent Skill installation](scenarios/12-cross-agent-skill-install.md)
- [Route and verify required RAG](scenarios/13-rag-anything.md)
- [Synthesize a repeated error into a transferable model](scenarios/14-repeated-error-synthesis.md)
- [Verify recurring organization and questions](scenarios/15-recurring-automation.md)
- [Diagnose before writing a knowledge gap](scenarios/17-differential-diagnosis.md)


## Runtime adapter scenario

- [Verify native DeepSeek Harness integration](scenarios/16-deepseek-harness-native.md)

These scenarios are the v2 acceptance gate. OpenSpace, a database,
RAG-Anything specifically, and a particular Git host are not required; a
verified compatible RAG layer is required for complete deployment. A real
repository-capable recurring scheduler is required to pass Scenario 15's
verified-deployment variant; without one the only truthful result is
`incomplete`. Scenario 16 separately evaluates an optional runtime adapter and
does not make DeepSeek Harness a v2 requirement. During its Developer Preview,
the shipped narrow Host may earn `host-baseline-pass`; only a demonstrated
write-capable integration may earn `full-pass`.

## Machine-checkable artifact schema

```json
{"mode":"safe-auto|preview|manual","subject":"string","records":[{"id":"event|gap|model|review-*","path":"subjects/...","status":"string","version":1}],"links":[{"from":"id","field":"depends_on|composes_with|supersedes|conflicts","to":"id"}],"transition":"event→gap→model-draft→model-active→planned→transfer-attempted→mastery-learning|mastery-demonstrated","next_check":"YYYY-MM-DD|noSignal","queue":[{"id":"string","path":"subjects/..."}],"receipt_fields":["Mode","Subject","Organized","Questions","Changed files","Evidence","Automation actually completed","Skill installation","Next action","Undo"]}
```

Assert one-tap fallback, only-question redaction, evidence-backed promotion
without blocking conflicts, delayed independent transfer for demonstrated, and
canonical queue IDs/paths with material-change-only reorder.
- `18-no-overdiagnosis-new-learning.md` — expected new learning must not trigger interrogation-style diagnosis
