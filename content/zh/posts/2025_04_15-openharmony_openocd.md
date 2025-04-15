---
title: "OpenHarmony移植到STM32H743系列_Openocd"
date: 2025-04-15T15:56:21+08:00
lastmod: 2025-04-15T15:56:21+08:00
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
我这边是在`linux`工作环境下，所以我这边使用开源工具[openocd](https://openocd.org/)进行代码的烧录，在`archlinux`环境下使用以下命令进行工具的下载：  
```bash  
sudo pacman -S openocd  
```

## 烧录指令  
根据官方内容，我们可以使用以下指令进行文件的烧录：  
```bash  
openocd -f interface/cmsis-dap.cfg -f target/stm32h7x.cfg \
        -c "program out/challenger_h743v2/challenger_h743v2/OHOS_Image.bin 0x08000000 verify reset exit"
```
这段命令是使用 **OpenOCD** (Open On-Chip Debugger) 工具来编程和调试 STM32H7 系列的微控制器。我们逐部分解释这个命令的各个内容：

### 命令分解

```bash
openocd -f interface/cmsis-dap.cfg -f target/stm32h7x.cfg \
        -c "program out/challenger_h743v2/challenger_h743v2/OHOS_Image.bin 0x08000000 verify reset exit"
```

 - **`openocd`**：
   - 这是执行 OpenOCD 程序的命令。OpenOCD 是一个开源的调试工具，支持多种调试接口，可以用来与目标微控制器进行通信，进行烧录、调试等操作。

 - **`-f interface/cmsis-dap.cfg`**：
   - 这个参数指定了 OpenOCD 使用的接口配置文件。在这里，选择的是 CMSIS-DAP 调试器，它是 ARM 官方标准接口，通常用于连接调试器和目标设备。

 - **`-f target/stm32h7x.cfg`**：
   - 这个参数指定了目标设备的配置文件，`stm32h7x.cfg` 是针对 STM32H7 系列微控制器的配置文件，包含了有关硬件特性（如时钟设置、芯片特性等）的详细信息。

 - **`-c "program out/challenger_h743v2/challenger_h743v2/OHOS_Image.bin 0x08000000 verify reset exit"`**：
   - **`-c`**：用于执行一个 OpenOCD 命令。
   - **`program out/challenger_h743v2/challenger_h743v2/OHOS_Image.bin 0x08000000`**：
     - `program` 命令用来将一个二进制文件（此处为 `OHOS_Image.bin`）烧录到目标设备的指定地址（这里是 `0x08000000`）。
   - **`verify`**：
     - 这个选项表示在烧录完成后进行验证，即检查烧录的数据是否与目标地址的内容一致。
   - **`reset`**：
     - 烧录完成并验证之后，执行目标设备的重置命令。
   - **`exit`**：
     - 最后，执行完所有操作后，退出 OpenOCD 程序。

这条命令的目的是通过 CMSIS-DAP 调试器，使用 OpenOCD 工具将 `OHOS_Image.bin` 文件烧录到 STM32H7 微控制器的内存地址 `0x08000000`，并在烧录完成后进行验证、重启设备，并退出程序。

由于板子的原因，我需要在下载程序前按下复位键，大约1s之后可以松开即可成功烧录。
