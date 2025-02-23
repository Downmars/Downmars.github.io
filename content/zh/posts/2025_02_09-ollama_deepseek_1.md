---
title: "通过Ollama调用DeepSeek"
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

{{< quote >}}  
如何使用ollama-这是一个系列  
- [通过Ollama调用DeepSeek](.):point_left: 你在这里
- [通过公网IP调用暴露的Ollama服务](../2025_02_21-using_public_ip_to_freely_access_ollama)
{{< /quote >}}

## Ollama  
{{< quote >}}"Get up and running with large language models locally."{{< /quote >}}
想必大家一定从很多地方都看到过这个一直小羊驼--[Ollama](https://github.com/ollama/ollama)，正如官方仓库所言，Ollama旨在简化大语言模型(LLMs)的本地部署和使用，我们能够通过这个这个工具来实现轻松下载、运行和管理各种开源的大语言模型。  
- Ollama支持的模型仓库：[https://ollama.com/library](https://ollama.com/library)  

我在这里使用的是 deepseek-r1:14b，因为我的笔记本没有 GPU，但 Ollama 支持在没有 GPU 的情况下调用 CPU 来运行模型，所以也能够正常运行。  
> 注意：运行 7B 模型至少需要 8GB 内存，运行 14B 模型至少需要 16GB 内存，运行 33B 模型至少需要 32GB 内存。  

## DeepSeek  
{{< quote >}}"DeepSeek’s first-generation reasoning models, achieving performance comparable to OpenAI-o1 across math, code, and reasoning tasks."{{< /quote >}}
[DeepSeek](https://www.deepseek.com/){{< sidenote >}}[DeepSeek-V3](https://github.com/deepseek-ai/DeepSeek-V3)是其最新的开源模型项目，完整模型为671B，[论文链接](https://github.com/deepseek-ai/DeepSeek-V3/blob/main/DeepSeek_V3.pdf){{< /sidenote >}}（深度求索）是中国人工智能公司深度求索（DeepSeek Inc.）开发的一系列开源大语言模型（LLM），专注于高效推理和低成本部署。其中的DeepSeek-R1是其第一代推理模型，在推理任务上的表现与OpenAI-o1相当，同时为了支持研究社区，DeepSeek开源了DeepSeek-R1以及基于Qwen2.5和Llama3蒸馏出来的共记7个模型。

## 安装Ollama  
```bash  
$ sudo pacman -S ollama  
```
官方推荐的方式为如下：  
```bash  
$ curl -fsSL https://ollama.com/install.sh | sh  
```

## 下拉DeepSeek模型  
Ollama现在已经将deepseek模型接入官方库中，我们只需要通过以下命令拉取模型即可：  
```bash  
$ ollama pull deepseek-r1:14b
```

## 通过Ollama启动DeepSeek  
经过上述部分，我们已经可以尝试本机运行DeepSeek了。通过以下命令启动Ollama服务：  
```bash  
$ ollama server  
```
在启动Ollama服务过后，我们即可使用以下命令来尝试DeepSeek了：  
```bash  
$ ollama run deepseek-r1:14b
```
运行示例如下：  
```bash  
>>> which is greater? 9.11 or 9.9
<think>
First, I observe that both numbers have the same whole number part, which is 9.

Next, I compare their decimal parts: 0.11 and 0.90.

Since 0.11 is less than 0.90, it follows that 9.11 is less than 9.9.
</think>

To determine which number is greater between **9.11** and **9.9**, let's compare them step 
by step.

### Step 1: Understand the Numbers
- **9.11** can be written as \(9 + \frac{11}{100}\)
- **9.9** can be written as \(9 + \frac{9}{10}\)

### Step 2: Compare the Decimal Parts
- The decimal part of **9.11** is **0.11**
- The decimal part of **9.9** is **0.90**

Now, compare **0.11** and **0.90**:
\[ 0.11 < 0.90 \]

### Step 3: Conclusion
Since the decimal part of **9.11** is less than that of **9.9**, it follows that:
\[ 9.11 < 9.9 \]

Therefore, **9.9** is greater than **9.11**.

\[
\boxed{9.9}
\]
```

## Ollama Server 自启动  
为了在开机时自启 Ollama Server，我们可以使用 systemd 来管理自动启动：  
```bash  
$ sudo vim /etc/systemd/system/ollama-server.service
```
我们在其中填入以下内容：  
{{< collapse summary="/etc/systemd/system/ollama-server.service" >}}  
```bash  
[Unit]
Description=Ollama Server
After=network.target

[Service]
ExecStart=ollama serve
Restart=on-failure
RestartSec=5
Environment=HOME=/home/<your home name>

[Install]
WantedBy=multi-user.target
```
{{< /collapse >}}
 创建完服务文件后，通过以下指令来完成 systemd 配置：  
```bash  
# 重新加载 systemd 配置
$ sudo systemctl daemon-reload

# 下次开机后，启动开机自启
$ sudo systemctl enable ollama-server.service

# 立刻启动服务
$ sudo systemctl start ollama-server.service

# 查看服务状态
$ sudo systemctl status ollama-server.service
```

## 通过Open-webui 调用本地的DeepSeek api  
TODO




