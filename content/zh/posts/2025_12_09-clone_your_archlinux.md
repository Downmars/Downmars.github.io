---
title: "2025_12_09 Clone_your_archlinux"
date: 2025-12-09T22:27:02+08:00
lastmod: 2025-12-09T22:27:02+08:00
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

前段时间，我朋友入手了5090（可恶的有钱人），将淘汰下来的主机出手给了我，由于附带的卡是5070 12g，虽然说显存不够大，但是还是想要体验一下N卡的本地模型的乐趣，所以就接手了。于是，我面临了一个问题，我如何将我现有的archlinux配置克隆到新主机上。  

## 全盘克隆 or 配置文件克隆  
现在我面临一个问题，我就是是选择全盘将系统克隆过去，还是只是克隆一些配置文件。前一种方案的好处即全盘克隆可以原封不动实现系统迁徙，并且立即能用；但是存在以下一系列问题，如会携带旧系统大量的垃圾文件，对于不同硬件适配可能产生冲突，就像把旧电脑的主板焊到新机箱使用，维护难度很大。后一种好处有可以在移植的时候思考哪些是我们迁移的时候必要的文件，最小化克隆，对于不同的硬件场景我们也可以很好的进行适配，比如说我们需要将现有的配置移植到arm平台的archlinux，同时不会携带一些旧文件，不适用的驱动等。前一种有如[dd](https://wiki.archlinuxcn.org/wiki/Dd)，[clonezilla](https://clonezilla.org/)，[rsync](https://wiki.archlinuxcn.org/wiki/Rsync)；后一种我们选择使用[dotfiles](https://wiki.archlinux.org/title/Dotfiles)。  
很显然，我们会选择dotfiles作为我们的克隆系统方案，尽管他麻烦一点:)。

## 步骤
