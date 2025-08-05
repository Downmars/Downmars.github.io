---
title: "这样写Git Commit Message也许会更好"
date: 2025-07-28T16:55:15+08:00
lastmod: 2025-07-28T16:55:15+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: [""]
categories: [""]

# 描述
description: "" # SEO 搜索优化
summary: ""    # 列表页展示的简短描述

# 自定义url
slug:

# 是否被允许搜索
searchHidden: false

# 可选：权重（用于置顶文章）
weight: null

license: "CC-BY-NC-4.0"  # 对应 data/licenses.yml 中的 keys

# 可选：封面图片
cover:
    image: ""
    alt: ""
    caption: ""
---

我在写博客中的过程中，我往往会对于一篇博客进行多次的增添与修改，我一直苦恼于这次修改后如何添加Commit Message。就在刚才的又一次提交中，我想我应该规范下我的Commit Message的规范了，遂写下这一篇文章。  

本文大量参考了[ Git Commit Message 這樣寫會更好，替專案引入規範與範例](https://wadehuanglearning.blogspot.com/2019/05/commit-commit-commit-why-what-commit.html)。  

## 更新策略  
- 滚动修订优先： 旧文直接补充与修订，避免“同题多篇”分裂记忆。  
- 大改才另开篇： 观点反转或者结构完全重写的时候，新开文章在旧文的显著处链接。  

## Commit Message 规范  
为原子化提交内容仓库裁剪一个最小合集：  
| type | range |
|------|-------|
| docs | 正文与文案（新增/修订文章、摘要、目录） |
| fix | 修复错误（错链、事实性错误、代码示例错） |
| refactor | 重构结构与逻辑（不改变核心结论/语义） |
| style | 不影响语义的格式（排版、空白、标题层级统一） |
| perf | 体积/性能（压缩图片、懒加载、关键 CSS） |
| chore | 杂项维护（标签、站点地图、引用更新、构建方案更新） |  

## Commit 模板  
### 单行版（日常小修改）  
```md 
<type>(<scope>): <subject>

# 示例
docs(post:neovim-plugins): clarify debugger vs print checklist

```

### 标准版（包含what/why，便于回溯问题）  
```md  
<type>(<scope>): <subject>

- Why: <为什么要改，触发场景/问题>
- What: 
  - <做了哪些变更-1>
  - <做了哪些变更-2>
  - <做了哪些变更-3>

# 示例 
docs(post:neovim-plugins): tighten intro; add decision checklist

- Why: 读起来绕，缺少可执行判断
- What:
  - 精简引言为两段，提出“何时需要插件”的判据
  - 新增 5 项决策清单与一条回退策略
  - 统一小节标题与列表风格

```

## Commit 示例  
### fix: 修复错误
```md  
fix(post:<slug>): correct benchmark numbers and references

- Why: 旧数据有误
- What: 更新表格与引用链接，补充数据来源

```

### refactor: 重构结构（不改结论）  
```md  
refactor(post:<slug>): reorganize sections; move examples to appendix

- Why: 提升可读性与扫描效率
- What: 拆分长段、增补小结、示例移至附录

```

### style: 仅格式  
```md  
style(blog): unify heading scale and spacing

```

### perf: 体积/性能  
```md  
perf(assets): compress images and enable lazy loading

```

### chore: 周更/合并提交（多篇小修的归档）
```md  
chore(blog): weekly content touch-ups

- Why: 聚合一周内零碎修补，便于回溯
- What:
  - fix dead links in 3 posts
  - unify tag casing (neovim → Neovim)
  - compress hero images (avg -35%)

```

## 问题清单  
每次在提交前，我们可以问自己两个问题：  
1. 如果只看 commit 信息，半年后的我能明白这次修改的动机与范围吗？  
2. 这次是最小必要改动了吗？剩余内容写在下次而不是拖延发布。
