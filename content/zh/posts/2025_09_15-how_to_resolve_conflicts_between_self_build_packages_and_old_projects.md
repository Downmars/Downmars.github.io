---
title: "2025_09_15 How_to_resolve_conflicts_between_self_build_packages_and_old_projects"
date: 2025-09-15T16:54:26+08:00
lastmod: 2025-09-15T16:54:26+08:00
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

今天在移植我写好的底层DMA驱动包到目标工程的时候，主要遇到了以下的几个问题。  
  
## Q: 避免符号冲突  
A: 根据原有目标工程的宏定义，替换修改驱动包的宏定义。  

