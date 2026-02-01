---
title: "2026_01_30 Server_selection_and_purchase_and_some_precautions"
date: 2026-01-30T09:55:00+08:00
lastmod: 2026-01-30T09:55:00+08:00
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

## 几个参数
### CPU  
| 1-2核 | 4核 | 8核 | 16+核 |
|:-----:|:---:|:---:|:-----:|
|静态网站、个人博客，轻量级网站对于计算能力要求比较低|小型网站、电商，能够应对日常访问以及轻量化数据处理|数据库、数据分析，需要较强计算能力处理复杂查询，建议搭配大内存|游戏、直播等，需要高核心数与高频处理并发请求|

PS: 高并发数据处理需要多核，低并发但计算密集需求，如图形处理，模型训练等需高频率核心；同时CPU、内存、带宽需要合理匹配，如8核CPU建议搭配16G以上内存；在实际使用过程中如果CPU占用率长期超过80%，应该升级CPU了。

### 内存
| 0-2G | 2-4G | 4-16G |  16G+ |
|:----:|:----:|:-----:|:-----:|
|单服务、反向代理、静态网站、个人博客、简单API端口|小型后端、小型数据库、小型网站|多服务并行、高并发网站等|大型数据库、直播、虚拟化集群、模型训练等|
|并发量小，主要提供展示功能|需要处理缓存一定量数据信息|数据量较大，需要将大量数据加载到内存以确保快速访问|对于内存带宽和容量有极高的要求，处理高并发数据流或者内存密集型计算|

### 磁盘  
| NVMe | SATA | HDD |
|:---:|:---:|:---|
| 数据库、搜索、缓存、消息队列、高并发服务、CI 构建、容器密集、AI 数据读取/写入频繁 | 系统盘、日志不重的业务、一般 Web 服务、轻量数据库 | 归档、冷数据、备份、媒体库、对象存储型业务|

### 碎碎念
对大部分日常使用的人来说，往往价格才是我们最先考虑的事情，尽可能达到最大性价比。一般国外服务器推荐[搬瓦工](https://bandwagonhost.com/order/ecommerce/Los%20Angeles/USCA_9)、[RackNerd](https://www.racknerd.com/)的一些优惠套餐，可以关注一些电报群、论坛以获得最新的优惠信息，国内的一般可以选择[阿里云](https://www.aliyun.com/benefit/select/ecs?utm_content=se_1021771606&gclid=Cj0KCQiAkPzLBhD4ARIsAGfah8hNJ4y3WLd_LWJo4ZNTg-sSKnkUZtisuWYmrqhHglF6Tbbz0ETOouwaAngCEALw_wcB)的学生优惠，大概68一年，也可以整一个香港的服务器。

## 你想做什么？

