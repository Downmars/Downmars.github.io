---
title: "修复arch更新引起的grub引导破坏和内核损坏"
date: 2025-10-16T00:38:04+08:00
lastmod: 2025-10-16T00:38:04+08:00
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

前几天更新archlinux系统，重启之后无法正常进入启动引导界面，这边记录一下如何进行修复。  

## grub引导修复与内核修复  

根据[ "Minimal bash-like line editing" in GRUB when booting](https://bbs.archlinux.org/viewtopic.php?id=257358)中指出，开机只掉到 GRUB 的“Minimal BASH-like line editing…”说明了GRUB无法找到它的配置文件，GRUB无法从FAT分区加载Linux内核。  
我们现在必须要使用Live USB启动Arch系统，再chroot进入修复GRUB。  

### 创建Arch linux live USB
我们可以从[Arch Linux Downloads](https://archlinux.org/download/)中下载最新的ISO镜像，之后使用一个闲置U盘通过如[Rufus](https://rufus.ie/zh/)创建自己的Arch live盘。  

接下来修改自己的启动优先级进入U盘里的live环境。  

### 确认Arch 安装的分区  
我们需要从确认我们安装的Arch分配的磁盘和分区是什么，可以通过以下指令查看：
```bash
lsblk -f  
```
通常会有以下输出：  
```bash
nvme0n1p1 vfat  EFI
nvme0n1p2 swap
nvme0n1p3 btrfs ArchRoot
```
这通常代表了你创建系统时分配的EFI分区，Btrfs根分区。  

### 挂载分区  
```bash
# 挂载根分区
mount -t btrfs -o subvol=@home,compress=zstd /dev/nvme0n1p3 /mnt 

# 挂载EFI(boot)分区  
mount /dev/nvme0n1p1 /mnt/boot 
```

### 内核修复  
{{<admonition type=note title=“提示” >}}
如果没有内核修复的需求可跳过这一小节
{{< /admonition >}}

在我原先修复完GRUB引导后，进入Arch系统后出现无法正确读取内核文件，估计是更新系统的同时，系统内核并未正常跟新，内核文件损坏：
```bash
Loading initial ramdisk ...
error: you need to load the kernel first.
```
根据[Grub says i need to load kernel first](https://bbs.archlinux.org/viewtopic.php?id=250845)可知，我们需要重新安装它： 

```bash
pacman -S linux
```
如果在安装的过程中出现了
```bash
xxx: Read-only file system
error: command failed to execute correctly
```
可能是之前更新失败中断导致的自动分区保护，我们需要清脏标志位  

```bash
fsck.vfat -a -v /dev/nvme0n1p1
```

结果中如果出现以下字段则代表了成功清除标志位
```bash
Dirty bit is set   
```

### 进入chroot系统并重新生成引导文件  
```bash
arch-chroot /mnt

grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

```
### 退出重启  
```bash
exit  
umount -R /mnt  
reboot
```
接下来拔掉U盘，便可以正常使用了。
