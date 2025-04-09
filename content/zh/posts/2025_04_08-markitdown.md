---
title: "MarkItDown-万物2Markdown"
date: 2025-04-09T23:16:31+08:00
lastmod: 2025-04-09T23:16:31+08:00
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
之前一段时间为了整理论文，使用过一些开源的`pdf2md`的工具，但是大部分用起来都有一种寸止的感觉，昨天正好看到一个微软的开源PY工具[MarkItDown](https://github.com/microsoft/markitdown)，其能够将各种文件转换为`Markdown`格式。这样就可以将各种文件以一种统一的方法整合起来，并输出到下游。  

## 为什么是Markdown？  
`Markdown`是一种非常接近纯文本，有着标记或者格式最少，但是仍然提供了一种表达文件结构的方法。现在主流的`LLM`，如`OpenAI`的`GPT4o`，往往会将`Markdown`格式作为其默认的输出，这表明在训练的过程中已经接受了大量的使用`Markdown`格式的数据，并能够很好的理解它。  

## 安装 MarkItDown  
```bash  
# pip 安装  
pip install 'markitdown[all]'  

# 源码安装  
git clone git@github.com:microsoft/markitdown.git
cd markitdown
pip install -e packages/markitdown[all]
```

MarkItDown 具有用于激活各种文件格式的可选依赖项。在本文档的前面,我们安装了所有可选的依赖项。`[all]`选项。但是,您也可以单独安装它们以进行更多控制。例如:

```shell
pip install markitdown[pdf, docx, pptx]
```

将只安装 PDF、DOCX 和 PPTX 文件的依赖项。

目前,以下可选依赖项可用:

-   `[all]`安装所有可选依赖项
-   `[pptx]`安装PowerPoint文件的依赖项
-   `[docx]`安装 Word 文件的依赖项
-   `[xlsx]`安装 Excel 文件的依赖项
-   `[xls]`为较旧的 Excel 文件安装依赖项
-   `[pdf]`为 PDF 文件安装依赖项
-   `[outlook]`为 Outlook 消息安装依赖项
-   `[az-doc-intel]`安装 Azure 文档智能的依赖项
-   `[audio-transcription]`安装用于 wav 和 mp3 文件音频转录的依赖项
-   `[youtube-transcription]`安装用于获取 YouTube 视频转录的依赖项


## 使用例  
支持转换源格式：  
- PDF  
- PowerPoint  
- Word  
- Excel  
- 图片(EXIF元数据和OCR)  
- 音频(EXIF元数据和语音转录)  
- HTML  
- 文本格式(CSV，JSON，XML)  
- ZIP文件(遍历内容)  
- YouTube URL  
- EPub  

... 以及更多  

以最常用的`PDF`文件为例，可以使用以下指令进行使用：  
```bash  
# 使用 > 输出到md文件  
markitdown path-to-file.pdf > document.md  
# 使用 -o 输出到md文件  
markitdown path-to-file.pdf -o document.md
# 使用管道将文件输入到工具  
cat path-to-file.pdf | markitdown  
```
