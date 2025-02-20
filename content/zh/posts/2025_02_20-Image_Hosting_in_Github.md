---
title: "2025_02_20 Image_Hosting_in_Github"
date: 2025-02-20T19:35:05+08:00
lastmod: 2025-02-20T19:35:05+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: ["Github"]
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
今天在给别人分享友链的时候，需要给别人一个头像的链接，之前把图片是全部存放到本地的，这下正好分享一下配置图床的过程。  
我这边使用的是[PicGo](https://github.com/Molunerfinn/PicGo)，这是一个快速将图片上传到指定的图床上并返回Markdown格式的URL链接的工具。图床我们的首选是免费的，但是现在市面上大部分的都是不可能三角形，要么可控性差，要么收费，要么速度慢。对于写代码的，首选有两个，Gitee和Github。我原先考虑到的国内访问Gitee比较容易，但是在配置完毕之后出现了对应链接无法接收到图像，看网友说应该是禁用了外链请求到Gitee，详情请见[Gitee网站使用条款-仓库大小](https://gitee.com/terms)，而且国内平台会有审核机制，所以我这边还是选择了Github来搭建我的平台，安全的同时也能够及时备份，避免遗失，不然某天博客的云端图像丢失了就不可挽回了。

## 创建Github图床仓库

### 新建仓库
1. 登录[Github](https://github.com)并点击右上角 → 选择 "New repository"
2. 填写仓库信息：
   ```yaml
   Repository name: blog-images  # 推荐名称
   Description: Blog Image Hosting
   Public/Private: Public ✔️ 
   ```
3. 点击 "Create repository"

### 生成访问令牌
1. 点击右上角头像 → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 配置权限：
   ```yaml
   Note: PicGo-upload
   Expiration: No expiration  # 长期有效
   Select scopes:
     ✔️ repo (全部仓库权限)
   ```
{{< admonition type="warning" >}}
这个token只会生成后只会显示一次，需要及时复制备份。
{{< /admonition >}}

## 配置PicGo  
我们在[PicGo仓库](https://github.com/Molunerfinn/PicGo/releases)选择需要的版本进行下载和安装，我这边选择的版本是2.4.0。  
### 配置上传  
1. 打开PicGo → 图床设置 → GitHub图床
2. 填写配置：
   ```yaml
   图床配置名: Github_images_hosting
   设定仓库名: yourname/blog-images  # 替换为实际用户名/仓库
   设定分支名: main
   设定Token: 粘贴生成的令牌
   存储路径: blog/  # 可选分类目录
   自定义域名:   # 我这里没有配置CDN加速，所以这里空置即可
   ```
此时就可以使用这个工具来上传图片了，下方图片为图床返回链接测试，更多设置请查看[官方文档](https://picgo.github.io/PicGo-Doc/zh/guide/#picgo-is-here)。

![miku](https://raw.githubusercontent.com/Downmars/images-PicGo/main/img/miku.jpg)  

### 安装插件  

#### 自动水印  

#### 自动压缩  
