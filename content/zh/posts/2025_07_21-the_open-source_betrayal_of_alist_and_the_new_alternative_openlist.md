---
title: "开源背叛Alist以及新的替代OpenList"
date: 2025-07-21T20:51:25+08:00
lastmod: 2025-07-21T20:51:25+08:00
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

我在之前的博客中也介绍过[Alist相关的使用](../2025_02_23-use_alist_to_manage_your_cloud_drives)，曾经作为一个广受欢迎的多平台开源云存储整合项目，由于其支持多种格式云存储统一管理的功能，在开源社区中吸引了众多的支持者。  

## 事情起因  
2025年6月，AList项目被曝光已被原开发者 [Xhofe](https://github.com/Xhofe)悄然出售给贵州不够科技公司（BugoTech），整个交易未提前告知社区，引发开源圈震动。  
同时在出售后，新公司接管后同样出现争议操作：包括在 PR 中添加上传用户设备信息的可疑代码、删除原作者信息、大幅商业化（如加 VIP 群、换域名）等，导致用户担忧隐私泄露和“供应链投毒”。  
不够科技本身也有收购其他开源项目后引发权限和闭源争议的“黑历史”，这在进一步加剧了社区对其不信任。  
社区对 Xhofe 的行为既有理解其个人付出的同情，也有对其“暗箱操作”的强烈指责，认为这背叛了开源精神。  
在这种情况下，大量用户选择自救，涌现了 [OpenList](https://github.com/OpenListTeam/OpenList/tree/main) 等分叉项目，移除风险代码并重建透明机制，替代方案迅速获得支持。  

## 后续  
OpenList作为一个社区Alist的分支，其安装部署方式与后者基本相同，所以我们这里就不过多赘述。  
作为一个从曾经的Alist项目中分支出来的开源项目，我们也希望能有更多有能力的小伙伴参与到OpenList中，贡献自己的一份力量！
