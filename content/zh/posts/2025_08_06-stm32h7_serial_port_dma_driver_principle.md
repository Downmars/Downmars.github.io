---
title: "STM32H7之串口DMA驱动原理"
date: 2025-08-06T10:53:31+08:00
lastmod: 2025-08-06T10:53:31+08:00
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

## TODO  
[gpt answer](https://chatgpt.com/share/6892c3d9-0290-800d-b03a-f2cd23619f65)

## DMA 定义  
DMA，全程Direct Memory Access，即直接储存器访问。DMA的作用就是实现数据的直接传输，从而去掉了传统数据传输需要CPU寄存器参与的环节，大大节省了CPU资源的消耗。此过程主要涉及外设与存储器之间的以及存储器与存储器之间提供高速数据传输，本质上都是数据从内存的某一区域传输到内存的另一区域{{< sidenote >}}外设的数据寄存器本质上就是内存的一个存储单元{{< /sidenote >}}。

## DMA请求方式  
DMAMUX（DMA Multiplexer）是 STM32 某些新系列（如 G0、G4、L4+、H7 等）里新增的一个DMA 请求路由器。  
在早期的STM32F1系列中，比如有0-7路共八路DMA通道。其中每一路通道可以响应多个外设的请求，但是每一路通道每一次只能响应一个外设的请求。如果遇到了两个外设事件同时需要申请相同的DMA传输通道就麻烦了。  
所以说，后来STM32F4系列采用了和F1写列不同的DMA结构，DMA的请求表分为了Channel和Stream通道，我这时候就能够在选择同一个channel的同时，选择不同的stream来同时分配DMA通道。但是由于一一对应的关系，我某个外设的请求只能申请到Channel0的Steam1和2，而不能申请到别的DMA通道。这样就可能遇到一件事情，当我某一个通道十分繁忙的时候，另一个通道十分空闲。  
所以这时候，就出现了DMAMUX。

## USART原理  
USART（Universal Synchronous/Asynchronous Receiver/Transmitter，通用同步/异步收发器）是 MCU 内部的一个硬件外设，用来进行串行通信。  
我们常用的是异步模式，发送端在每帧数据前后自动添加 起始位 (Start bit) 和 停止位 (Stop bit)，用来标记帧的开始和结束，常用格式为：  
`1 Start bit + 8 Data bits + [Parity bit] + 1 Stop bit`  
这种异步通信方式不需要时钟线，我们靠约定好的波特率保证发送端和接收端采样对齐。  

## USART收发方式  
### 轮询（阻塞）  
轮询方式，顾名思义，CPU需要不断检查发送缓冲标志位，直到可以写下一个字节。比如我们使用9600bps的波特率，1字节（10bit，包含起始/停止位）需要大约1ms才能够发完，在发送完成前，CPU一直会被卡在循环中。  

### 中断（非阻塞）  
每当USART发送完一个字节，标志位触发中断，并把下一个字节写入寄存器。如上述的9600波特率，CPU平时可以做别的事情，我们只需要每隔1ms左右进一次中断写寄存器。  

### DMA  
DMA方式会将自动从内存搬运数据到USART寄存器，硬件负责逐字转发，在此期间，CPU完全不用管，只需要DMA完成中断。

## DMA驱动USART方式  
我现在需要通过DMA收发方式来替换USART的驱动，将所有的设置通过结构体变量做好通用化设计，之后通过将板上的两个USART连接起来进行收发测试。
