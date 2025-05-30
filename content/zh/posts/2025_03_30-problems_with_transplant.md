---
title: "移植问题"
date: 2025-03-30T16:18:23+08:00
lastmod: 2025-03-30T16:18:23+08:00
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

## 官方亮灯例程无法正确使用  
2025_03_29  
Q: 我这边使用官方的亮灯例程< 12-GPIO输出-使用固件点亮LED灯 >，并未对例程进行修改，但是烧录进开发板之后并没有任何输出显示。  
2025_03_30
A: 麻了，例程给我的是错误的，是STM32H743IIH6，而我使用的是STM32H743XIH6，并且我并没有仔细查看开发版引脚区别，导致配置错误。

## hb env 报错  
2025_04_01  
Q: hb env输出报错，error类型未知。
2025_04_02  
A: 解析hb env 功能的作用，将配置名单换方式导入，成功解决，可参照：[安装配置hb](../2025_03_27-openharmony_source/#安装配置hb) 。

## hb build : find component xxx failed, please check it in xxx/parts.json
2025_04_03  
Q: 报错内容为`Exception: find component init_lite failed, please check it in /home/dm/Projects/openharmony_project/test_1/out/preloader/neptune_iotlink_demo/parts.json.`，追根溯源是`openharmony_project/test_1/build/hb/util/loader/load_ohos_build.py`中的`compare_subsystem_and_component`函数中会将`parts.json`解析为相应的字典，来和自带的`build/subsystem_compoents_whitelist.json`和`build/compile_standard_whitelist.json`内容进行匹配，很显然白名单里没有我们的芯片内容，所以还会和`/out/challenger_h743v2/challenger_h743v2/build_configs/parts_info/part_subsystem.json`进行匹配，如果找到该组件或其覆盖版本，并且子系统名称匹配或相等，则认为组件有效。但是并没有找到就会报错，我需要明天查看一下`part_subsystem.json`文件是如何生成的。

2025_04_08  
A: 经过测试，应该是在`part_subsystem.json`中存在`product_{product_name}`和`device_{device_name}`这两个键的，比如我这里就应该是`product_challenger_h743v2`和`device_challenger_h743v2`，但是实际上我在生成的`part_subsystem.json`中找不到，于是和`parts.json`中的键值对应不上，导致了出现的错误。对于`part_subsystem.json`我们可以看到在文件`./build/hb/util/loader/load_ohos_build.py`中搜寻`process_parts_info(parts_config_dict, parts_info_output_path, skip_partlist_check)`函数，大致扫一下我们可以知道这个函数通过检查`parts_config_dict`字典中是否存在键`parts_info`，如果存在则获取对应的值`parts_info`，该值通常是一个包含零件信息的字典，将这个字典的键值输出到新生成的`part_subsystem.json`中。继续看下去，可以在`get_parts_info`函数中看到是如何使用`process_parts_info`的，我们可以看到在我们根据教程使用，会缺少创建`device/board/embfire/challenger_h743v2/ohos.build`和`vendor/embfire/challenger_h743v2/ohos.build`，我们可以按照提供的示例创建类似的文件即可避免错误。  

{{< collapse summary="out/preloader/challenger_h743v2/parts.json" >}}
```json  
{
  "parts": [
    "device_challenger_h743v2:device_challenger_h743v2",
    "kernel:liteos_m",
    "product_challenger_h743v2:product_challenger_h743v2"
  ]
}
```
{{< /collapse >}}  

我们可以在`part_subsystem.json`中看到只有`kernel:liteos_m`这个键值对，剩下的两个键值对需要我们创建下述两个文件才能够生成：  
{{< collapse summary="vendor/embfire/challenger_h743v2/ohos.build" >}}  
```diff  
+{
+  "parts": {
+    "product_challenger_h743v2": {
+      "module_list": [
+      ]
+    }
+  },
+  "subsystem": "product_challenger_h743v2"
+}
```
{{< /collapse >}}  

{{< collapse summary="device/board/embfire/challenger_h743v2/ohos.build" >}}  
```diff  
+{
+  "parts": {
+    "device_challenger_h743v2": {
+      "module_list": [
+      ]
+    }
+  },
+  "subsystem": "device_challenger_h743v2"
+}
```
{{< /collapse >}}

## fatal error: target_config.h: No such file or directory
2025_04_11  
Q: 经过测试，在进行编译的过程中，出现了位于`device/soc/st/stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/`的代码找不到 `stm32h7xx_hal_conf.h` 和 `target_config.h`头 文件，寻找了一下，在`./device/board/embfire/challenger_h743v2/liteos_m/Inc/stm32h7xx_hal_conf.h`和`./device/soc/st/target_config.h`存在对应文件，应该是链接的问题，需要看一下是错误代码连接到什么位置。

2025_04_14  
A: 查看一下终端输出的内容中报错内容`[OHOS ERROR] ccache arm-none-eabi-gcc -I {path}`中存在`device/soc/st/BUILD.gn`中定义的全局头文件路径，`../../../device/soc/st/stm32h7xx/sdk/Drivers/CMSIS/Device/ST/STM32H7xx/Include`和`../../../device/board/embfire/challenger_h743v2/liteos_m/Inc`，并没有存在我们`stm32h7xx_hal_conf.h`和`target_config.h`的文件路径，但是`device/board/embfire/challenger_h743v2/liteos_m/BUILD.gn`中明明已经包括了这个模块的路径，但是在上面的编译路径中并没有找到，所以我们需要将这两个文件的路径添加到全局文件路径搜索中。  
{{< collapse summary="device/soc/st/BUILD.gn" >}}
```diff  
config("public") {
    include_dirs = [
+      "../../../device/board/embfire/challenger_h743v2/liteos_m/inc",  # 添加缺失的路径
+      "../../../device/soc/st/",

    ]
}
```
{{< /collapse >}}

## undefined reference to `HAL_xxx'  
2025_04_14  
Q&A: 具体报错情况为链接器`ld`发现在`liteos_m.main.o`目标文件中发现如`SystemClock_Config`函数存在未定义的引用，这个函数属于STM32H7xx的电源管理部分，通常存在于`stm32h7xx_hal_pwr_ex.c`中，所以我们将`stm32h7xx_hal_pwr_ex.c`文件路径添加到对应的`BUILD.gn`中即可。  
{{< collapse summary="device/soc/st/BUILD.gn" >}}  
```diff  
kernel_module(module_name) {
  asmflags = board_asmflags
  sources = [
+   "stm32h7xx/sdk/Drivers/STM32H7xx_HAL_Driver/Src/stm32h7xx_hal_pwr_ex.c",
  ]
}
```
{{< /collapse >}}
