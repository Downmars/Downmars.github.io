---
title: "多端Git拉取同步"
date: 2025-03-28T16:52:59+08:00
lastmod: 2025-03-28T16:52:59+08:00
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

## 前言  
由于我游转于linux和mac设备之间，我需要将博客实时保持同步，我这边先写一篇博客关于手动拉取博客内容。我这边的假设是我每次写完博客之后都会手动上传，也就是只有一端的设备上的文章是最新的，不存在内容冲突的情况，之后如果遇到其他情况，会新增相关内容。有机会设置一下自动上传和自动下载同步，感觉这一部分有服务器之后会更好操作一些，但是现在的价格不是很友好，看看过段时间有没有好的车。  

## 推送代码  
```bash  
cd your_mac_dir  
git add .  
git commit -m "xxxx"  
git push  origin main  
```

## 更新代码  
```bash  
cd your_linux_dir  
git fetch --all  # 从远程仓库拉取所有分支和标签的最新信息，但是不会修改本地代码
git reset --hard origin/main  # 强制将本地分支代码完全覆盖为远程分支origin/main上的代码状态
```
