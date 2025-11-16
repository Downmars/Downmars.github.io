---
title: "2025_11_16 Build_a_personal_website"
date: 2025-11-16T17:41:01+08:00
lastmod: 2025-11-16T17:41:01+08:00
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

我现在的博客部署在[github.io](github.io)上，一直想要在个人网站上搭建自己的博客以及部署一些有意思的项目，这次趁双十一购入了服务器与域名，这里做一个简单的记录。  

## 一台可用的VPS  
你可以在任意VPS提供商上购买所需要的服务器，比如说我这边是用的是[RackNerd](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.racknerd.com/&ved=2ahUKEwj9rN3guvaQAxU3m68BHZHhF5kQFnoECD0QAQ&usg=AOvVaw1f3G5tQVYCJRLV5V-s0O-I)，正好赶上双11优惠，花费了70块弄了一个低配的KVM小机子，用作轻量级服务。1vCPU, 1G内存, 20G硬盘空间，3T/月的带宽，虽说配置比较低，但是很适合配置轻量级服务器与学习作用。  

反正就是权衡一下自己的需求，按照性能、稳定性、性价比来选择自己的服务器选型，大家可以自行去网上寻找关于各家VPS的测评。  

我这边购买了RackNerd的服务器遇到了很奇怪的问题。在登录验证邮件中的IP 地址和登录进控制台实际显示的IP 地址不一致，最后是控制台实际显示的IP 地址是正确地址，通过控制台显示的IP能够正常登录。

## 一个可用的域名  
你同样可以在任意的顶级域名提供商上购买你所中意的域名，我们一般选择`.com`后缀的域名，具体关于域名选择的讨论可以看[Ask HN: Which domain extension would you choose for your personal site?](https://news.ycombinator.com/item?id=14458349)。  
我这里选择的是[SpaceShip](https://www.spaceship.com/zh/)上购买我的域名，在哪一家购买域名都可以，基本上就是看价格谁家便宜，我这里购买了[downmars.com](downmars.com)。  

## DNS解析  
DNS（Domain Name System）域名系统可以告诉网络你的域名关联再哪个服务器上面，我这边选择了[Cloudflare](https://dash.cloudflare.com/profile/authentication)。它除了帮忙提供DNS解析之外，还能够提供安全流量代理、CDN解析等内容。  

我们再Cloudflare上添加需要管理的域名，选择免费套餐即可，在记录中添加：  
- Type: A, Name: @, Content: 你的IP地址  
- Type: CNAME, Name: www, Content: 你的域名  
这两个分别是将访问的域名联系上服务器的IP与将www自动跳转到主域名。

到此，我们设置服务器、域名与DNS解析部分的设置就已经基本完成了，接下来我们就可以在服务器上部署我的所需要的服务了。
