# GitLearnOS 评测

[English](README.md)

GitLearnOS 使用文档化学习场景评测，不逐字比较 AI 输出。人类、AI Agent 或可选的 Skill 评测系统都可以执行同一套场景。

每个场景定义：

1. 初始状态；
2. 用户输入；
3. 必须完成；
4. 禁止行为；
5. 可观察的验收证据。

仓库结果和回执满足全部行为约束即为通过。在链接与归属清楚的前提下，题目措辞、文件名和说明文字可以不同。

## 核心场景

- [一句话初始化](scenarios/zh-CN/01-bootstrap.md)
- [整理有价值的笔记](scenarios/zh-CN/02-organize-notes.md)
- [同步老师反馈](scenarios/zh-CN/03-teacher-feedback.md)
- [生成到期复测](scenarios/zh-CN/04-due-review.md)
- [独立作答后写回](scenarios/zh-CN/05-answer-writeback.md)
- [避免编造与重复](scenarios/zh-CN/06-no-fabrication.md)
- [不依赖 GitHub 运行](scenarios/zh-CN/07-local-git.md)
- [适应使用条件受限的 SAT 学习](scenarios/zh-CN/08-constrained-access-sat.md)

这些场景就是 v2 的发布验收条件。OpenSpace、数据库、向量索引和特定 Git 托管平台都不是必需项。
