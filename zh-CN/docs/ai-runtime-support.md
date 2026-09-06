# AI 运行环境支持

GitLearnOS 支持任何能够诚实执行学习者协议的主 AI 运行环境。产品名称不代表实际
权限：必须检查当前界面的仓库、来源、记忆、Skill 和调度能力。

## 核心版能力

主 Agent 必须能够：

1. 接收目标或学习事件，并识别有价值的隐式事件；
2. 读取最小相关的政策、Dashboard、目标和证据；
3. 整理证据并生成有依据的下一道问题；
4. 遵守写入权限和来源/隐私规则；
5. 写入目标，或者无法编辑时返回精确待写回内容；
6. 报告改动文件、提交、当前 Agent 工作以及确实验证过的后台工作。

实时辅导、Skills、原生记忆、网页搜索和视觉生成是可选增强；RAG 是完整部署的
必需检索层。纯文本
provider 看不到图片、截图、白板或其他视觉证据；应使用已验证的多模态或 OCR/解析
支持，或者要求忠实转录。不能推断未看到的内容。

## 运行角色

在仓库权限已验证时，Chat 或其他日常界面适合短问题和学习事件；Work 或代码 Agent
适合设置、导入、迁移和维护。`safe-auto` 下当前 Agent 可以执行即时安全写回；重复
后台任务需要调度器按时调用同一个主 Agent、提供仓库访问，并留下已观察运行。

## GPT-6 Astra 与自主使用 Skill

GPT-6 Astra 的通用推理更强，但长期指令仍然有用。OpenAI 当前模型指南指出，Astra
对 Skills 与 `AGENTS.md` 中的指令更敏感，因此 GitLearnOS 保留一个很小的两层触发：

1. `AGENTS.md` 要求任何能读取仓库的 Agent 识别有价值的学习事件，无需等待 Skill
   命令就完成路由；
2. `gitlearnos` Skill 的 description 写明同一批事件，让只扫描 Skill 摘要的运行环境
   自动选择它，再由 Skill 正文加载最小操作参考。

事件判断仍由模型完成；这些文件用于跨模型、跨对话保留归属、证据、RAG 与写入边界。
参见 OpenAI 的[最新模型指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra)
与官方 [Skill creator 指南](https://github.com/openai/codex/blob/main/codex-rs/skills/src/assets/samples/skill-creator/SKILL.md)。

## 状态边界

学习者仓库存放变化中的目标、证据、政策和历史。Project Sources 存放大型可复用资料。
原生记忆只负责唤醒行为和缓存稳定偏好。RAG 可重建、由同一个主 Agent 管理，并且
是完整部署的必需层。隐藏运行时记忆不能证明学习状态；没有直接证据也不能声称调度已经运行。
