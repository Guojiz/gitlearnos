# Demo：老师、Agent 与个人仓库协同学习

这是完全虚构的中考数学示例，不包含真实学校、老师或个人信息。它使用一个学习仓库中的 `subjects/math/` 文件夹，证明学习不需要发生在 AI 平台内部：真人老师负责一次关键答疑，一个主 Agent 自动整理、出题、同步和维护状态。

## 主目标

```text
在 30 天内提升中考数学几何模型识别能力。
```

## 完整过程

### 2026-07-03：AI 诊断

- 学习者独立想到相似三角形；
- 对应顺序写反；
- 关键提示后才能完成变式；
- 证据评分 1；
- 建立对应关系知识缺口。

### 2026-07-04：准备问老师

用户只说：

```text
明天补习，把这个问题整理成一份我可以问老师的材料。
```

Agent 自动生成 [老师问题包](subjects/math/handoffs/2026-07-04_similarity-teacher-pack.md)，写清题目定位、学习者尝试、具体卡点和希望老师检查的内容，并将缺口改为等待外部反馈。

### 2026-07-05：同步老师反馈

用户回来后只说：

```text
老师讲明白了：先按等角确定顶点，再写相似式，最后列比例。
这是我的笔记。更新仓库，不用 AI 再讲一遍。
```

Agent 自动：

- 记录 [老师反馈来源](subjects/math/sources/2026-07-05_teacher-feedback.md)；
- 将问题标记为 `resolved`；
- 更新相似三角形模型；
- 清除过时的“让 AI 重讲”任务；
- 生成三天后的三道 [迁移验证题](subjects/math/reviews/2026-07-08_teacher-feedback-check.md)；
- 写入一份最小 [跨渠道活动记录](subjects/math/events/2026-07-05_teacher-feedback-sync.md)；
- 不把“已由老师解决”冒充成独立掌握。

### 2026-07-08：独立验证

学习者独立完成三道不同形式的题并解释对应顺序，按本学科可选量表获得 3 分。
知识缺口保持 `resolved`，掌握状态更新为 `demonstrated`；后续延迟复测继续
补强证据，不引入额外掌握状态。

Agent 随后自动生成 [2026-07-15 延迟复习](subjects/math/reviews/2026-07-15_delayed-review.md)。当前环境没有真实调度器，因此诚实记录为“下次 Agent 接手时检查”，不声称已经建立后台提醒。

## 文件

```text
gitlearnos.yml
AGENTS.md
dashboard.md
learner-profile.md
subjects/math/goals/main-goal.md
subjects/math/sources/
subjects/math/models/geometry-similarity-model.md
subjects/math/knowledge-gaps/similarity-correspondence-gap.md
subjects/math/handoffs/2026-07-04_similarity-teacher-pack.md
subjects/math/reviews/
subjects/math/events/
```

## 这个 demo 证明什么

- 老师、纸笔笔记和 AI 都是一等学习渠道；
- 用户不需要指定仓库路径；
- Agent 能自动整理而不是重复教学；
- 出题基于目标、缺口、老师反馈和历史表现；
- 问题处理状态与掌握证据不会混淆；
- 重复输入应命中已有记录，而不是再造一套文件；
- 自动化分为当前真实写回、接手检查和可选后台调度；
- `gitlearnos.yml` 配置、改动文件和下一步都可检查。
