---
title: "使用Duti管理macos的默认程序"
date: 2025-03-24T10:19:20+08:00
lastmod: 2025-03-24T10:19:20+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: ["macos","duti"]
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

 macOS 系统中，文件的默认打开方式通常通过图形界面设置。然而，对于需要批量管理或精确控制的用户而言，使用命令行工具 **duti** 是一个高效的选择。{{< sidenote >}}原项目由 Andrew Mortensen 创建，发布于 2008 年，现已开源至 GitHub 并持续可用。{{< /sidenote >}}

## 什么是 duti？

[duti]((https://github.com/moretension/duti))（Do Utility）是一个开源的命令行工具，专门用于配置 macOS 系统中文件类型与应用程序之间的关联。通过 `duti`，你可以设置特定文件类型、URL 协议等的默认打开方式。

## 安装 duti

首先确保已安装 Homebrew，如果没有可以先运行：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```  
然后使用以下命令安装 duti：
```bash 
brew install duti
```
## 使用duti设置默认应用程序
### 获取应用程序的 Bundle Identifier

在设置默认应用前，需要知道目标应用的 Bundle Identifier。可使用以下命令获取：
```bash 
mdls -name kMDItemCFBundleIdentifier -r /Applications/应用程序名称.app
```
例如：
```bash 
mdls -name kMDItemCFBundleIdentifier -r /Applications/Sublime\ Text.app
```
输出示例：
```bash  
com.sublimetext.3

```
### 获取文件类型的 UTI
UTI（Uniform Type Identifier）用于标识文件类型。使用以下命令可获取：  
```bash  
mdls -name kMDItemContentType -r 文件路径
```
例如：
```bash  
mdls -name kMDItemContentType -r example.md
```
输出示例：
```bash  
net.daringfireball.markdown
```
### 使用 duti 设置默认应用程序
设置命令格式如下：
```bash  
duti -s <BundleID> <UTI或扩展名> all
```

示例：将 .md 文件默认设置为 Sublime Text 打开：
```bash  
duti -s com.sublimetext.3 net.daringfireball.markdown all
```  
示例：将 .txt 文件默认使用 Sublime Text 打开：
```bash  
duti -s com.sublimetext.3 .txt all
```  
### 批量设置默认应用程序  
可以创建配置文件批量设置，示例如下：

#### 创建设置文件（如 ~/.duti）：

com.sublimetext.3    public.plain-text    all
com.sublimetext.3    public.python-script all
com.sublimetext.3    net.daringfireball.markdown all

#### 加载配置：

duti ~/.duti

其他功能示例
 - 设置 HTML 默认由 Safari 打开：
```bash  
duti -s com.apple.Safari public.html all
```
 - 使用 echo 管道设置 Word 文档默认打开方式：
```bash  
echo 'com.apple.TextEdit   com.microsoft.word.doc all' | duti
```
 - 设置 Finder 为默认 FTP 处理器：
```bash  
duti -s com.apple.Finder ftp
```
 - 查询某文件扩展的默认应用：
```bash  
duti -x jpg
```



