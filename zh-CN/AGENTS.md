# GitLearnOS Agent 入口

[English](../AGENTS.md)

本文件用于帮助中文读者理解 Agent 入口。唯一正式行为规范是英文
[GITLEARNOS.md](../GITLEARNOS.md)；[中文协议](GITLEARNOS.md)是阅读辅助，
冲突时以英文为准。

开始操作前：

1. 完整阅读 `GITLEARNOS.md`；
2. 区分本公开模板与学习者的目标 Git 仓库；
3. 检查真实的读取、写入、Git、来源和调度能力；
4. 读取目标策略、Dashboard、当前学科目标和最低限度的相关证据；
5. 即使用户没有提 GitLearnOS 或调用 Skill，也先在内部判断当前输入是否是
   有价值的学习事件；
6. 需要相应工作流时，从 `zh-CN/skills/gitlearnos*/` 阅读对应中文 Skill，
   并用相同的英文 Skill 名称执行。

操作本模板仓库时，保留已有内容。英文是正式版本；同步
`DOCUMENTATION.md` 列出的人类入口中英文。所有中文内容统一放在根目录
`zh-CN/`，翻译文件镜像英文相对路径。`skills/` 下的每份 Skill 都必须在
`zh-CN/skills/` 下提供同路径中文阅读版；稳定机器标识仍保留英文。其他纯机器
执行文件不要求提供中文。

操作学习者仓库时，同时根据 `gitlearnos.yml` 和 `learning-policy.md` 判断
有效写入权限；两者冲突或含糊时采用更严格的一项。只有有效模式为 `safe-auto`
时，才能无需再次确认地完成安全、可撤销的整理、出题、短期计划与 Git 写回。
`preview` 只展示拟议改动，不写入；`manual` 或政策禁用自动写入时，等待明确
批准，或返回精确的待写回内容。始终先解决学习者眼前的需要。不能因为安装了
GitLearnOS 就保存无关对话。

没有真实证据时，绝不能声称已经访问仓库、完成提交、建立后台调度或证明掌握。
