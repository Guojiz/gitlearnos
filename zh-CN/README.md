# GitLearnOS

<p align="center">
  <img src="../website/media/gitlearnos-harness-mascot.png" width="240" alt="身穿橙色 Git 分支 Harness 的 GitLearnOS 漫画书本 Agent">
</p>

<p align="center"><strong>学习者拥有的 Git 记忆 · GitLearnOS 独家原生 DeepSeek Harness 支持</strong></p>

<p align="center"><em>学习发生在任何地方，状态属于你。</em></p>

<p align="center">
  <a href="https://guojiz.github.io/gitlearnos/"><img alt="官网" src="https://img.shields.io/badge/官网-guojiz.github.io%2Fgitlearnos-111111?style=flat-square"></a>
  <a href="../LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-111111?style=flat-square"></a>
  <a href="https://github.com/Guojiz/gitlearnos/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/Guojiz/gitlearnos?style=flat-square"></a>
</p>

<p align="center">
  <a href="https://guojiz.github.io/gitlearnos/"><strong>打开官网 →</strong></a>
  ·
  <a href="QUICKSTART.md"><strong>核心版快速开始 →</strong></a>
</p>

[English](../README.md) ·
[官网](https://guojiz.github.io/gitlearnos/) ·
[文档地图](DOCUMENTATION.md) ·
[协议](GITLEARNOS.md) ·
[作者站点](https://guojiz.github.io/) ·
[X](https://x.com/guojizh) ·
[哔哩哔哩](https://space.bilibili.com/3493114115263006) ·
[赞助](https://github.com/Guojiz/Sponsors)

![GitLearnOS 中文概览](../docs/assets/gitlearnos-map.svg)

## 核心承诺

GitLearnOS 让一个有能力、可替换的主 AI Agent 使用学习者拥有的 Git 记忆。它
注意有价值的学习事件，把证据连接到目标，引导下一步，并留下可检查、可撤销的
记录。

学习可以发生在老师、课堂、纸笔、教材、题库、项目、同伴或另一个 AI 中。它不把
学习全部搬进一个应用；主 Agent 只连接对学习者下一次决策有用的证据。

只要有一个私有本地 Git 仓库、一个具备写入能力的 Agent、GitLearnOS 协议以及一
个学科或真实学习事件，核心闭环就可以开始。GitHub 和其他远程仓库都是可选项。
日常学习时 Git 在后台工作，学习者无需管理文件夹、分支或提交。

默认建议使用**私有仓库**。只有在学习者选择备份、跨设备连续性、教师审阅、协作
或发布时才添加远程，并把私密答案和薄弱点与共享材料分开。

## 先核心就绪，再进入日常学习

Agent 先处理眼前请求。在 `safe-auto` 下，只有目标、证据、目标学科和隐私边界
明确时，才可执行最小安全写回；`preview` 只展示精确变更而不写入；`manual` 必须
等待批准。原始作答、笔记和外部反馈始终保留；AI 解释可以修改，但必须连接证据。

配置完成后，学习者无需说“使用 GitLearnOS”或点名 Skill。问题、作答尝试、页面
照片、课堂笔记、老师评语、练习结果或反复困难都可能是学习事件；偶然聊天不会保存。

```text
目标与真实输入
→ 整理可追溯证据
→ 从当前薄弱点出题
→ 保留作答或外部反馈
→ 之后独立复测
→ 用一次可撤销 Git 提交更新状态
```

成功标准是学习者在后续问题中独立表现得更好，而不是生成更多整齐笔记。回执会区
分当前 Agent 立即完成的工作与同一个主 Agent 的已验证定时运行。

## 小而有用的仓库

```text
gitlearnos.yml
AGENTS.md
automation.md
dashboard.md
learner-profile.md
subjects/
└── <subject>/
    ├── goals/
    ├── sources/
    ├── models/
    ├── knowledge-gaps/
    ├── reviews/
    └── events/
```

只有真实学习证据需要时才创建目录。根目录保存共享配置和当前视图；学科目录保
存聚焦状态。大型教材、PDF、扫描件、媒体和长期参考资料放在 Project Sources 或
获授权的本地文件夹；Git 保存紧凑状态、出处、选定片段和历史。

## GitLearnOS 独家原生 DeepSeek Harness 入口

GitLearnOS 为官方 DeepSeek Harness Developer Preview 提供可安装的原生 bundle。
它把可验证的完整 Git 学习事务和由 Agent 控制的面板带入 Harness：主 Agent 拥有有序
的 `Next up` 队列和展示决定，学习者保留最后的手动开关。Host 只提供有边界的管道，
不能自行排名，也不能把面板状态冒充学习证据。

本仓库当前代码实际证明了：

- Harness profile 可以发现无构建 Host 和浏览器 bundle；
- `learning_status` 与 `learning_route` 提供有边界的只读观察；
- 一个由 `gitlearnos.yml` 配置授权的 `learning_apply` 事务可把 event、knowledge-gap、model、review
  和 dashboard 的类型化操作原子地合并为一次可撤销 Git 提交，并执行严格的学习者
  身份、设置/配置、基线版本和写入权限检查；`learning_record` 仍是兼容包装器；
- 一个只读、仅回环访问的面板展示 Agent 维护的队列，遵守 `Panel: expand|collapse`，
  并明确标记开发演示数据；
- 队列提供五个动作，把“复习、练习、用一道题收尾、问老师、看笔记”请求放入对话输入框。

RAG provider 访问仍是可选独立层，尚未内建在该 bundle 中。DeepSeek 默认 provider
是纯文本的，但 Harness 本身不限于文本。学习者可以直接配置支持图片输入的第三方
多模态模型，也可以保留 DeepSeek 主模型并安装获授权的视觉/OCR桥接插件；两者都没有
启用时，Agent 应请求转写而不是猜图。一次即时选择题答对只是有支持的证据，不等于
已经掌握。重复检查由真实调度器按时唤起同一个主 Agent，不需要第二个学习 Agent。
见[发布说明](docs/deepseek-harness-launch.md)和[适配器的限制与验证步骤](../adapters/deepseek-harness/README.md)。

## RAG 与后台工作是分开的层

对于大量教材、课程包、笔记或长期个人知识，默认建议（但不强制）启用本地 RAG。
[RAG-Anything](https://github.com/HKUDS/RAG-Anything) 是首个明确支持的选项，不是锁定。

- **Git** 是正式、可阅读的学习事实来源。
- **RAG** 是可重建的检索层，用于获授权来源和晋升后的长期知识；由同一个主 Agent
  管理，不增加第二个 Agent。
- **当前 Agent** 可以整理证据并立即提交变化。
- **定时自动化** 由能够访问仓库的真实调度器按时唤起同一个主 Agent。日期、提醒、
  Harness 会话内调度或 `requested` 标记都不证明任务已经运行；`maintenance` 与
  `due-review` 只有在真正的调度器中创建并观察到测试运行后才算完成。

学习者可以拒绝 RAG，GitLearnOS 仍可用。一次性练习不会自动进入 RAG。主 Agent 已
理解图片时，应保存忠实 Markdown 或结构化表示，不重复 OCR；纯文本 Agent 不得推断
未看到的视觉内容。

## 从一个学科开始

请使用[核心版快速开始](QUICKSTART.md)，其中保存唯一标准设置指令。它会要求 Agent
确认私有目标、学习目标、学科和当前资料，建议本地 RAG，在学习者部署前等待，检测
真实能力并报告撤销边界。官网 CTA 链接到同一来源；它不会创建仓库，也不会假装
按钮已经创建调度器。

[AceSAT 演示](LIVE-DEMO.md)用一个虚构学习者展示短小、以文本为主的闭环。它仍需
要可用的 AI 运行环境；本地 Git 不等于完全离线的 AI 系统。完全离线还需要当前运行
环境确实支持的本地模型和本地工具链。

另见[影响说明](../docs/acesat-build-for-impact.md)与完整的
[SAT 示例](../examples/en/demo-sat-lite/)。

## 先事实，再完整度

- 原始证据始终保留；更正使用关联记录，不静默改写。
- 重要结论必须指向可追溯证据；缺失证据保持 `unknown`。
- 外部解决与延迟后的独立掌握分开记录。
- Dashboard 是当前视图，不是第二事实来源。
- 没有直接证据时，GitLearnOS 不声称写入、提交、RAG 检索、调度运行、Skill 安装或掌握。

完整行为见[GITLEARNOS.md](GITLEARNOS.md)，部署见[QUICKSTART.md](QUICKSTART.md)，
端到端场景见[评测](../evals/README.md)。

## 官网与其它入口

GitLearnOS 的对外入口是官网。它与本仓库说同一件事：一次按真实 DeepSeek Harness
结构组织的学习会话、唯一标准快速开始，以及不会假装“按钮已经创建调度器”。

| | |
| --- | --- |
| **官网** | https://guojiz.github.io/gitlearnos/ |
| **快速开始** | [QUICKSTART.md](QUICKSTART.md) |
| **作者站点** | https://guojiz.github.io/ |
| **X** | https://x.com/guojizh |
| **哔哩哔哩** | https://space.bilibili.com/3493114115263006 |
| **YouTube** | https://youtube.com/@guojizh |
| **赞助** | https://github.com/Guojiz/Sponsors |

### 其它已上线官网的项目

- [Word Snap](https://guojiz.github.io/word-snap/) — 双语单词匹配 PWA
- [Guojiz](https://guojiz.github.io/) — 作者站点与 AI 安全文稿

## 项目状态

本分支开发 Git-native v2 协议与 DeepSeek Harness Developer Preview。MIT License，
见 [LICENSE](../LICENSE)。
