# GitLearnOS 评测

[English](../../evals/README.md)

GitLearnOS 使用文档化学习场景评测，不逐字比较 AI 输出。人类、AI Agent 或可选的 Skill 评测系统都可以执行同一套场景。

每个场景定义：

1. 初始状态；
2. 用户输入；
3. 必须完成；
4. 禁止行为；
5. 可观察的验收证据。

仓库结果和回执满足全部行为约束即为通过。在链接与归属清楚的前提下，题目措辞、文件名和说明文字可以不同。

## 核心场景

- [一句话初始化](scenarios/01-bootstrap.md)
- [整理有价值的笔记](scenarios/02-organize-notes.md)
- [同步老师反馈](scenarios/03-teacher-feedback.md)
- [生成到期复测](scenarios/04-due-review.md)
- [独立作答后写回](scenarios/05-answer-writeback.md)
- [避免编造与重复](scenarios/06-no-fabrication.md)
- [不依赖 GitHub 运行](scenarios/07-local-git.md)
- [适应使用条件受限的 SAT 学习](scenarios/08-constrained-access-sat.md)
- [识别隐式学习事件](scenarios/09-implicit-learning-event.md)
- [用 GitHub 支持教学协作](scenarios/10-github-teaching-collaboration.md)
- [没有 Skills 时保持连续性](scenarios/11-no-skill-continuity.md)
- [验证跨 Agent Skill 安装](scenarios/12-cross-agent-skill-install.md)
- [路由并验证可选 RAG-Anything](scenarios/13-rag-anything.md)
- [把重复错误归纳为可迁移模型](scenarios/14-repeated-error-synthesis.md)
- [验证重复整理与出题](scenarios/15-recurring-automation.md)
- [写入知识缺口前先做鉴别诊断](scenarios/17-differential-diagnosis.md)


## 运行时适配场景

- [验证 DeepSeek Harness 原生适配](scenarios/16-deepseek-harness-native.md)

这些场景就是 v2 的发布验收条件。OpenSpace、数据库、向量索引、RAG-Anything
和特定 Git 托管平台都不是必需项。通过场景 15 的已验证部署变体需要真正拥有
仓库能力的重复调度器；没有这种调度器时，唯一诚实结果是 `incomplete`。
场景 16 单独评测可选运行时适配，不会把 DeepSeek Harness 变成 v2 必需项。
在 Developer Preview 阶段，当前发布的狭窄 Host 可以取得
`host-baseline-pass`；只有被真实证明拥有写能力的适配才能取得 `full-pass`。

## 机器可判定产物模式

```json
{"mode":"safe-auto|preview|manual","subject":"string","records":[{"id":"event|gap|model|review-*","path":"subjects/...","status":"string","version":1}],"links":[{"from":"id","field":"depends_on|composes_with|supersedes|conflicts","to":"id"}],"transition":"event→gap→model-draft→model-active→planned→transfer-attempted→mastery-learning|mastery-demonstrated","next_check":"YYYY-MM-DD|noSignal","queue":[{"id":"string","path":"subjects/..."}],"receipt_fields":["Mode","Subject","Organized","Questions","Changed files","Evidence","Automation actually completed","Skill installation","Next action","Undo"]}
```

断言一句确认回退、只发题隐藏答案、无阻断冲突的证据晋升、延迟独立迁移才能
demonstrated，以及队列只含规范 ID/路径且仅在实质变化后重排。
