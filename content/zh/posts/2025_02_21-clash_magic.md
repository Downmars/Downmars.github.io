---
title: "Clash魔法配置"
date: 2025-02-21T19:39:24+08:00
lastmod: 2025-02-21T19:39:24+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: ["clash"]
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
## 前言
人在国内，安装完系统之后第一件事往往是配置一个魔法，这里参考了[Arch Linux Clash 安装配置记录|清絮的博客](https://blog.linioi.com/posts/clash-on-arch/)。

## 下载 Clash

```bash  
# 如果你使用 Arch Linux，请使用以下命令安装 Clash。
sudo pacman -S clash  
```

如果你使用其他 Linux 系统，可以从 [Clash](https://github.com/DustinWin/clash_singbox-tools/releases/tag/Clash-Premium) 下载。

```bash  
# 将 Clash 复制到 /usr/local/bin 目录。  
sudo cp clash /usr/local/bin/  

# 授予 Clash 可执行权限。  
sudo chmod +x /usr/local/bin/clash  
```

## 配置 Clash

```bash  
# 创建默认的 YAML 配置文件
clash 
```

启动 Clash 后，它会在 `~/.config/clash` 目录下生成一个默认配置文件。`~/.config/clash/config.yaml` 指的是你为 Clash 配置文件指定的目录，该目录存储你的节点和规则。你可以直接将此文件替换为你自己的配置文件。  
修改配置文件后，只需重启 Clash 即可启用代理。

## 设置系统代理

```bash  
# 编辑 /etc/environment 文件  
sudo vim /etc/environment
```
{{< collapse summary="/etc/environment" >}}
```
# 添加网络代理设置
http_proxy=127.0.0.1:7890
https_proxy=127.0.0.1:7890
socks_proxy=127.0.0.1:7891
```
{{< /collapse >}}

## 设置开机自启动

```bash  
# 查看 Clash 的绝对路径  
which clash  
```

对于 Arch Linux，默认路径为 `/usr/bin/clash`。

```bash  
# 创建一个文件夹来存储与 Clash 相关的文件  
sudo mkdir -p /etc/clash
# 复制相关文件  
sudo cp ~/.config/clash/config.yaml /etc/clash/
sudo cp ~/.config/clash/Country.mmdb /etc/clash/
```

```bash  
# 编辑 /etc/systemd/system/clash.service 文件
sudo vim /etc/systemd/system/clash.service
```

{{< collapse summary="/usr/lib/systemd/system/clash.service" >}}
```service
# /usr/lib/systemd/system/clash.service 文件内容如下：
[Unit]
Description=Clash 守护进程，一个基于规则的 Go 语言代理。
After=network.target

[Service]
Type=simple
Restart=always
ExecStart=/usr/bin/clash -d /etc/clash # 修改为你的实际路径

[Install]
WantedBy=multi-user.target
```
{{< /collapse >}}


```bash  
# 重新加载系统守护进程  
systemctl daemon-reload

# 设置服务开机自启动
systemctl enable clash.service

# 启动服务
systemctl start clash.service

# 检查服务状态
systemctl status clash.service  
```

