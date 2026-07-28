# 文档链接规则

GitLearnOS 的文档应该同时方便人类阅读，也方便 AI Agent 接手。

## 规则

面向人类阅读的文档，尽量使用可点击的 Markdown 链接。

如果内容是给 AI 复制的提示词、命令、目录树或机器可读指令，可以保留纯文本路径。

## 应该使用超链接的地方

- README 文件；
- Quickstart 文件；
- Start Here 文件；
- 面向公开读者的指南；
- 贡献指南；
- 文档索引区；
- 正文中引导人类去读另一个文件的地方。

示例：

```md
先读 [QUICKSTART.zh-CN.md](../../QUICKSTART.zh-CN.md)。
```

## 可以保留纯文本路径的地方

- 给 AI 工具复制粘贴的提示词；
- 代码块；
- 文件树；
- YAML front matter；
- skill 路由表；
- 路径本身就是示例内容的地方；
- `AGENTS` 或 `SKILL` 这类更偏机器接手的指令。

示例：

```text
先读 QUICKSTART.zh-CN.md 和 docs/zh-CN/skill-and-memory-runtime.md。
```

## 原因

AI 通常能理解纯文本路径和 Markdown 链接。

人类更适合点击链接导航。

所以，公开入口文档尽量链接化；提示词和机器指令可以保留纯文本路径。
