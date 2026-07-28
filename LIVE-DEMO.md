# Three-Minute Working Demo

[中文](LIVE-DEMO.zh-CN.md)

This demo shows an AI agent taking useful action for a fictional SAT learner
with constrained access. It uses plain Markdown and local Git; no custom app,
API key, database, or background scheduler is required.

ChatGPT Work can run this path with its built-in file and Git operations. The
temporary learner repository stays local; GitHub is not part of the demo.

## What the judge needs

- this repository;
- ChatGPT Work or another AI agent that can read, write, and commit a local Git
  repository;
- about three minutes.

The AI runtime itself may require a device and connectivity. This demo does not
claim otherwise.

## Start

Give the following request to the write-capable agent:

```text
Use the current GitLearnOS repository as the template. Create a temporary local
learner repository from examples/en/demo-sat-lite and initialize Git there.
Do not modify the public template.

Act for this fictional student: I use a shared phone, have limited mobile data,
can study for 20 minutes three days a week, and cannot rely on paid tutoring.
Inspect only the policy, dashboard, active English goal, and linked evidence.
Check the due vocabulary-in-context gap. Give me exactly one fresh, short,
plain-text SAT-style question without copying an official question or showing
the answer. Explain in one sentence why you selected it. Persist only useful
state, commit any safe writeback, report what actually changed, and then wait
for my answer. Do not claim a background reminder exists.
```

## Answer

After the agent asks its question, answer it naturally. If a sample answer is
needed:

```text
I would first ignore the choices, use the sentence to predict the exact missing
meaning, and then remove words that only match the general topic. I did not use
help.
```

Then ask:

```text
Save my answer and feedback. Update the next check, but only mark mastery if
the protocol's evidence standard is actually met.
```

## Observable pass conditions

The agent should:

1. use the existing practice event, source, model, and gap instead of browsing
   for more material;
2. deliver one immediately answerable item, not a generic reminder or long
   worksheet;
3. preserve the learner's answer and support used;
4. keep mastery at `learning` after an immediate attempt and request delayed
   independent evidence;
5. update the dashboard or review state and create a reversible Git commit;
6. state that the next check is pending or on-handoff when no real scheduler
   exists.

The exact question and filenames may vary. The evidence and behavior must not.

## What this proves

This is more than question answering. The agent reads durable learner state,
chooses the next action within access constraints, writes the interaction back,
updates future work, and leaves an auditable undo boundary.

The demo does not prove school-wide learning impact. That requires a real pilot;
the proposed measures are listed in the
[one-page impact statement](docs/acesat-build-for-impact.md).
