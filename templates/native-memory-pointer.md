# GitLearnOS Native-Memory Pointer

[中文](../zh-CN/templates/native-memory-pointer.md)

Native memory is optional. It wakes the learning behavior in a later
conversation; it does not replace project instructions or the learner
repository.

With the learner's permission, ask the active AI to remember an adapted version
of this compact entry:

```text
GitLearnOS is active for my learning. Treat my subject questions, attempted
answers, mistakes, photographed pages, notes, teacher feedback, and results as
candidate learning events even when I do not name GitLearnOS or invoke a Skill.
Answer my immediate request first and do not save incidental conversation.
My active project or learner repository is <target>. I prefer <safe-auto /
preview / manual> behavior, subject to the stricter repository learning policy.
Use project or repository instructions for the workflow and the Git repository
as the source of truth. Remember only stable goals, preferences, and privacy
constraints; do not store raw notes, complete chats, secrets, current gaps, or
changing review state in native memory.
```

Replace the placeholders; do not store inaccessible paths, credentials, or a
target the agent cannot identify later.

## Verify instead of assuming

After requesting the memory update:

1. check whether the current runtime reports that memory is enabled;
2. ask the agent to restate only the saved activation pointer and target;
3. correct missing, stale, or overly broad content;
4. report `saved`, `suggested`, `unavailable`, or `unknown`;
5. test a later conversation with an ordinary subject question that does not
   name GitLearnOS or a Skill.

Memory updates may be delayed or unavailable. A drafted memory entry is not a
verified memory update. When verification is impossible, retain the exact entry
as pending setup and rely on project instructions plus repository reads.
