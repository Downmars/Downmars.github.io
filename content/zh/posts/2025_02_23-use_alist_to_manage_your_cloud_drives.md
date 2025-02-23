---
title: "使用Alist管理你的网盘"
date: 2025-02-23T20:56:46+08:00
lastmod: 2025-02-23T20:56:46+08:00
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
    image: "images/posts/2025_02_23-use_alist_to_manage_your_cloud_drives/alist.svg"
    alt: ""
    caption: ""
---

## 前言  
在linux环境下面的时候，使用国内的一些网盘是很麻烦的事情，很多盘没有对应的linux客户端，同时在拥有多个网盘账户的用户，管理起来也是十分的麻烦。我一直使用[Alist](https://github.com/AlistGo/alist)作为管理盘工具，其[wiki](https://alist.nn.ci/zh/)能够提供足够的自定义设置以及友好的帮助，这个软件能够很好的满足我的需求。

- 统一管理多个网盘账户
- 支持WebDAV/S3等协议访问
- 提供统一的文件管理界面
- 支持超过30种存储服务

本文将会介绍如何部署和使用Alist来管理你的多个网盘账户。

## 安装Alist  
这边官方提供多种安装方式，包括一键安装、手动安装、Docker、桌面版本、源码安装，我这边展示两种安装方式：  
### 一键安装  
```bash  
curl -fsSL "https://alist.nn.ci/v3.sh" -o v3.sh && bash v3.sh  
```
默认安装在`/opt/alist`，如果自定义安装路径，需要将绝对的安装路径`path/to/you/alist`作为作为`bash v3.sh`的参数添加在后面。  

### AUR安装  
由于我使用的是Archlinux，所以AUR库中有人上传了对应的包，看了下更新时间，应该是随着Github同步更新的。  
```bash  
yay -S alist  
```
上述两种方法可以使用命令`alist`进行Alist的功能管理。  

## 获取密码  
在Alist的安装路径运行以下命令：  
```bash  
# 运行程序
./alist server
# 随机生成一个密码
./alist admin random 
# 手动设置一个密码 `NEW_PASSWORD`是指你需要设置的密码
./alist admin set NEW_PASSWORD
```
获取密码之后，我们就可以使用默认用户名`admin`和设定的密码在[http://localhost:5244](http://localhost:5244)进行登录。  

## 主页配置  
访问 [http://localhost:5244](http://localhost:5244) 进入管理界面，在`存储`菜单中添加你的网盘账户：

1. 点击"添加存储"
2. 选择对应的网盘服务商（如阿里云盘、Google Drive等）
3. 填写必要的认证信息（通常需要获取API token或OAuth授权）
4. 设置挂载路径和存储策略

我这边以百度网盘为例：

- 驱动： 百度网盘  
- 挂载路径： /01_百度网盘  
- WebDAV策略： 使用代理地址  
- 刷新令牌： xxxx  
- 客户端ID： yyyy  
- 客户端密钥： zzzz  

此处，刷新令牌可以从此处获取：[Baidu Refresh Token Callback](https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=iYCeC9g08h5vuP9UqvPHKKSVrKFXGa1v&redirect_uri=https://alist.nn.ci/tool/baidu/callback&scope=basic,netdisk&qrcode=1)。需要在打开链接之前使用网页端打开百度网盘，这样网站能够获取你的百度网盘的token。我们只需要将刷新出来的`refresh_token:`复制到我们配置中的刷新令牌位置即可获取到用户端ID和用户端密钥。  
之后，我们在主页即可查看到我们配置的网盘：  
{{< figure src="/images/posts/2025_02_23-use_alist_to_manage_your_cloud_drives/baidu_cloud.png" caption="百度网盘" align="center" >}}
如果需要配置其余网盘，可以参考[官方文档](https://alist.nn.ci/zh/guide/drivers/common.html#web-%E4%BB%A3%E7%90%86)。

## 设置开机自启  
由于上述两种安装方式，已经自动配置了Service服务，所以直接使用下述的命令即可使得开机自启等操作。如果未配置开机自启，需要手动配置服务：
{{< collapse summary="/usr/lib/systemd/system/alist.service" >}}
```ini
[Unit]
Description=Alist service
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/alist
ExecStart=/path/to/alist/alist server

[Install]
WantedBy=multi-user.target
```
{{< /collapse >}}
然后执行以下命令进行：
```bash
# 重新加载系统守护进程  
$ systemctl daemon-reload

# 设置服务开机自启动
$ systemctl enable alist.service

# 启动服务
$ systemctl start alist.service

# 检查服务状态
$ systemctl status alist.service  
```


