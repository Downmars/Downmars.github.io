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
- [内核移植](../2025_04_01-openharmony_Kernel_porting)
{{< /quote >}}

本篇内容源自[获取源码](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/get-code/sourcecode-acquire.md)

## 前提准备

我这里的环境是Archlinux x86_64 linux 6.13.8，python版本为3.13.2，由于我Ubuntu早就卸载了，所以这边我拿Archlinux进行尝试。  

## 安装配置hb  
由于Archlinux从Python 3.11 开始默认启用了名为 `externally-managed-environment` 的特性，不再建议使用 `pip` 在系统环境中直接安装第三方 Python 包，以避免破坏系统环境。  
我这这边选择使用conda进行环境的隔离。  
```bash  
conda create -n ohos python=3.13
conda activate ohos
pip install jinja2 ohos-build==0.4.6 -i https://mirrors.aliyun.com/pypi/simple --trusted-host mirrors.aliyun.com

```
## 安装repo工具
这边使用官方脚本进行[repo](https://gitee.com/oschina/repo/)的下载和拉取：  
```bash  
sudo curl -s https://gitee.com/oschina/repo/raw/fork_flow/repo-py3 -o /usr/local/bin/repo
sudo chmod a+x /usr/local/bin/repo
```
我这边的终端输出为：
```bash  
myArch% repo --version 
repo launcher version 2.8
       (from /usr/local/bin/repo)
git 2.49.0
Python 3.13.2 (main, Feb  5 2025, 08:05:21) [GCC 14.2.1 20250128]
OS Linux 6.13.8-arch1-1 (#1 SMP PREEMPT_DYNAMIC Sun, 23 Mar 2025 17:17:30 +0000)
CPU x86_64 (unknown)
```

## 获取主干代码

OpenHarmony 主干分支（master）包含最新特性代码，适合开发测试使用。{{< sidenote >}}Master主干为开发分支，开发者可以通过拉取最新仓库获取新特性，开发版本源码较为稳定，为定期发布的稳定版本，获取方式参考[Release Notes](https://gitee.com/openharmony/docs/blob/master/zh-cn/release-notes/Readme.md)。{{< /sidenote >}}

我这边使用的是轻量型设备对应的源码，所以使用以下指令进行拉取：
```bash  
repo init -u https://gitee.com/openharmony/manifest.git -b OpenHarmony-5.0.3-Release --no-repo-verify -g ohos:mini
repo sync -c
repo forall -c 'git lfs pull'
```
{{< admonition type="warning" collapsible="true" >}}
如果提示
```bash  
Skipping object checkout, Git LFS is not installed for this repository.
Consider installing it with 'git lfs install'.
```
这表示你的系统上缺少了 Git LFS（Large File Storage），导致一些大文件无法被下载，需要手动安装：
```bash  
sudo pacman -S git-lfs
git lfs install  # 安装过后执行一次初始化命令
repo forall -c 'git lfs pull' # 回到代码仓库重新拉取  
```
{{< /admonition >}}

为了支持按照不同类型下载代码，OpenHarmony为每个代码仓定义了以下类别：
| 分类 | 分类说明 | group |
| --- | --- | --- |
| **轻量系统仓** | 适用于轻量系统的代码仓 | ohos:mini |
| **小型系统仓** | 适用于小型系统的代码仓 | ohos:small |
| **标准系统仓** | 适用于标准系统的代码仓 | ohos:standard |
| 系统组件仓 | 标准系统中与硬件无关的代码仓，构建产物都部署在/system目录下。 | ohos:system |
| 芯片组件仓 | 标准系统中与芯片或硬件相关的仓，构建产物部署在/vendor或/chipset目录下。 | ohos:chipset |


## 安装交叉编译链  
原先[开发环境搭建-安装交叉编译工具链](https://gitee.com/openharmony/device_board_talkweb/blob/master/niobe407/docs/software/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E4%B8%8E%E5%9B%BA%E4%BB%B6%E7%BC%96%E8%AF%91.md#6%E5%AE%89%E8%A3%85%E4%BA%A4%E5%8F%89%E7%BC%96%E8%AF%91%E5%B7%A5%E5%85%B7%E9%93%BE)使用的是10.3版本的gcc-arm-none-eabi，会导致出现以下报错：
```bash  
non constant or forward reference address expression for section .ARM.extab
```
在`STM32H743XX_FLASH.ld`中对应行数有这么一句话：
```ld  
  .ARM.extab (READONLY) : /* The "READONLY" keyword is only supported in GCC11 and later, remove it if using GCC10 or earlier. */
```
可以得知我们现在有两种方法：
1. 升级ARM GCC 11或者以上版本：从[ARM GNU Toolchain](https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads)下载最新版本，如11.x或者更高版本。  
2. 推荐删除 (READONLY) 字段即可。  
我这里选择的是第一种方法。  

```bash  
mkdir -p ~/download && cd ~/download
wget https://developer.arm.com/-/media/Files/downloads/gnu/12.3.rel1/binrel/arm-gnu-toolchain-12.3.rel1-x86_64-arm-none-eabi.tar.xz
sudo tar -xJvf arm-gnu-toolchain-12.3.rel1-x86_64-arm-none-eabi.tar.xz -C /opt/
vim ~/.zshrc
export PATH=/opt/arm-gnu-toolchain-12.3.rel1-x86_64-arm-none-eabi/bin:$PATH
source ~/.zshrc
```
按照上述步骤安装完成过后可以查看版本验证：  
```bash  
myArch% arm-none-eabi-gcc --version

arm-none-eabi-gcc (Arm GNU Toolchain 12.3.Rel1 (Build arm-12.35)) 12.3.1 20230626
Copyright (C) 2022 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

