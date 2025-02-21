---
title: "使用gPhoto2在Archlinux上进行Nikon相机的操控"
date: 2025-02-16T20:04:56+08:00
lastmod: 2025-02-16T20:04:56+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: ["nikon"]
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
    image: "images/posts/2025_02_16-How_to_connect_nikon_in_archlinux/z30_front_1_3.webp"
    alt: ""
    caption: ""
---

## 前言  
这两天给爸妈拍了一些照片准备导出，正好在linux环境下，我于是打算研究一下如何在linux环境下传输相机的一些数据，顺便为相机记录做一个开头。  

## MSC or MTP  
原本以为尼康相机是通过[MSC](https://zh.wikipedia.org/wiki/USB%E5%A4%A7%E5%AE%B9%E9%87%8F%E5%AD%98%E5%82%A8%E8%AE%BE%E5%A4%87)(mass storage class)或者[MTP](https://zh.wikipedia.org/wiki/%E5%AA%92%E4%BD%93%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE)(Media Transfer Protocol)协议传输照片的，但是运行`lsblk`没有出现设备，应该不是MSC；并且尝试jmtpfs尝试挂载MTP设备，运行`jmtpfs ~/camera`，并没有文件夹挂载在我自定义的相机文件夹,在我去谷歌搜索之后才大致明白了是怎么回事。  

尼康系列下D700是第一款不再支持MSC的相机{{< sidenote >}}Cletus Lee在[D800 is not mounted on imac 10.9](https://www.flickr.com/groups/1567431@N22/discuss/72157638076477643/)中回答到"The D700 was the first Nikon DSLR that does not offer a Mass Storage mode. The camera will only show up as a MTP device. It has to be set-able as a Mass storage device in a camera setup menu. This is no longer an option for D700, D800 D4 and other more recent ly released Nikons. "{{< /sidenote >}}，该相机只能够以MTP协议传输文件，同时以后发布的相机也不再支持在相机中将传输模式设置为MSC。  

接下来我在Nikon官网的一篇文章[What are the MSC and PTP transfer protocols used for in Nikon digital cameras?](https://www.nikonimgsupport.com/na/NSG_article?articleNo=000047387&lang=en_SG)找到了更加深入的信息，官方公布了Nikon相机支持的传输协议，虽然更新时间为2016年12月21日，但是明确在表格中表明在D700以后发布(即2008年7月25日)的相机都不再支持MSC了。但是我之前尝试MTP协议来挂载相机到本机的文件夹也失败了，我于是查看相关关键词，也发现了有人遇到了相似的疑惑，有人回答道他认为Nikon Z系列的相机都只支持[PTP](https://en.wikipedia.org/wiki/Picture_Transfer_Protocol)(Picture Transfer Protocol){{< sidenote >}}
dgaxiola在[Nikon Z doesn't mount as a drive to OS X? ](https://www.reddit.com/r/nikon_Zseries/comments/15bi377/nikon_z_doesnt_mount_as_a_drive_to_os_x/)中回答道"I think Nikon Z cameras only offer USB Picture Transfer Protocol (PTP) for photo access. On my Mac with my Z6, I use the included Image Capture app to transfer photos over USB."{{< /sidenote >}}，并且有另一个人建议题主使用gphoto2来进行照片的传输以及相机的控制{{< sidenote >}}Pouet在[Nikon camera does not mount](https://forum.manjaro.org/t/nikon-camera-does-not-mount/75618/2)中回答道"Some Nikon cameras use PTP instead of MSC or MTP protocol for memory access, for PTP you need to install gvfs-gphoto2 package."{{< /sidenote >}}。  

## qPhoto2  
[gPhoto2](http://www.gphoto.org/proj/) 是一个免费的、可再分发的数字相机软件套件，专为类 Unix 系统设计，由世界各地一群专门的志愿者开发。它支持超过 [2700 款相机和媒体播放器](http://www.gphoto.org/proj/libgphoto2/support.php)。  

gPhoto2 运行在多个类 Unix 操作系统上，包括 Linux、FreeBSD、NetBSD、MacOS X 等。主要的 Linux 发行版（如 Debian GNU/Linux、Ubuntu、Gentoo、Fedora、openSUSE、Mandriva 等）都提供了 gPhoto。  
我们使用以下命令下载gPhoto2：  
{{< collapse summary="zsh" >}}
```bash  
sudo pacman -S gphoto2  
```
{{< /collapse >}}
gPhoto2提供了很多有趣的功能，这让我们能够通过命令行查看相机(运行前记得开机，不然我的Nikon30是读取不到的)：  
{{< collapse summary="zsh" >}}
```bash  
# 显示相机中所有文件夹的列表
gphoto2 --list-folders
# 显示相机存储中所有文件
gphoto2 --list-files
# 下载相机中的所有文件
gphoto2 --get-all-files
# 显示相机配置信息
gphoto2 --list-config
```
{{< /collapse >}}
由于我的相机中设置了间隔拍摄创建新文件夹，导致多个文件夹同时传输时会出现文件名重复，可以根据文件夹路径和文件名为每个文件生成唯一的名称：  
{{< collapse summary="zsh" >}}
```bash  
gphoto2 --get-all-files --filename="%F/%f"
```
{{< /collapse >}}
此外，gPhoto2还提供了控制相机的功能：  
{{< collapse summary="zsh" >}}
```bash  
# 捕捉单张图片
gphoto2 --capture-image
# 捕捉视频
gphoto2 --capture-movie=SECONDS
# 使用长时间曝光（如 --bulb 模式）拍摄
gphoto2 --bulb=10
# 使用 --capture-preview 启用相机的实时预览功能
gphoto2 --capture-preview
# 使用 --show-preview 显示实时预览图像
gphoto2 --show-preview
# 触发拍照（模拟按下快门按钮）
gphoto2 --trigger-capture
# 修改相机的配置参数，例如 ISO 或曝光时间
gphoto2 --set-config=iso=400

```
{{< /collapse >}}
更多功能可以参考于[The gPhoto2 Reference (the man pages)](http://www.gphoto.org/doc/manual/ref-gphoto2-cli.html#cli-examples)。

