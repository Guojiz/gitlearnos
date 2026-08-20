# 常见问题

## GitLearnOS 是什么？

GitLearnOS 是一套 Git 原生学习协议：一个有能力的主 AI Agent，加一个由
学习者拥有的仓库。它整理证据、生成针对性问题、记录作答和外部反馈，并让
每次有价值的更新都可撤销。

它不是独立辅导应用，也不只支持 GitHub。

## 每个错误都会变成知识缺口吗？

不会。表面错误只是信号。Agent 必须保留互竞假设，提出鉴别性追问；只有会改变
教学动作的替代解释已被排除或明显削弱时，才按当前最佳支持卡点写入
`supported` 缺口。共享干预或追问预算耗尽可以停问，最多写成 `suspected`。
被否定的假设以 `falsified` 留在记录里。见[鉴别诊断](docs/differential-diagnosis.md)。


## 这个仓库就是我的学习仓库吗？

不是。这里是公开模板，保存协议、Skills、适配器、示例和评测。个人学习记录
应放在另一个私有仓库里。

## 需要什么？

- 一个能读写 Git 仓库的 AI Agent；
- 一个本地或远程学习仓库；
- 一个学科、目标或真实学习事件。

从[快速开始](QUICKSTART.md)。

## 必须用 GitHub 吗？

不必。本地 Git、GitHub、GitLab、Gitea 和其他标准 Git 远程仓库遵守同一套
核心协议。GitHub 只是方便的托管和连接方式。

GitHub 适合私有备份、跨设备连续性、教师或导师审阅、共享课程资料和小组协作。共享材料要与私密学习者状态分开。

## 每次都必须调用 GitLearnOS 或 Skill 吗？

不必。经过引导式设置后，`AGENTS.md` 或项目指令提供强制行为，原生记忆可以提供跨对话激活指针，Agent 应自动注意到有价值的问题、答案、拍摄页面、笔记、反馈和结果。Skills 是可选工作流指南。Agent 不应保存偶然聊天。

可以直接使用[项目或自定义指令](../templates/project-instructions.md)和
[原生记忆指针](../templates/native-memory-pointer.md)；设置流程应验证每个
可用层，不能因为起草了记忆文字就假定已经保存。

## 看见 `SKILL.md` 就代表 GitLearnOS 已安装吗？

不是。完整 [`skills/gitlearnos/`](../skills/gitlearnos/) 文件夹只是源包。Codex
和 OpenCode 通常需要把它放在 `.agents/skills/gitlearnos/`；Claude Code
需要 `.claude/skills/gitlearnos/`。只有当前运行环境确实列出 `gitlearnos`、
间接学习输入能够选择它，并且打包参考文件可以加载，才能验证为已安装；否则
报告 `source-only`、`unavailable` 或 `unknown`。

见[跨 Agent 安装表](adapters/agents/README.md#不同-agent-如何发现-skill)。

## 应该使用 Chat 还是 Work？

当前项目或会话具备已验证仓库权限时，用 Chat 处理日常学习。设置、大型导入、多文件整理、维护或较大复习使用 Work。能力、Skills 可用性和额度处理会随套餐和界面变化，因此应检查当前账号，不能想当然。

## 必须上传所有原始材料吗？

不必。把大文件、截图、书籍、原始导出和私有工作文件放在持久 Project Sources 或获授权的本地来源文件夹中。Git 仓库只需保存准确的来源定位、可用状态，以及 Agent 实际使用过的部分。

见[来源与学习者状态](docs/source-and-learner-state.md)。

## 会保存聊天记录吗？

不会。它保存有价值的学习事件和证据，不保存普通聊天或隐藏推理。原始作答、
笔记和教师反馈会保留；AI 总结和计划可随新证据修改。

## 如何判断掌握？

阅读、完成、立即模仿，以及老师解决了一个问题，都不能证明掌握。最低状态为
`unknown`、`learning`、`demonstrated`；只有间隔后的独立作答成功，且目标
需要时完成迁移，才能标记为 `demonstrated`。

## 必须配置调度器、服务器、数据库或向量库吗？

服务器、数据库和向量库仍然可选。调度提供方可替换，但要完成一次
**学习者部署**，必须有真正拥有仓库能力的重复调度器：`maintenance` 与
`due-review` 都要有明确的学习者本地时间、IANA 时区、真实任务 ID 和测试运行。
没有调度器时，交互式使用可继续，Agent 也可在下次接手时检查到期任务，但部署
自动化是 `incomplete`。

## 首次建立的仓库应包含什么？

```text
gitlearnos.yml
AGENTS.md
automation.md
dashboard.md
learner-profile.md
subjects/
└── <subject>/
    └── goals/
        └── main-goal.md
```

其他学科目录只在第一次有真实内容时创建。
Claude Code 还会得到一个精简 `CLAUDE.md`；支持 Skills 的主 Agent 会得到一份
原生 `gitlearnos` Skill 文件夹。

## 如何判断 Agent 是否实事求是？

查看固定回执：模式、学科、整理的证据、问题、改动路径、实际完成的自动化、
Skill 安装、下一步和撤销边界。访问、写入、push、调度、Skill 和掌握结论都
必须有可验证依据。

## 如何迁移旧仓库？

按照 [v2 迁移指南](MIGRATION-v2.md)渐进迁移。新文件立即
使用分科目录；旧路径只有在链接能保留时才逐步移动。
