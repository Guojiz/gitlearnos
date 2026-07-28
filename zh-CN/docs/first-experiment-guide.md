# 第一次实验指南

先运行一个小而真实的学习事件，不要一开始就创建所有可能的空目录。

## 两个仓库

```text
GitLearnOS 模板
→ 方法与可复用资源

学习者仓库
→ 私有学习状态
```

学习者仓库可以是空白本地 Git 仓库，也可以是私有远程仓库。

## 指令

```text
请把 https://github.com/Guojiz/GitLearnOS 作为模板。
我的学习仓库或本地路径是：<target>
学科：<subject>
目标或当前学习事件：<input>

先阅读 zh-CN/GITLEARNOS.md。检测真实的读取、写入、Git、来源和调度能力。
只创建本次事件需要的文件。保留原始证据，只在有用时生成针对性问题，提交
安全写回，并如实报告实际发生了什么以及如何撤销。
```

## 预期最小结果

```text
gitlearnos.yml
AGENTS.md
learning-policy.md
dashboard.md
learner-profile.md
subjects/<subject>/goals/main-goal.md
```

如果输入是笔记、错题或教师反馈，还应出现一个或多个真实学科记录，不应出现
空目录。

## 通过条件

- 个人状态只进入学习者仓库；
- 事件链接到目标与来源证据；
- 学习者或教师的原始内容没有被覆盖；
- 生成的问题依据当前薄弱点；
- Agent 区分本地提交、远程 push 与调度；
- 重复输入不会创建副本；
- 存在一次可撤销 Git 更新和一份诚实回执。

更正式的检查见对应[评测场景](../evals/README.md)。
