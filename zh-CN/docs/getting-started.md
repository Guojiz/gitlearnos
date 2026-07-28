# 开始使用

完整的第一条指令见[快速开始](../QUICKSTART.md)。

## 分开两个仓库

```text
GitLearnOS 模板仓库
→ 协议、Skills、适配器、模板、示例、评测

学习者仓库
→ 私有目标、证据、问题、作答、反馈和当前状态

项目 Sources 或本地来源文件夹
→ 大型教材、PDF、扫描件、媒体和参考文件
```

不要把个人学习状态写进公开模板。

## 首次建立

1. 让具备写入能力的 Agent 一次引导一个必要设置步骤。
2. 选择持久项目或来源区域，并把大型学习文件放在那里。
3. 提供模板、本地或远程 Git 目标，以及一个学科、目标或真实学习事件。
4. 让 Agent 检测真实的 Chat、Work 或其他 Agent 界面，以及记忆、指令、Skills、读取、写入、Git、来源和调度能力。
5. 只创建当前需要的最小文件，并配置持久触发。
6. 用一个不提 GitLearnOS 的普通学习问题或笔记测试设置。
7. 检查回执和 Git 提交。

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

核心闭环不要求 GitHub，但私有备份、跨设备连续性、教师审阅、共享课程资料和小组协作会从中受益。共享材料应与私密学习者状态分开。

另见 [Git 适配器](../adapters/git/README.md)与
[迁移说明](../MIGRATION-v2.md)。
