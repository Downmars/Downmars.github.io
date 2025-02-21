---
title: "2025_02_21 Gtrash_as_an_alternative_to_rm"
date: 2025-02-21T09:43:20+08:00
lastmod: 2025-02-21T09:43:20+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: ["gtrash"]
categories: ["tools"]

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
这段时间看见了一个CLI工具[gtrash](https://github.com/umlx5h/gtrash)，它能够将文件移动到系统的垃圾箱之中，从而能够轻松恢复重要的文件，之前使用rm有惨痛的教训{{< sidenote >}}如果有已经使用rm删除文件的可以看一下[Linux下用rm误删除文件的三种恢复方法](https://www.cnblogs.com/cs-markdown10086/p/16938664.html){{</sidenote >}}，索性就写一份使用教程。

## 安装Gtrash  
由于我使用的是Archlinux，我这边使用AUR进行安装：
```bash  
yay -S gtrash-bin
```

## 使用方法  
### 删除文件  
使用`put`指令将文件移动到垃圾箱中，删除目录时默认不需要`-r`选项。
```bash  
$ cd && mkdir dir && touch file1 file2
$ gtrash put dir file1 file2
```

### 查看垃圾箱摘要
使用 `summary` 子命令查看垃圾箱的信息，包括项目数量和总大小。

```bash
$ gtrash summary
[/home/user/.local/share/Trash]
item: 3
size: 4.1 kB
```

### 查找垃圾箱中的文件

使用 `find` 子命令列出垃圾箱中的文件。
`Path` 字段显示文件的原始路径，而不是垃圾箱中的路径。

```bash
$ gtrash find
Date                 Path
2024-01-01 00:00:00  /home/user/dir
2024-01-01 00:00:00  /home/user/file1
2024-01-01 00:00:00  /home/user/file2
```

可以通过命令行参数传递字符串查询，使用正则表达式搜索文件。

```bash
$ gtrash find file1 dir
Date                 Path
2024-01-01 00:00:00  /home/user/dir
2024-01-01 00:00:00  /home/user/file1
```

### 恢复文件

有多种方法可以恢复文件。
使用 `restore` 子命令以交互式 TUI 恢复文件。

```bash
$ gtrash restore
```

在 TUI 中，可以选择多个文件进行恢复。
按 `?` 查看详细操作说明。
使用 `j`、`k` 或方向键导航。
按 `l`、右箭头键或空格键将文件移动到右侧表格。

按 `Enter` 选择文件后，会显示所选文件列表和确认提示。
按 `y` 确认恢复。

```bash
$ gtrash restore
Date                 Path
2024-01-01 00:00:00  /home/user/dir
2024-01-01 00:00:00  /home/user/file1

Selected 2 trashed files
Are you sure you want to restore? yes/no
```

### 永久删除文件

使用 `find` 子命令的 `--rm` 选项永久删除垃圾箱中的文件。
此操作不可逆，类似于 `rm`，文件无法恢复。

```bash
# 删除特定文件
$ gtrash find file1 --rm

# 删除所有文件
$ gtrash find --rm
```


## 工作原理

`gtrash` 遵循 FreeDesktop.org 规范。

它的主要功能类似于 `mv`，但通过记录元信息并自动将文件移动到外部文件系统的垃圾箱来扩展功能。

文件在主文件系统中被移动到以下路径：

```bash
# 标准路径
$HOME/.local/share/Trash

# 如果设置了 $XDG_DATA_HOME
$XDG_DATA_HOME/Trash
```

文件被移动到 `files` 目录，而元数据存储在 `info` 目录中。

```bash
$ gtrash put file1

# 记录元信息
$ cat ~/.local/share/Trash/info/file1.trashinfo
[Trash Info]
Path=/home/user/file1
DeletionDate=2024-01-01T00:00:00

# 实际文件
$ ls ~/.local/share/Trash/files/file1
/home/user/.local/share/Trash/files/file1
```

## 常见问题

### `gtrash` 和 `rm` 有什么区别？

`rm` 使用 `unlink` 系统调用，文件删除后不可恢复。
`gtrash` 使用 `rename` 系统调用，文件可以恢复。

### 可以设置 `rm=gtrash put` 的别名吗？

可以，但不推荐，因为可能会意外执行实际的 `rm` 命令。

### 使用 `sudo` 运行会怎样？

文件会被移动到 root 用户的垃圾箱中。



## 技巧

### Shell 集成

`gtrash` 支持 `bash`、`zsh`、`fish` 的自动补全。

```bash
gtrash completion bash --help
gtrash completion zsh --help
gtrash completion fish --help
```

### 按大小和日期清理垃圾箱

按日期清理：

```bash
# 删除超过 7 天的文件
$ gtrash prune --day 7
```

按大小清理：

```bash
# 删除大于 10MB 的文件
$ gtrash find --size-large 10mb --rm

# 删除小于 1GB 的文件
$ gtrash prune --size 5GB
```

## 配置

某些行为可以通过设置环境变量来调整。
参考 [配置文档](#配置)。


## 相关项目

### 使用系统垃圾箱

-   [trash-cli](https://github.com/andreafrancia/trash-cli)
-   [trashy](https://github.com/oberblastmeister/trashy)
-   [trash-d](https://github.com/rushsteve1/trash-d)

### 不使用系统垃圾箱

-   [rip](https://github.com/nivekuil/rip)
-   [gomi](https://github.com/babarot/gomi)


希望这份指南能帮助你更好地使用 `gtrash`！如果有任何问题，请参考官方文档或提交 Issue。
