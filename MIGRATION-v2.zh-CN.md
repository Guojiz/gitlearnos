# 迁移到 GitLearnOS v2

[English](MIGRATION-v2.md)

GitLearnOS v2 采用渐进迁移，不做破坏性重写。新内容遵守
[GITLEARNOS.zh-CN.md](GITLEARNOS.zh-CN.md)；只有能安全保留链接与历史时，
才移动已有学习证据。

## 主要变化

| 旧方式 | v2 |
|---|---|
| 把 GitHub 当作运行核心 | 本地或远程 Git 是核心；GitHub 只是适配器之一 |
| 多份文档重复定义行为 | `GITLEARNOS.md` 是唯一协议 |
| 学科文件放在根目录 | 放到 `subjects/<subject>/...` |
| `sessions/` | `events/`，只保存有价值学习事件，不保存完整聊天 |
| `repo-as-review-os*` Skills | `gitlearnos*` Skills |
| 所有学科强制置信度与 0–3 评分 | 评分只作为可选学科方法 |
| 写了提醒就算自动化 | 只有经过验证的真实执行才算完成 |

## 安全迁移顺序

1. 先提交或用其他方式保存当前仓库状态。
2. 缺失时加入 `gitlearnos.yml`、`learning-policy.md` 和根目录 dashboard。
3. 选定一个正在使用的学科，把新状态直接写入
   `subjects/<subject>/`。
4. 只有在链接可更新、可检查时，才逐步移动旧文件。
5. 原始作答、笔记和教师反馈保持不变；修正以新记录追加并链接旧记录。
6. 把 `sessions/` 中有价值的记录迁入 `events/`，完整聊天不进入长期状态。
7. 新 Skill 引用改为 `skills/gitlearnos*/`；v2 过渡期内旧名称由兼容入口继续读取。
8. 通过 `evals/` 中相关场景后，才宣布迁移完成。

新旧路径可以暂时共存。不要为了目录看起来整齐而进行一次性大搬迁。

## Git 托管

已有 Git 仓库无需搬走，它只是一个远程 Git 目标。同一协议也可用于
GitLab、Gitea、其他标准远程仓库，或完全没有远程的本地 Git 仓库。

## 完成检查

一个真实学习事件能够被整理、出题、作答、写回和撤销，并且过程中没有
伪造证据、掌握结论、调度执行或远程权限，才算迁移完成。
