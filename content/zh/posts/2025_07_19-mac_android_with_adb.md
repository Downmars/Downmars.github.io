---
title: "通过ADB在Mac和Android之间传输数据"
date: 2025-07-19T23:21:24+08:00
lastmod: 2025-07-19T23:21:24+08:00
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
我前段时间去日本的时候，将部分照片存在了我的安卓手机中，等我回来将照片存进我的Mac的时候出现了一些小问题，直接是用数据线连接是无法直接访问安卓手机内部的文件的。为了传输几十G的照片，使用一些局域网传输的工具显然不太合适，所以我选择使用了ADB（Android Debug Bridge）命令行工具，这是一个用于开发者通过命令行与Android设备交互的常用工具。  

## USB调试  
每个不同的品牌的安卓手机有着各自的开启USB调试功能的步骤，大家可以在设置中搜索对应的关键词即可，我在这里不做过多的赘述。  

## 安装方式  
```bash  
brew install android-platform-tools
```
安装完ADB之后，安卓手机开启USB调试，并通过数据线将安卓手机和Mac连接起来，然后使用以下指令即可查看连接到的安卓机相关信息了。  

## 基础连接指令
```bash  
# 查看连接的设备
adb devices

# 连接到特定设备（如果有多个设备）
adb -s <device_id> <command>
```

## 从Mac传输文件到Android  
通常你的个人文件会储存在根目录的`/sdcard`下面。  
```bash  
# 传输单个文件
adb push /path/to/local/file.jpg /sdcard/Pictures/

# 传输整个文件夹
adb push /path/to/local/folder/ /sdcard/Download/

# 传输到特定应用目录
adb push /path/to/file.pdf /sdcard/Android/data/com.example.app/files/
```

## 从Android传输文件到Mac  
```bash  
# 下载单个文件
adb pull /sdcard/Pictures/photo.jpg /Users/username/Desktop/

# 下载整个文件夹
adb pull /sdcard/DCIM/Camera/ /Users/username/Pictures/

# 下载到当前目录
adb pull /sdcard/Download/file.pdf ./
```

## 小技巧  
```bash  
# 查看Android设备存储结构
adb shell ls /sdcard/

# 查看特定目录内容
adb shell ls -la /sdcard/Pictures/

# 创建目录
adb shell mkdir /sdcard/NewFolder/

# 删除文件
adb shell rm /sdcard/file.txt
```

