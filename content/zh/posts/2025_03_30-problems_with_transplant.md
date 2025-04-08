---
title: "2025_03_30 Problems_with_transplant"
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
A: 经过测试，应该是在`part_subsystem.json`中存在`product_{product_name}`和`device_{device_name}`这两个键的，比如我这里就应该是`product_challenger_h743v2`和`device_challenger_h743v2`，但是实际上我在生成的`part_subsystem.json`中找不到，于是和`parts.json`中的键值对应不上，导致了出现的错误。对于`part_subsystem.json`我们可以看到在文件`./build/hb/util/loader/load_ohos_build.py`中搜寻`process_parts_info(parts_config_dict, parts_info_output_path, skip_partlist_check)`函数，大致扫一下我们可以知道这个函数通过检查`parts_config_dict`字典中是否存在键`parts_info`，如果存在则获取对应的值`parts_info`，该值通常是一个包含零件信息的字典，将这个字典的键值输出到新生成的`part_subsystem.json`中。继续看下去，可以在`get_parts_info`函数中看到是如何使用`process_parts_info`的，我们可以看到在我们根据教程使用，会缺少创建`device/board/emfire/challenger_h743v2/ohos.build`和`vendor/emfire/challenger_h743v2/ohos.build`，我们可以按照提供的示例创建类似的文件即可避免错误。  

