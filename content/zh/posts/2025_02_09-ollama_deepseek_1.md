---
title: "2025_02_09 Ollama_deepseek_1"
date: 2025-02-09T20:08:43+08:00
lastmod: 2025-02-09T20:08:43+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: ["ollama","deepseek"]
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
    image: "images/posts/2025_02_09-ollama_deepseek_1/2024-03-02_ollama.webp"
    alt: "ollama"
    caption: ""
---

## Ollama  
{{< quote >}}"Get up and running with large language models locally."{{< /quote >}}
想必大家一定从很多地方都看到过这个一直小羊驼--[Ollama](https://github.com/ollama/ollama)，正如官方仓库所言，Ollama旨在简化大语言模型(LLMs)的本地部署和使用，我们能够通过这个这个工具来实现轻松下载、运行和管理各种开源的大语言模型。  
- Ollama支持的模型仓库：[https://ollama.com/library](https://ollama.com/library)  

我在这里使用的是 deepseek-r1:14b，因为我的笔记本没有 GPU，但 Ollama 支持在没有 GPU 的情况下调用 CPU 来运行模型，所以也能够正常运行。  
> 注意：运行 7B 模型至少需要 8GB 内存，运行 14B 模型至少需要 16GB 内存，运行 33B 模型至少需要 32GB 内存。  

## DeepSeek  
[DeepSeek](https://www.deepseek.com/){{< sidenote >}}[DeepSeek-V3](https://github.com/deepseek-ai/DeepSeek-V3)是其最新的开源模型项目，完整模型为671B，[论文链接](https://github.com/deepseek-ai/DeepSeek-V3/blob/main/DeepSeek_V3.pdf){{< /sidenote >}}（深度求索）是中国人工智能公司深度求索（DeepSeek Inc.）开发的一系列开源大语言模型（LLM），专注于高效推理和低成本部署。其模型以高性能和轻量化著称，适合学术研究、企业应用和个人开发者使用。  

## 安装Ollama  
{{< collapse summary="zsh" >}}  
```bash  
sudo pacman -S ollama  
```
{{< /collapse >}}  

