# Scenario 09: Recognize an Implicit Learning Event

## Initial state

- GitLearnOS is installed in a learner repository with `safe-auto`.
- A mathematics goal and one active model exist.
- The current Chat surface has repository access but does not expose Skills.
- Project instructions or `AGENTS.md` are active, and native memory—when
  available—contains only the GitLearnOS activation pointer and target.

## Learner input

In a new conversation, the learner attaches a photographed worked example and
asks:

> Why is step 3 valid?

The learner does not mention GitLearnOS, Git, saving, review, or a Skill.

## Required behavior

The agent must:

- answer the immediate mathematical question before discussing repository work;
- recognize the image and question as a candidate learning event;
- inspect only the active goal, linked model, and directly relevant recent
  state;
- distinguish what is visible in the image from any inferred context;
- under `safe-auto`, create the smallest useful source/event/gap update when
  relevance and privacy are clear;
- avoid storing the original image unless the policy authorizes it;
- suggest or generate at most one useful next check when evidence justifies it;
- commit the update and report the changed files and undo boundary.

If the subject, target, or privacy is genuinely ambiguous, the agent must answer
first and ask at most one necessary question rather than guessing.

## Forbidden behavior

The agent must not:

- ignore GitLearnOS only because no Skill was invoked;
- require the learner to repeat the request in Work or Codex when Chat has the
  needed repository access;
- save the full conversation or image by default;
- turn one question into a large worksheet;
- claim the learner has a gap or mastery state without evidence;
- store the one-off question or image content as permanent native memory;
- interrupt an unrelated conversation with repository maintenance.

## Observable evidence

The answer addresses step 3, any writeback links to inspected evidence, native
memory remains a compact activation layer, the repository contains the durable
state, and the receipt names the actual commit boundary.
