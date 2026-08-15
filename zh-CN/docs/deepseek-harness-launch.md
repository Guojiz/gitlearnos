# GitLearnOS 来到 DeepSeek Harness

[English](../../docs/deepseek-harness-launch.md)

GitLearnOS 为官方 DeepSeek Harness **Developer Preview** 提供**独家原生支持**。
它把可验证的完整 Git 学习事务和由 Agent 控制的面板带入对话：主 Agent 决定下一步
和面板何时出现，学习者保留最后的手动控制。Host 只是有边界的管道，不拥有学习顺序。

## 当前代码实际证明了什么

经审查的 bundle 包含无构建 Host 和浏览器客户端。Host 提供有边界的
`learning_status`、`learning_route` 读取，以及一条由 `gitlearnos.yml` 配置授权的
`learning_apply` 事务。`safe-auto` 下，完成严格的学习者身份、设置/配置、写入权限
和基线版本检查后，它可以把 event、knowledge-gap、model、review、dashboard 的类型化
操作原子地合并为一次 Git 提交；`preview` 输出精确提案；`manual` 需要批准。回执包括
改动文件和 `git revert` 撤销边界。`learning_record` 仍是单事件兼容包装器。

浏览器客户端通过仅限回环的 RPC 读取 Agent 维护的 `Next up` 清单；它不排序、不写队列，
学习者仓库没有维护队列时不编造顺序，非学习者样例会明确标注，并且每个新版本只应用
一次 `Panel: expand|collapse` 决定。选择一个条目后，会显示五个代码已实现的对话动作：
复习、练习、用一道选择题收尾、问老师或查看学习者笔记。

## 独立层与有限路线

RAG provider 访问和冷会话重复 Worker 是独立层，当前 bundle **不会**调用或创建它们。
Harness Schedule 只在当前会话内有效，不能代替重复的仓库自动化。后续路线只包括更丰富
的视觉编辑、RAG bridge 和外部重复 Worker。

DeepSeek 官方 provider 是纯文本的。图片、截图、白板及其他视觉证据需要已验证的多模态
provider 或获授权的 OCR/解析路径；纯文本 Agent 不得臆测未看到的内容。即时点选答对只是
支持性证据，不等于已经掌握。

请固定到经过审查的 commit 安装，并按照[适配器说明](../../adapters/deepseek-harness/README.md)
完成验证与回滚。安装只证明 bundle 被发现，不能证明学习者仓库写权限、RAG 导入或后台部署。
