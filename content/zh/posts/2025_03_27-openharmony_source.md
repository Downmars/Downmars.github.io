---
title: "OpenHarmony移植到STM32H743系列_源码拉取"
date: 2025-03-27T10:44:04+08:00
lastmod: 2025-03-27T10:44:04+08:00
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

{{< quote >}}  
OpenHarmony移植到STM32H743系列-这是一个系列  
- [资源预览](../2025_03_19-openharmony_with_stm32h743)
- [术语含义](../2025_03_27-openharmony_glossary)
- [源码拉取](../2025_03_27-openharmony_source):point_left: 你在这里
- [移植验证](../2025_03_27-openharmony_porting_minichip_overview)
{{< /quote >}}

本篇内容源自[获取源码](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/get-code/sourcecode-acquire.md)

## 前提准备

1. **注册码云 Gitee 账号**
2. **添加 SSH 公钥**
   - 登录 Gitee，在设置中添加你的 SSH 公钥。
   - 参考：[获取密钥](https://gitee.com/help/articles/4181)
3. **安装 Git 和 Git LFS**
```bash
git config --global user.name "yourname"
git config --global user.email "your-email-address"
git config --global credential.helper store
```
4. 安装 repo 工具
```bash  
mkdir ~/bin
curl https://gitee.com/oschina/repo/raw/fork_flow/repo-py3 -o ~/bin/repo
chmod a+x ~/bin/repo
pip3 install -i https://repo.huaweicloud.com/repository/pypi/simple requests
```

5. 配置环境变量
```bash 
vim ~/.bashrc
export PATH=~/bin:$PATH
source ~/.bashrc
```

## 获取主干代码

OpenHarmony 主干分支（master）包含最新特性代码，适合开发测试使用。{{< sidenote >}}Master主干为开发分支，开发者可以通过拉取最新仓库获取新特性，开发版本源码较为稳定，为定期发布的稳定版本，获取方式参考[Release Notes](https://gitee.com/openharmony/docs/blob/master/zh-cn/release-notes/Readme.md)。{{< /sidenote >}}

推荐方式：使用 SSH 拉取（需添加公钥）
```bash   
repo init -u git@gitee.com:openharmony/manifest.git -b master --no-repo-verify
repo sync -c
repo forall -c 'git lfs pull'
```
备用方式：使用 HTTPS 拉取
```bash  
repo init -u https://gitee.com/openharmony/manifest.git -b master --no-repo-verify
repo sync -c
repo forall -c 'git lfs pull'
```
