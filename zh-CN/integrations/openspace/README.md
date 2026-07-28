# 可选 OpenSpace 接入

[English](../../../integrations/openspace/README.md)

[OpenSpace](https://github.com/HKUDS/OpenSpace) 将来可以用于评测、发现或提出
通用 GitLearnOS Skills 的改进。GitLearnOS 参考“能力应保持为可检查软件包”
这一思路，但不采用 OpenSpace Runtime。运行 GitLearnOS 不需要 OpenSpace，
它也不属于 v2 的发布验收条件。

接入边界：

- GitLearnOS Skills 仍是普通、可读的 Skill 包；
- 只允许使用合成或经过明确授权的评测轨迹；
- 默认排除真实学习记录；
- 演化结果只能作为候选 Skill，经审查和提交后才生效；
- 学习者的 Git 仓库始终是事实来源。

本仓库不会安装或配置 OpenSpace 运行环境。
