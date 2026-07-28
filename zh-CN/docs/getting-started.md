# 开始使用

完整的第一条指令见[快速开始](../QUICKSTART.md)。

## 分开两个仓库

```text
GitLearnOS 模板仓库
→ 协议、Skills、适配器、模板、示例、评测

学习者仓库
→ 私有目标、证据、问题、作答、反馈和当前状态
```

不要把个人学习状态写进公开模板。

## 首次建立

1. 把模板与一个本地或远程目标交给能写入的 Agent。
2. 提供一个学科、目标或真实学习事件。
3. 让 Agent 检测真实的读取、写入、Git、来源和调度能力。
4. 只创建当前确实需要的最小文件。
5. 检查回执和 Git 提交。

最低可用目标为：

```text
gitlearnos.yml
AGENTS.md
learning-policy.md
dashboard.md
learner-profile.md
subjects/
└── <subject>/
    └── goals/
        └── main-goal.md
```

Git 不保存空目录。来源、模型、薄弱点、交接、复习和事件只在第一次有真实内容
时创建。

## 能力边界

只有本地写权限也能完成核心闭环，但不代表可以远程 push、操作 GitHub Issues
或建立调度任务。Agent 必须在回执中区分本地写入、提交、推送和后台执行。

另见 [Git 适配器](../adapters/git/README.md)与
[迁移说明](../MIGRATION-v2.md)。
