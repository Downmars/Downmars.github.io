---
title: "2025_09_16 Register_method_and_hal_method_to_complete_interrupt_serial_port_processing"
date: 2025-09-16T17:04:56+08:00
lastmod: 2025-09-16T17:04:56+08:00
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

我们现在通过DMA的方式来进行UART的数据搬运，所以对应的中断响应函数也需要重新编写。接下来我会简要的解释一下更改DMA前后中断响应函数的原理和实现方式。  

## 纯寄存器搬运  
### RX  
每来一个字节，串口外设置位 RXNE 标志 → 触发一次中断 → CPU 进入 Uartx_IRQ → 读取 RDR → 存到软件 FIFO。  

### TX  
每发完一个字节，串口外设置位 TXE 标志 → 触发一次中断 → CPU 进入 Uartx_IRQ → 从软件 FIFO 取出一个字节写入 TDR。  

作为普通的UART发送接受方式，每字节都会产生一次中断以及寄存器访问，所以在高波特率的情况下，会占用大量CPU资源，可能导致中断请求IRQ的生成速率远超处理能力，产生中断风暴等其他后果。  

## DMA搬运  
### RX: DMA Circile + 环形RX缓冲+ IDLE 
DMA持续把数据从接受寄存器RDR搬运到内存的环形缓冲区，当总线空闲的时候，UART触发IDLE line中断，CPU只需要查看NDTR的新数据指针就可以知道刚才发送来了哪些数据，并切通过中断触发的用户回调来完成数据的处理。  

### TX: DMA Normal + 环形TX缓冲  
应用层将要发送的数据写入软件维护的 内存环形 TX 缓冲区，并更新 head 指针。如果 DMA 空闲，驱动会挑选环形缓冲中一段 连续数据块（tail → head 或 tail → buffer_end），启动一次 DMA Normal 模式传输。DMA 自动将这一段内存逐字节搬运到 USARTx->TDR，由硬件时序发出。当传输完成时，触发 DMA TC（传输完成）中断。在中断回调中：推进 tail 指针，标记这段数据已经发完；如果环形缓冲中还有剩余数据，再次启动下一次 DMA，知道没有新数据接入。
