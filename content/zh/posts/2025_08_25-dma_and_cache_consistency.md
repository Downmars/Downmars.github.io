---
title: "2025_08_25 Dma_and_cache_consistency"
date: 2025-08-25T18:00:56+08:00
lastmod: 2025-08-25T18:00:56+08:00
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

今天在写驱动的时候，涉及到DMA和Cache的一致性问题，对于其中的一些疑惑做了记录。  

## DMA和CPU访问路径  
- CPU访问内存的时候，通常先访问cache（L1/L2），只有cache不命中的时候才回去访问主存（SRAM/DDR）。  
- DMA控制器访问内存的时候，一般是直接通过总线访问主存，不经过CPU的cache。  

```md  
CPU → DMA → 设备（CPU写数据给外设）:  
------------------------------------

    [CPU寄存器/程序]  
           │
           ▼
      [CPU Cache]   (CPU写数据 → 可能停留在cache里)
           │
     (Clean Cache: 写回内存，保证DMA可见)  ←  传输前执行
           │
           ▼
        [内存RAM]  ← DMA要读这里
           │
           ▼
        [DMA总线] 
           │
           ▼
        [外设设备]  (UART/SPI/网卡等)

```
```md  
设备 → DMA → CPU（外设写数据给CPU）:
------------------------------------

       [外设设备]  (ADC/网卡等)
           │
           ▼
        [DMA总线] 
           │
           ▼
        [内存RAM]  ← DMA写入数据
           │
     (Cache可能仍保存旧数据) 
           │
     (Invalidate Cache: 标记无效，下次CPU从内存取)  ← 传输后执行
           │
           ▼
      [CPU Cache]
           │
           ▼
    [CPU寄存器/程序]  

```

