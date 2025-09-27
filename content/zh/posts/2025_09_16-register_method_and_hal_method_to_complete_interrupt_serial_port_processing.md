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


## RX: UDS_Write  
```c  
size_t UDS_Write(uds_t* h, const uint8_t* data, size_t len){
    if(!h || !len) return 0;

    size_t written = 0;
    while(written < len){
        size_t head = h->tx_head;
        size_t tail = h->tx_tail;
        size_t free_space = (tail + UDS_TX_BUF_SIZE - head - 1) % UDS_TX_BUF_SIZE;
        if(free_space == 0){
            // 没空间：尝试触发一次 DMA 发送，不行就退出
            if(_tx_try_kick(h) == 0) break;
            continue;
        }
        size_t chunk = len - written;
        if(chunk > free_space) chunk = free_space;

        // 写入环形
        size_t endspace = UDS_TX_BUF_SIZE - head;
        size_t c1 = (chunk < endspace) ? chunk : endspace;
        memcpy(&h->tx_buf[head], &data[written], c1);
        if(chunk > c1){
            memcpy(&h->tx_buf[0], &data[written + c1], chunk - c1);
        }

        __disable_irq();
        h->tx_head = (head + chunk) % UDS_TX_BUF_SIZE;
        __enable_irq();

        written += chunk;
        _tx_try_kick(h);
    }
    return written;
}

```  

首先，调用 `UDS_Write()` 会把应用层要发送的数据写进环形 TX 缓冲区。  

* 写之前先检查缓冲区是否有空闲：通过 `head` 和 `tail` 计算空闲空间。
* 如果缓冲区满了，会尝试调用 `_tx_try_kick()` 启动 DMA 把旧数据送出去，为新数据腾出空间；若 DMA 仍在忙，就暂时退出（非阻塞）。

写入缓冲区的过程：

* 如果 `head > tail`，说明缓冲区剩余空间是连续的，直接写入即可。
* 如果 `head < tail`，缓冲区尾部到末尾是一段连续空间，先写这一段，如果数据还没写完，再从缓冲区起始地址写剩余部分。
* 最后更新 `head` 指针（指向下一个空闲位置），此时数据已经安全放入环形缓冲。

接下来 `_tx_try_kick()` 会检查 DMA 是否空闲：

* 若 DMA 不忙，取出 **一段连续的数据**（从 `tail` 开始，长度可能是 `head - tail`，或者到缓冲末尾的一段 `BUF_SIZE - tail`）。
* 把这段地址和长度交给 `HAL_UART_Transmit_DMA()`。
* 在启动之前需要做 `dcache_clean()`（仅 H7 开启 D-Cache 时需要），保证 DMA 读到的是内存中最新的数据。
* 然后置位 `tx_dma_busy = true`，并保存 `tx_dma_len = len` 以便回调里推进 `tail`。

当 DMA 把这一段数据搬运完毕，会触发 **DMA 传输完成中断**：

* 在 `HAL_UART_TxCpltCallback()` 里，用之前保存的 `tx_dma_len` 推进 `tail` 指针。
* 清除 `tx_dma_busy`，并尝试再次调用 `_tx_try_kick()`：

  * 如果缓冲里还有数据，立即发下一段；
  * 如果缓冲已空，就可以触发 `on_tx_done` 通知应用层。

这样，整个环形 TX 缓冲和 DMA Normal 模式就结合起来了：

* 应用层只管不断往环里写数据（非阻塞）；
* DMA 负责一次次批量搬运；
* CPU 只需在回调中推进指针并调度下一段，大大降低了中断频率和 CPU 占用率。
