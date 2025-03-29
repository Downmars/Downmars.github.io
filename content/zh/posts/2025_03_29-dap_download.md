---
title: "2025_02_29 Dap_download"
date: 2025-03-29T15:14:00+08:00
lastmod: 2025-03-29T15:14:00+08:00
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

## CMSIS-DAP  
我这里使用的是DAP下载器进行烧录的，这种调试器使用的是[标准CMSIS-DAP协议](https://arm-software.github.io/CMSIS_5/DAP/html/index.html)，而不是ST公司的ST-Link协议，所以说不能够使用STM32CubeProgrammer。

## OpenOCD  
我这边使用的是[OpenOCD](https://openocd.org/)进行程序的烧录，这是一项针对于嵌入式设备的调试提供帮助的开源项目，有兴趣的可以查看[OpenOCD User's Guide](https://openocd.org/doc/html/index.html#toc-About-1)进行学习。  
```bash  
sudo pacman -S openocd
```
安装完成之后，确保你的CMSIS-DAP调试器按照要求链接正常，可以运行以下命令进行链接测试：  
```bash  
myArch% openocd -f interface/cmsis-dap.cfg -f target/stm32h7x.cfg

Open On-Chip Debugger 0.12.0
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
Info : auto-selecting first available session transport "swd". To override use 'transport select <transport>'.
Info : Listening on port 6666 for tcl connections
Info : Listening on port 4444 for telnet connections
Info : CMSIS-DAP: SWD supported
Info : CMSIS-DAP: JTAG supported
Info : CMSIS-DAP: Atomic commands supported
Info : CMSIS-DAP: Test domain timer supported
Info : CMSIS-DAP: FW Version = 2.0.0
Info : CMSIS-DAP: Interface Initialised (SWD)
Info : SWCLK/TCK = 0 SWDIO/TMS = 1 TDI = 1 TDO = 1 nTRST = 0 nRESET = 0
Info : CMSIS-DAP: Interface ready
Info : clock speed 1800 kHz
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
```
出现以上信息，说明OpenOCD连接CMSIS-DAP成功。  

## 使用 OpenOCD 烧录程序到 STM32H743  
由于我们[前文](../2025_03_27-openharmony_porting_minichip_overview/#验证生成的makefile工程)中已经烧录完成了固件，如`build/stm32h743.hex`。进入到我们的固件根目录下运行以下指令：  
```bash  
openocd -f interface/cmsis-dap.cfg -f target/stm32h7x.cfg \
        -c "program build/stm32h743.hex verify reset exit"
```
- `verify` 验证烧录成功与否
- `reset` 烧录完成自动重启MCU
- `exit` 烧录完成后自动退出OpenOCD

如果烧录成功，终端输出如下：  
```bash  
** Programming Finished **
** Verify Started **
** Verified OK **
** Resetting Target **
shutdown command invoked
```
