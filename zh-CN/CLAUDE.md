# GitLearnOS Claude Code 入口

[English](../CLAUDE.md)

@../AGENTS.md

通过上述正式导入加载的根目录英文 `AGENTS.md`，以及正式 `GITLEARNOS.md`，
仍然是本模板仓库的正式规则。

可安装源是完整的 `skills/gitlearnos/` 文件夹。为 Claude Code 设置学习者仓库
时，把整个文件夹复制到 `.claude/skills/gitlearnos/`，把
`templates/AGENTS.md` 复制为 `AGENTS.md`，并把 `templates/CLAUDE.md`
适配为 `CLAUDE.md`。必须验证斜杠命令自动补全确实出现 `/gitlearnos`；只有
文件存在但未被发现时，只能报告 `source-only`。

不要把学习者状态写进本公开模板。
