---
title: "OpenHarmony移植到STM32H743系列_资源预览"
date: 2025-03-21T16:52:33+08:00
lastmod: 2025-03-21T16:52:33+08:00
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

{{< quote >}}  
OpenHarmony移植到STM32H743系列-这是一个系列  
- [资源预览](../2025_03_19-openharmony_with_stm32h743):point_left: 你在这里
- [术语含义](../2025_03_27-openharmony_glossary)
- [源码拉取](../2025_03_27-openharmony_source)
- [移植验证](../2025_03_27-openharmony_porting_minichip_overview)
- [内核移植](../2025_04_01-openharmony_Kernel_porting)
{{< /quote >}}

本篇指南依照[OpenHarmony/docs](https://gitee.com/openharmony/docs)进行整理。  

## 系统类型  
OpenHarmony是一款面向全场景的开源分布式操作系统，支持128KiB到xGiB RAM 资源的设备上运行系统组件，我们选择的STM32H743的参数为ARM Cortex-M7 内核，主频为 480MHz，2048K的Flash，以及1024KB的SRAM。  
| 系统类型     | 面向处理器                  | 最小内存需求 | 主要特性描述                                                                 | 典型应用场景                                 |
|--------------|-----------------------------|---------------|------------------------------------------------------------------------------|----------------------------------------------|
| 轻量系统     | MCU 类（如 Arm Cortex-M、RISC-V 32 位） | 128 KiB       | 支持轻量级网络协议、图形框架、IOT 总线组件等                                     | 智能家居模组、传感器设备、穿戴设备           |
| 小型系统     | 应用处理器（如 Arm Cortex-A）          | 1 MiB         | 提供更高安全性、标准图形框架、多媒体编解码能力                                 | IP Camera、电子猫眼、路由器、行车记录仪     |
| 标准系统     | 应用处理器（如 Arm Cortex-A）          | 128 MiB       | 提供 3D GPU、硬件合成、丰富控件与动效、完整应用框架                             | 高端冰箱显示屏                                |

我们根据H743的内存，选择轻量系统作为我们的移植对象。  

## 文档导读  
| 学习路径        | 开发者业务                                                   | 相关文档 |
|-----------------|--------------------------------------------------------------|----------|
| 了解OpenHarmony | 整体认知OpenHarmony                                          | [OpenHarmony概述](https://gitee.com/openharmony)；[术语](https://gitee.com/openharmony/docs/blob/master/zh-cn/glossary.md) |
| 获取开发资源    | 准备开发前相关资源                                           | [获取源码](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/get-code/sourcecode-acquire.md)；[获取工具](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/get-code/gettools-acquire.md) |
| 快速入门        | 快速熟悉OpenHarmony环境搭建、编译、烧录、调测、运行          | [快速入门](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/quick-start/Readme-CN.md) |
| 基础能力使用    | 使用OpenHarmony提供的基础能力                                | [轻量系统内核开发指南](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/kernel/kernel-mini-overview.md)；[小型系统内核开发指南](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/kernel/kernel-small-overview.md)；[驱动开发指南](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/driver/driver-overview-foundation.md)；[子系统开发指南](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/subsystems/subsys-build-all.md)；[安全指南](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/security/security-guidelines-overall.md)；[隐私保护](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/security/security-privacy-protection.md) |
| 进阶开发        | 结合系统能力开发智能设备                                     | [WLAN连接类产品](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/guide/device-wlan-led-control.md)；[带屏摄像头类产品](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/guide/device-camera-control-overview.md) |
| 移植适配        | 针对特定芯片、三方库适配与案例                               | [轻量系统芯片移植指导](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-minichip-overview.md)；[小型系统芯片移植指导](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-smallchip-prepare-needs.md)；[轻量和小型系统三方库移植指导](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-thirdparty-overview.md)；[恒玄芯片带屏案例](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-bes2600w-on-minisystem-display-demo.md)；[ASR芯片Combo案例](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-asr582x-combo-demo.md)；[芯海CST85案例](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-cst85f01-combo-demo.md)；[STM32F407案例](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-stm32f407-on-minisystem-eth.md)；[W800芯片案例](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-w800-combo-demo.md)；[STM32MP1案例](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-stm32mp15xx-on-smallsystem.md) |
| 贡献组件        | 为OpenHarmony贡献功能组件                                    | [HPM Part 介绍](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/hpm-part/hpm-part-about.md)；[开发指导](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/hpm-part/hpm-part-development.md)；[参考资料](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/hpm-part/hpm-part-reference.md) |
| 参考            | 常见问题解答、接口与API参考                                   | [常见问题](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/faqs/faqs-overview.md)；[HDI接口参考](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/reference/hdi-apis/Readme-CN.md)；[CMSIS API参考](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/reference/kernel/cmsis/Readme-CN.md) |

## 开发板资源介绍  
- [STM32H743 Datasheet](https://www.st.com/resource/en/datasheet/stm32h743bi.pdf)  
- [STM32H743 相关PDF文档](https://www.st.com.cn/zh/microcontrollers-microprocessors/stm32h743-753/documentation.html)  
本次开发研究使用了[野火 STM32H743及其及其底板](https://detail.tmall.com/item.htm?id=600354257295&price=496.32&sourceType=item&sourceType=item&suid=f45e5949-e2eb-459c-adf2-ffc89227162d&ut_sk=1.ZRjfR17S8FoDAFUQZlWe2AfX_21646297_1743000889040.Copy.ShareGlobalNavigation_1&un=7b55bf7e1f44167240204c14877effdf&share_crt_v=1&un_site=0&spm=a2159r.13376460.0.0&tbSocialPopKey=shareItem&sp_tk=VHVNU2V1REIyazE%3D&cpp=1&shareurl=true&short_name=h.62AlQ8AmOJCk5nZ&bxsign=scdf3c4Mxv62f_moO1lKHPSU4Izu9z4qmBhx0CNzqWLNv5d87b7KJpUYIe_uwxCStIvgKKz5tc-GmHRbaP4jpLs9X34lPpZ3DWoaZxlVcMNxz5CWBActv9FVXFOrSvVNyofhBN95E-b9UcnRvj2nRLRCA&tk=TuMSeuDB2k1%20MF168&app=firefox)。

{{< figure src="/images/posts/2025_03_19-openharmony_with_stm32h743/h743.png" alt="test" title="H743V2 核心板硬件资源图" caption="" align="center" width=400px height=300px >}}
{{< figure src="/images/posts/2025_03_19-openharmony_with_stm32h743/board.png" alt="test" title="底板硬件资源图" caption="" align="center" width=400px height=300px >}}

下面是开发版的规格：  

| 项目               | 规格说明 |
|--------------------|----------|
| 尺寸               | 55×55mm（核心板），200×130.5mm（底板） |
| PCB                | 核心板 4 层，底板 2 层，黑色沉金 |
| 核心板接口         | BTB 接口，兼容 F429、F767 和 H743 V2 核心板 |
| RTC                | 1 个 CR1220 电池座 |
| 电源输入           | USB 5V、DC 6–12V、针脚 5V |
| 电源输出           | AMS1086CD-3.3，输出 3.3V 和 5V |
| USB 转串口         | 1 路 CH340，Mini USB 接口 |
| USB Device         | 1 路 Micro USB 接口 |
| USB Host           | 1 路 USB Type-A 接口（支持U盘） |
| JTAG               | 支持 DAP/JLINK/ULINK2/STLINK/ARM-OB 等仿真器 |
| SWD                | 同上 |
| SPI FLASH          | W25Q256，32MB（在核心板上） |
| EEPROM             | AT24C02，256B（在核心板上） |
| SD 卡              | Micro SD 卡座（SDIO），支持 ≤32GB |
| LED                | RGB LED（共阳）、电源 LED、WiFi 电源指示 LED |
| 按键               | 1 个复位键，2 个用户按键 |
| 电容按键           | 1 个 CTSU 电容按键 |
| 蜂鸣器             | 1 个有源蜂鸣器 |
| 电位器             | 1 个 1K 电位器 |
| 液晶接口           | 38Pin 插座，2.54mm 间距，支持 RGB565/888，兼容野火 4.3/5/7 寸电容屏 |
| 摄像头接口         | 支持 OV2640/5640（DCMI） |
| 蓝牙模块接口       | 支持外接 HC05 |
| 无线模块接口       | 支持外接 NRF24L01（2.4G） |
| WIFI               | 底板集成 AP6181（SDIO 接口） |
| 以太网             | 底板集成 LAN8720A（PHY-ETH-RMII 接口） |
| 温湿度传感器接口   | 支持 DHT11、DS18B20 模块 |
| 红外接收           | HS0038 红外头 |
| MP3 音频模块       | WM8978（I2S 接口） |
| 外扩 SDRAM         | W9825G6，32MB，16bit（核心板） |
| 外扩 NAND FLASH    | W29N01GVSIAA，128MB（核心板） |
| CAN 接口           | 2 个，TJA1042T/3，含 120Ω 终端电阻 |
| RS485 接口         | 2 个，SP3485E，含 120Ω 终端电阻 |
| RS232 接口         | 1 个 DB9 母头，1 个 DB9 公头，芯片为 MAX3232 |
| EBF 接口           | 1 个，适配 GPS、蓝牙、OLED 模块 |
| 咪头               | 1 个录音咪头 |
| 音频输出接口       | 1 个 3.5mm 立体音频输出接口（PHONE） |
| 录音输入接口       | 1 个 3.5mm 立体录音输入接口（LINE IN） |
| DC 电源接口        | 1 个，5.5mm × 2.1mm |
| 三合一传感器       | AP3216C（光、距离、环境） |
| 六轴传感器         | MPU6050 |
| 喇叭插座           | PH2.0 母头 2P |
| 螺母柱             | M3 × 5.56 × (L5 + 1.53) |

## 开发版本  
我现在使用的是开源社区发布的[OpenHarmony-v5.0.3-Release](https://gitee.com/openharmony/docs/blob/master/zh-cn/release-notes/OpenHarmony-v5.0.3-release.md)。

## 论坛  
这边顺便提及一下可用的论坛：

- [鸿蒙论坛](https://forums.openharmony.cn/portal.php)
- [野火论坛](https://www.firebbs.cn/)  
