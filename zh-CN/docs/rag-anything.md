# RAG-Anything 部署卡

[English](../../docs/rag-anything.md)

GitLearnOS 默认建议启用本地 RAG 知识层，同时允许学习者拒绝。RAG-Anything
是首个明确支持和推荐的实现，不是唯一兼容实现。学习者拥有教材、长 PDF、课程
包、笔记或需要未来检索的长期个人知识时，它会很有用。没有它时 GitLearnOS
仍然工作。

## 职责

```text
                    唯一主 Agent
                 /        |        \
               Git   RAG-Anything   其他工具
```

Git 保存正式状态和记忆；RAG-Anything 保存可以重建的检索索引；主 Agent 负责
所有路由、导入、晋升和查询决定。不能增加第二个 RAG Agent。

## 先阅读、再询问、最后部署

部署 Agent 必须按以下顺序执行：

1. 完整阅读 `GITLEARNOS.md` 和 `START-HERE.md`；
2. 找到学习者仓库，不能与本模板混淆；
3. 询问学习目标、学科、当前资料及格式，以及是否启用 RAG-Anything；
4. 回答前不得安装、初始化、导入、提交或部署；
5. 检查本地 Python、存储、解析器、模型和提供方限制；
6. 只安装实际需要的最小官方上游能力；
7. 导入一份获授权真实资料，并运行一次可追溯真实查询；
8. 报告准确状态和撤销边界。

此学习者部署门槛不适用于维护、编写文档、测试或发布公开 GitLearnOS 模板。

不能在聊天中索取 API key 或秘密。只报告配置为已设置或未设置，不暴露值。

## 上游安装边界

遵循当前[官方 RAG-Anything 仓库](https://github.com/HKUDS/RAG-Anything)。
为保证可复现，安装固定版本的上游包：

```bash
python3.12 -m venv .rag-venv
.rag-venv/bin/pip install "raganything==1.3.1"
```

必须明确处理两个兼容风险，然后验证：

1. PyPI 当前发布的 `raganything` 是 1.3.1，但也存在旧的 0.0.1 版本。
   固定所需当前版本并检查实际安装版本，不能接受缓存、镜像或约束导致的旧版解析。
2. 上游 `raganything` 依赖 `mineru[core]`，而后者没有 Python 3.14 发行版，
   且新版本固定 `Requires-Python <3.14`。macOS Homebrew 默认 `python3` 常为
   3.14，因此要使用 Python 3.12 虚拟环境。

安装后先验证版本与导入再声称可用：
`.rag-venv/bin/python -c "import importlib.metadata as m; import raganything, lightrag; print(m.version('raganything'))"`。

1.3.1 直接插入结构化内容时，文本块必须使用
`{"type": "text", "text": "...", "page_idx": 0}`。不能把文本块的 `text`
字段替换成泛化的 `content`：调用可能成功退出，却实际索引零字符、零 chunk。
只有验证非零索引内容与可追踪的教材特定检索后，才能报告 RAG 为 `enabled`。

可选 extras 会扩大格式支持；Office 文档和解析器选择可能需要额外系统包、模型
或平台特定配置。不能盲目安装全部 extras。当前集成没有真实提供并验证时，不能
假设已经存在 MCP 服务器、Docker 服务或 Web API。

## 路由摘要

- 教材和长期基础资料：在 Git 登记，获授权时导入 RAG。
- 笔记和长期个人知识：在 Git 正式整理，再插入 RAG。
- 一次性练习和临时错误：先处理；按需记入 Git；暂不导入。
- 反复错误或可复用方法：晋升为 Git 正式知识，再以链接标识插入 RAG。
- 已经理解的图片或截图：插入忠实 Markdown／结构化内容，不重复 OCR。
- 长或关系丰富的原文档：获授权时让 RAG-Anything 解析原件。
- 通用问题：直接回答；只有个人资料或长期知识相关时才查询 RAG。

## 验收检查

`enabled` 要求接口可调用、选定格式依赖可用、一次真实获授权导入、一次带可追溯
标识的资料特定检索、检查过的索引边界，以及已知重建／删除路径。单独的包导入、
配置、健康、mock 或 dry run 输出都不能通过。
