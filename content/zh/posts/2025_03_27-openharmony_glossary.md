---
title: "OpenHarmony移植到STM32H743系列_术语含义"
date: 2025-03-27T10:26:38+08:00
lastmod: 2025-03-27T10:26:38+08:00
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
- [术语含义](../2025_03_27-openharmony_glossary):point_left: 你在这里
- [源码拉取](../2025_03_27-openharmony_source)
- [移植验证](../2025_03_27-openharmony_porting_minichip_overview)
- [内核移植](../2025_04_01-openharmony_Kernel_porting)
{{< /quote >}}

本篇内容源自[术语](https://gitee.com/openharmony/docs/blob/master/zh-cn/glossary.md)

## A

### abc文件
方舟字节码（ArkCompiler Bytecode）文件，是 ArkCompiler 编译工具链以源代码为输入生成的中间产物，后缀为 `.abc`，发布时打包进 `.hap` 文件中。

### AppLinking
基于操作系统的 DeepLink/URL Scheme 提供的用户增长服务，支持直达内容、安装跳转、安全认证。

### ArkCompiler
方舟编译器，OpenHarmony 的核心编译运行平台，支持多语言编译和运行，面向多设备、多平台。

### ArkTS
基于 TypeScript 扩展的应用开发语言，支持声明式UI、状态管理，适用于 OpenHarmony 应用开发。

### ArkUI
原生 UI 框架，支持跨设备的高性能 UI 开发，构建统一 UI 架构。

## B

### BMS
Bundle Manager Service，包管理服务。

## C

### CES
Common Event Service，公共事件服务，负责事件的发布、订阅和退订。

## D

### DMS
Distributed Management Service，分布式管理服务。

## E

### ExtensionAbility
Stage 模型中的组件类型，提供特定场景的扩展能力，如输入法、卡片等。

## F

### FA
Feature Ability，FA 模型中代表带 UI 的交互组件。

### FA模型
早期应用模型（API 8 及之前），现推荐使用 Stage 模型。

## H

### HAP
Harmony Ability Package，应用安装包，后缀为 `.hap`。

### HCS
HDF Configuration Source，用于硬件驱动配置的 key-value 配置语言。

### HC-GEN
HCS 配置生成工具，将配置文件转为可读格式。

### HDF
Hardware Driver Foundation，硬件驱动基础框架，支持统一驱动开发与管理。

### Hypium
OpenHarmony 自动化测试框架，目标为“超自动化测试”。

## I

### IDN
Intelligent Distributed Networking，分布式组网能力模块，管理设备连接状态与事件通知。

## M

### Module
应用模块，每个模块有独立的 `module.json5` 配置。包括 Entry、Feature、HSP、HAR 等。

## P

### PA
Particle Ability，无界面组件，通常为后台服务或数据访问能力提供支持。

## S

### Service Widget（服务卡片）
桌面快捷卡片，支持服务直达与快捷交互。

### Stage模型
从 API 9 起引入的新应用模型，支持 UIAbility、ExtensionAbility 等组件类型。

### Super Virtual Device（超级虚拟终端）
通过分布式技术整合多个设备能力，统一调度使用。

### SysCap（System Capability）
系统能力标识符，用于描述系统中的某一功能，如蓝牙、WiFi、NFC 等。

### System Type（系统类型）

- **Mini System**：面向 MCU 设备，内存 ≥ 128 KiB。适用于传感器、连接模组等。
- **Small System**：面向 Cortex-A 等处理器，内存 ≥ 1 MiB。适用于摄像头、路由器等。
- **Standard System**：面向高性能 Cortex-A 设备，内存 ≥ 128 MiB。适用于平板、冰箱屏等富设备。

## U

### UIAbility
Stage 模型中代表含 UI 的组件，主要用于与用户交互。

本术语表仅供参考，如需完整内容请查阅 [OpenHarmony官方文档](https://gitee.com/openharmony/docs)。
