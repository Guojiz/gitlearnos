# GitLearnOS Comes to DeepSeek Harness

[中文](../zh-CN/docs/deepseek-harness-launch.md)

GitLearnOS now has a native learning surface for DeepSeek Harness.

Most AI study tools begin with another chat box. GitLearnOS begins with the
learning state the learner already owns. Goals, mistakes, reviews, notes, and
next steps stay in a readable Git repository. The main agent uses that evidence
to decide what deserves attention next.

In DeepSeek Harness, a `GitLearnOS ▸` bar shows that agent-maintained learning
queue beside the conversation input. The main agent decides whether a new queue
revision should open now or remain folded; that decision applies once, and the
learner can still toggle it without a timer reopening it. There are no subject
tabs and no Host-generated ranking. The learner sees one ordered list and
chooses a plain action: review it, practise it, ask a teacher, read their notes,
or close the point with one question.

The order belongs to the agent, not the plugin. The Host exposes bounded
evidence; the main agent weighs the learner's goal, prerequisites, urgency,
difficulty, importance, mastery, retention, and current constraints, then
writes the resulting `Next up` queue back to Git. The panel only reads that
order.

After an explanation, GitLearnOS can use one Harness-native multiple-choice
prompt as a lightweight close. A correct immediate answer remains supported
learning evidence, not proof of mastery. A wrong distractor suggests a likely
confusion; it does not pretend to prove the learner's hidden reasoning.

## What is real in this Developer Preview

- a no-build, installable DeepSeek Harness Host + browser bundle;
- an Agent-presented learning bar and flat agent-maintained queue, with the
  learner's manual toggle preserved;
- actions that place a useful request into the conversation and collapse the
  panel again;
- bounded status, routing, due-review evidence, and one policy-checked,
  reversible Git event transaction;
- loopback-only panel reads, explicit sample labeling, and no invented order
  when a learner queue has not been maintained;
- paired English and Chinese documentation and executable adapter tests.

## What it does not claim

The current bundle does not make RAG calls, provision verified cold-session
background automation, understand images through DeepSeek's text-only
provider, or prove mastery from an immediate tap. RAG-Anything remains an
optional local knowledge layer, and recurring maintenance still needs a real
repository-capable scheduler.

Install from a reviewed, pinned Git commit and follow the
[DeepSeek Harness adapter guide](../adapters/deepseek-harness/README.md) for the
exact verification and rollback steps.
