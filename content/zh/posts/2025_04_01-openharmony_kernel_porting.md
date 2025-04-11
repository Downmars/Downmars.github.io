---
title: "OpenHarmony移植到STM32H743系列_内核移植"
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

## BUILD.gn文件适配
在`kernel/liteos_m/BUILD.gn`中，可以看到，通过`deps`指定了`Board`和`SoC`的编译入口：
{{< collapse summary="kernel/liteos_m/BUILD.gn" >}}
```gn
deps += [ "//device/board/$device_company" ]            --- 对应//device/board/talkweb目录。
deps += [ "//device/soc/$LOSCFG_SOC_COMPANY" ]          --- 对应//device/soc/st目录。
```
{{< /collapse >}}

在`device/board/talkweb/BUILD.gn`中，创建并新增内容如下：

{{< collapse summary="device/board/talkweb/BUILD.gn" >}}
```gn
if (ohos_kernel_type == "liteos_m") {
    import("//kernel/liteos_m/liteos.gni")
    module_name = get_path_info(rebase_path("."), "name")
    module_group(module_name) {
        modules = [ "challenger_h743v2" ]
    }
}
```
{{< /collapse >}}

在`challenger_h743v2`目录下创建`BUILD.gn`，为了方便管理，将目录名作为模块名：

{{< collapse summary="device/board/embfire/challenger_h743v2/BUILD.gn" >}}
```gn
import("//kernel/liteos_m/liteos.gni")
module_name = get_path_info(rebase_path("."), "name")
module_group(module_name) {
    modules = [ 
        "liteos_m",
    ]
}
```
{{< /collapse >}}

将`stm32cubemx`生成的示例工程`Core`目录内的文件、`startup_stm32h743xx.s`启动文件和`startup_stm32h743xx_FLASH.ld`链接文件拷贝至`device/board/embfire/challenger_h743v2/liteos_m/`目录下，并在该目录下创建`BUILD.gn`，添加如下内容：

{{< collapse summary="device/board/talkweb/niobe407/liteos_m/BUILD.gn" >}}
```gn
import("//kernel/liteos_m/liteos.gni")
module_name = get_path_info(rebase_path("."), "name")
kernel_module(module_name) {
    sources = [
        "startup_stm32h743xx.s",
        "Src/main.c",
        "Src/stm32h7xx_hal_msp.c",
        "Src/stm32h7xx_it.c",
        "Src/system_stm32h7xx.c",
    ]
    include_dirs = [ 
        "Inc",
    ]
}

config("public") {
    ldflags = [
        "-Wl,-T" + rebase_path("STM32H743xx_FLASH.ld"),
        "-Wl,-u_printf_float",
    ]
    libs = [
        "c",
        "m",
        "nosys",
    ]
}
```
{{< /collapse >}}

在`make menuconfig`中配置`(Top) → Compat → Choose libc implementation`，选择`newlibc`。

{{< collapse summary="device/soc/st/BUILD.gn" >}}
```gn
import("//kernel/liteos_m/liteos.gni")
module_name = "stm32h7xx_sdk"
kernel_module(module_name) {
  asmflags = board_asmflags
  sources = [
    "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal_rcc.c",
    "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal_rcc_ex.c",
    "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal_gpio.c",
    "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal_dma_ex.c",
    "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal_dma.c",
    "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal_cortex.c",
    "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal.c",
    "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal_exti.c",
    "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal_uart.c",
  ]
}
#指定全局头文件搜索路径
config("public") {
    include_dirs = [
        "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Inc",
        "stm32h7xx/sdk/Drivers/CMSIS/Device/ST/STM32H7xx/Include",
    ]
}
```
{{< /collapse >}}

## config.gni文件适配
在预编译阶段，在`device/board/embfire/challenger_h743v2/liteos_m`目录下创建了一个`config.gni`文件，它其实就是`gn`脚本的头文件，可以理解为工程构建的全局配置文件。主要配置了CPU型号、交叉编译工具链及全局编译、链接参数等重要信息：
{{< collapse summary="device/board/embfire/challenger_h743v2/liteos_m/config.gni" >}}
```gn
# Kernel type, e.g. "linux", "liteos_a", "liteos_m".
kernel_type = "liteos_m"

# Kernel version.
kernel_version = "3.0.0"

# Board CPU type, e.g. "cortex-a7", "riscv32".
board_cpu = "cortex-m7"

# Board arch, e.g.  "armv7-a", "rv32imac".
board_arch = ""

# Toolchain name used for system compiling.
# E.g. gcc-arm-none-eabi, arm-linux-harmonyeabi-gcc, ohos-clang,  riscv32-unknown-elf.
# Note: The default toolchain is "ohos-clang". It's not mandatory if you use the default toolchain.
board_toolchain = "arm-none-eabi-gcc"

use_board_toolchain = true

# The toolchain path installed, it's not mandatory if you have added toolchain path to your ~/.bashrc.
board_toolchain_path = ""

# Compiler prefix.
board_toolchain_prefix = "arm-none-eabi-"

# Compiler type, "gcc" or "clang".
board_toolchain_type = "gcc"

#Debug compiler optimization level options
board_opt_flags = [
    "-mcpu=cortex-m7",   # 指定为 Cortex-M7 架构
    "-mthumb",            # 启用 thumb 指令集
    "-mfpu=fpv5-d16",     # 为 Cortex-M7 使用 fpv5 浮点单元
    "-mfloat-abi=hard",   # 使用硬件浮点运算
]

# Board related common compile flags.
board_cflags = [
    "-Og",
    "-Wall",
    "-fdata-sections",
    "-ffunction-sections",
    "-DSTM32H743xx",
]

board_cflags += board_opt_flags

board_asmflags = [
    "-Og",
    "-Wall",
    "-fdata-sections",
    "-ffunction-sections",
]
board_asmflags += board_opt_flags

board_cxx_flags = board_cflags

board_ld_flags = board_opt_flags

# Board related headfiles search path.
board_include_dirs = [ "//utils/native/lite/include" ]

# Board adapter dir for OHOS components.
board_adapter_dir = ""

```
{{< /collapse >}}

## 内核子系统适配

在`vendor/embfire/challenger_h743v2/config.json`文件中添加内核子系统及相关配置,如下所示：

{{< collapse summary="vendor/embfire/challenger_h743v2/config.json" >}}
```json
{
  "product_name": "challenger_h743v2",
  "type": "mini", 
  "version": "3.0",
  "device_company": "embfire",
  "board": "challenger_h743v2",
  "kernel_type": "liteos_m",
  "kernel_version": "3.0.0",
  "subsystems": [ 
    {
          "subsystem": "kernel",
          "components": [
              {
                  "component": "liteos_m"
              }
          ]
      }
  ],
  "product_adapter_dir": "",
  "third_party_dir": "//third_party" 
}
```
{{< /collapse >}}

在`vendor/embfire/challenger_h743v2/BUILD.gn`中添加以下内容：  
{{< collapse summary="vendor/embfire/challenger_h743v2/BUILD.gn" >}}
```gn  
group("challenger_h743v2") {
}
```
{{< /collapse >}}

## target_config.h文件适配

根据[内核基础适配](https://gitee.com/openharmony/docs/blob/7f33887819c652d79f580c0578e69d35563d49b4/zh-cn/device-dev/porting/porting-chip-kernel-adjustment.md)，`liteos_m`的完整配置能力及默认配置在`kernel/liteos_m/kernel/include/los_config.h`定义，该头文件中的配置项可以根据不同的单板进行裁剪配置。  
如果针对这些配置项需要进行不同的板级配置，则可将对应的配置项直接定义到对应单板的device/xxxx/target_config.h文件中，其他未定义的配置项，采用los_config.h中的默认值。


{{< collapse summary="device/qemu/arm_mps2_an386/liteos_m/board/target_config.h" >}}
```c
#ifndef _TARGET_CONFIG_H
#define _TARGET_CONFIG_H

#define LOSCFG_BASE_CORE_TICK_RESPONSE_MAX                  0xFFFFFFUL
#include "stm32f4xx.h"			//包含了stm32f4平台大量的宏定义。

#endif
```
{{< /collapse >}}

其中宏定义LOSCFG_BASE_CORE_TICK_RESPONSE_MAX是直接参考的//device/qemu/arm_mps2_an386/liteos_m/board/target_config.h文件中的配置，//device/qemu/arm_mps2_an386是cortex-m4的虚拟机工程，后续适配可以直接参考，在此不做深入讲解。
