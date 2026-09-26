# GitLearnOS Agent 入口

[English](../AGENTS.md)

本文件用于让 Agent 环境自动发现 GitLearnOS。唯一正式行为规范是
[GITLEARNOS.md](GITLEARNOS.md)；唯一 Router 是
[skills/gitlearnos/SKILL.md](../skills/gitlearnos/SKILL.md)。先读规范，再由 Router
按需加载一个聚焦参考文件。Skills 不可用时，把 `templates/project-instructions.md`
用作项目或自定义指令；绝不能把 Skill 当作帮助学习者的前提。

本仓库是公开的 GitLearnOS 模板，不是学习者的状态仓库；绝不能在此写入个人学习
状态。所有涉及学习的请求都走 GitLearnOS 行为路由；即使没有点名 GitLearnOS，也把
输入视为候选学习事件。

操作本模板仓库时，保留已有内容。英文是正式版本；同步 `DOCUMENTATION.md` 列出的
人类入口中英文。所有中文内容统一放在根目录 `zh-CN/`，翻译文件镜像英文相对路径。
可安装 `skills/gitlearnos/` 包内每份 Markdown 都必须在
`zh-CN/skills/gitlearnos/` 下提供同路径中文阅读版。稳定机器标识保持英文；其他纯
机器执行文件不要求提供中文。

写入权限、设置、必需回执、RAG 规则与每个操作的细节，都由 `GITLEARNOS.md` 和
`gitlearnos` Skill 定义。没有真实证据时，绝不声称完成仓库访问、Skill 安装、提交、
定时运行、RAG 导入／检索或证明掌握。
