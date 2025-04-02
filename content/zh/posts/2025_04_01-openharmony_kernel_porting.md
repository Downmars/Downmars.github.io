---
title: "2025_04_01 Openharmony_Kernel_porting"
date: 2025-04-01T14:57:19+08:00
lastmod: 2025-04-01T14:57:19+08:00
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
- [资源预览](../2025_03_19-openharmony_with_stm32h743)
- [术语含义](../2025_03_27-openharmony_glossary)
- [源码拉取](../2025_03_27-openharmony_source)
- [移植验证](../2025_03_27-openharmony_porting_minichip_overview)
- [内核移植](../2025_04_01-openharmony_kernel_porting):point_left: 你在这里
{{< /quote >}}

本篇内容源自[porting-minichip-overview](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-minichip-overview.md){{< sidenote >}}此参考文档适用于OpenHarmony LTS 3.0.1及之前版本的轻量系统的适配，即对于我现在的5.0.3版本可能会有一定的差别，但是大体上是可以参考的。{{< /sidenote >}}和[轻量系统STM32F407芯片移植案例](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/porting/porting-stm32f407-on-minisystem-eth.md)。

## 内核移植  
内核移植需要完成`LiteOS-M Kconfig`适配、`gn`的编译构建和内核启动最小适配。  
### Kconfig文件适配  
#### 创建 board 层结构  
```bash  
cd ~/path/to/openharmony_project
mkdir -p device/board/embfire/
cd device/board/embfire/

# 创建 embfire 下的 Kconfig 入口文件
touch Kconfig.liteos_m.boards
touch Kconfig.liteos_m.defconfig.boards
touch Kconfig.liteos_m.shields

# 创建开发板目录和子文件
mkdir -p challenger_h743v2/liteos_m
cd challenger_h743v2

touch Kconfig.liteos_m.board
touch Kconfig.liteos_m.defconfig.board
touch liteos_m_3.0.0/config.gni
```
#### 创建 soc 层结构  
```bash  
cd ~/path/to/openharmony_project
mkdir -p device/soc/st
cd device/soc/st

touch Kconfig.liteos_m.defconfig
touch Kconfig.liteos_m.series
touch Kconfig.liteos_m.soc

mkdir -p stm32h7xx
cd stm32h7xx
touch Kconfig.liteos_m.defconfig.series
touch Kconfig.liteos_m.defconfig.stm32h7xx
touch Kconfig.liteos_m.series
touch Kconfig.liteos_m.soc
```
#### 文件内容模板  

{{< collapse summary="device/board/embfire/Kconfig.liteos_m.boards" >}}
```kconfig
if SOC_STM32H743
    orsource "challenger_h743v2/Kconfig.liteos_m.board"
endif
```
{{< /collapse >}}

{{< collapse summary="device/board/embfire/Kconfig.liteos_m.defconfig.boards" >}}
```kconfig
orsource "*/Kconfig.liteos_m.defconfig.board"
```
{{< /collapse >}}

{{< collapse summary="device/board/embfire/Kconfig.liteos_m.shields" >}}
```kconfig
# 可留空或根据需要添加内容
```
{{< /collapse >}}

{{< collapse summary="device/board/embfire/challenger_h743v2/Kconfig.liteos_m.board" >}}
```kconfig
menuconfig BOARD_CHALLENGER_H743V2
    bool "Select board Challenger H743V2"
    depends on SOC_STM32H743
```
{{< /collapse >}}

{{< collapse summary="device/board/embfire/challenger_h743v2/Kconfig.liteos_m.defconfig.board" >}}
```kconfig
if BOARD_CHALLENGER_H743V2
    # 默认配置选项写在这里
endif
```
{{< /collapse >}}

{{< collapse summary="device/board/embfire/challenger_h743v2/liteos_m_3.0.0/config.gni" >}}
```gn
ohos_kernel_type = "liteos_m"
ohos_kernel_version = "3.0.0"
board_name = "challenger_h743v2"
```
{{< /collapse >}}

{{< collapse summary="device/soc/st/Kconfig.liteos_m.defconfig" >}}
```kconfig
rsource "*/Kconfig.liteos_m.defconfig.series"
```
{{< /collapse >}}

{{< collapse summary="device/soc/st/Kconfig.liteos_m.series" >}}
```kconfig
rsource "*/Kconfig.liteos_m.series"
```
{{< /collapse >}}

{{< collapse summary="device/soc/st/Kconfig.liteos_m.soc" >}}
```kconfig
config SOC_COMPANY_STMICROELECTRONICS
    bool

if SOC_COMPANY_STMICROELECTRONICS
config SOC_COMPANY
    string
    default "st"
rsource "*/Kconfig.liteos_m.soc"
endif
```
{{< /collapse >}}

{{< collapse summary="device/soc/st/stm32h7xx/Kconfig.liteos_m.series" >}}
```kconfig
config SOC_SERIES_STM32H7xx
    bool "STMicroelectronics STM32H7xx series"
    select ARCH_ARM
    select SOC_COMPANY_STMICROELECTRONICS
    select CPU_CORTEX_M7
    help
        Enable support for STMicroelectronics STM32H7xx series
```
{{< /collapse >}}

{{< collapse summary="device/soc/st/stm32h7xx/Kconfig.liteos_m.soc" >}}
```kconfig
choice
    prompt "STMicroelectronics STM32H7xx SoC"
    depends on SOC_SERIES_STM32H7xx

config SOC_STM32H743
    bool "SoC STM32H743"

endchoice
```
{{< /collapse >}}


{{< collapse summary="device/soc/st/stm32h7xx/Kconfig.liteos_m.defconfig.series" >}}
```kconfig
if SOC_SERIES_STM32H7xx
rsource "Kconfig.liteos_m.defconfig.stm32h7xx"
config SOC_SERIES
    string
    default "stm32h7xx"
endif
```
{{< /collapse >}}

{{< collapse summary="device/soc/st/stm32h7xx/Kconfig.liteos_m.defconfig.stm32h7xx" >}}
```kconfig
config SOC
    string
    default "stm32h7xx"
    depends on SOC_STM32H743
```
{{< /collapse >}}

接下来可以在`kernel/liteos_m`目录下执行`make menuconfig`{{< sidenote >}}如果执行出错，可能是因为`hb env`的问题导致，可以查看[安装配置hb](../2025_03_27-openharmony_source/#安装配置hb){{< /sidenote >}}，实际上执行的是其目录下的`Makefile`，其中使得能够对`Platform/SoC Series`进行选择。结果将自动保存在`$(PRODUCT_PATH)/kernel_configs/debug.config`，下次执行`make menuconfig`时会导出保存的结果。

