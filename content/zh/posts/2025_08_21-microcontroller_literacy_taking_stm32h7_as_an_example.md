---
title: "2025_08_21 Microcontroller_literacy_taking_stm32h7_as_an_example"
date: 2025-08-21T18:03:33+08:00
lastmod: 2025-08-21T18:03:33+08:00
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

这段时间在尝试用DMA来运输串口数据，回去翻数据手册，发现好多术语都忘记的差不多了，现在对于学习中遇到的问题做一个记录。  

## MDMA、DMA、BDMA  
### MDMA (Master DMA)  
主DMA控制器，专门为大规模内存数据搬运和外设高速数据传输设计，通常用于SDRAM、LCD、GPU、图像处理、以太网大数据搬运。  

### DMA (Direct Memory Access)  
直接储存器访问控制器，在不经过CPU的情况下进行数据的搬运，通常适用于SPI、ADC、DAC、I2C、USART等外设的数据搬运。  

### BDMA (Basic DMA)  
基本DMA控制器，更加轻量的DMA，一般用于较小数据的搬运任务，通常适用于某些特定外设，如USB、SPI Flash、QSPI等。  

### 电源域下的分类  
在STM32H7中，芯片内部被分为多个电源域，D1电源域下，使用的总线矩阵是64bit的AXI总线，MDMA也是通过64bit的AXI总线接入D1域的总线矩阵的，并且有专门的32bit的AHB总线直通CPU。D2电源域下，使用的总线矩阵为32bit的AHB总线，两个DMA控制器DMA1和DMA2都通过32bitAHB总线接入AHB总线矩阵。在D3电源域，资源比较少，BDMA通过32bit总线接入32bit的AHB总线矩阵。  

### 缓冲(Buffer)区  
由于DMA只是负责数据传输的通道，不涉及保存数据，所以说在使用的时候通常要结合缓冲区来储存数据。  

### 普通缓冲  
一次性传输，通过DMA传输N个数据到一块缓冲区，搬运结束后触发“传输完成中断”。

### 环形缓冲  
缓冲区地址固定，DMA传输到尾部后从头覆盖，构成一条环形，常用于连续数据流如UART 接收、音频流、传感器数据等。  

### 双缓冲  
通过给DMA分配两块缓冲区A和B，外设不停在两块区域内进行写入或者读取。  
双缓冲如分配Buffer A和Buffer B，DMA开始将数据写入Buffer A，当A填满的时候，DMA自动切换到Buffer B，这时候CPU就可以安全地处理Buffer A的数据。当B填满的时候，DMA又切换为A，CPU再处理B，如此往复循环，DMA和CPU交替使用两块缓冲区。  
两块缓冲区A和B作用完全一致，仅区别为某一时刻谁被DMA写，谁被DMA读。  

### DMA和CPU的并行性  
在“双缓冲”章节，我疑问于为什么需要双缓冲来避免冲突，其中的“不能同时工作”指的是不能同时对统一块缓存进行操作。主要是两个方面的原因，分别是数据一致性以及总线仲裁的问题。如果DMA 正在往 Buffer A 写数据时，如果 CPU 也在读这个缓冲，可能读到部分旧数据加上部分新数据，导致数据不完整甚至数据错误，同时DMA和CPU共享总线（AHB/AXI），访问同一地址会导致总线仲裁，降低数据传输效率。

### AMBA 总线协议  
上一步提到的AHB和AXI都是总线协议，属于AMBA（Advanced Microcontroller Bus Architecture，高级微控制器总线架构） 标准里的两种常见总线。  

### AHB总线  
全称为Advanced High-performance Bus（高级高性能总线），仲裁机制简单，通常只有一个master在用。在STM32H7中，DMA、CPU、外设都通过AHB访问内存和外设。  

### AXI总线  
全程为Advanced eXtensible Interface（高级可扩展接口），支持多机并行访问（CPU、DMA、GPU、外设等可以同时发起访问），支持更高的数据带宽。在 STM32H7 中，Cortex-M7 内核挂在 AXI 总线上，能高速访问 AXI SRAM/外部 SDRAM。  
