# Architecture

GitLearnOS has four logical layers. They are file responsibilities, not
services that must be deployed.

## Evidence

Original learner answers, useful notes, external feedback, and accurate source
locators. Preserve these records and correct them through linked additions.

## Derived state

Goals, models, knowledge gaps, learner-profile observations, and plans. The
agent may revise these when newer linked evidence justifies the change.

## Action

Targeted questions, review records, handoff packs, one next action, and the two
portable automation intents. Actual execution depends on verified runtime
capability.

## Infrastructure

Markdown and small YAML files in local or hosted Git. Agent, hosting,
automation, search, and OpenSpace adapters are replaceable. None becomes the
only copy of learning truth.

Subject-specific state lives under `subjects/<subject>/`; root files coordinate
policy and current views. See [GITLEARNOS.md](../GITLEARNOS.md).
