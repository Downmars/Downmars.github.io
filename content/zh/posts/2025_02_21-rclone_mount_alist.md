---
title: "使用Rclone挂载Alist网盘"
date: 2025-02-21T20:00:04+08:00
lastmod: 2025-02-21T20:00:04+08:00
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

## 下载 rclone

```bash 
# 检查 rclone 是否可以通过 Pacman 仓库安装  
$ sudo pacman -Ss rclone  
$ sudo pacman -S rclone  
```

我们在[使用Alist管理你的网盘](../2025_02_23-use_alist_to_manage_your_cloud_drives)配置过Alist服务，要将 Alist 挂载到本地系统，首先需要配置 **rclone 远程**。[rclone 文档](https://rclone.org/webdav/) 对此进行了详细说明，或者你可以按照以下命令进行配置：

```bash 
# 进入 rclone 配置界面    
$ rclone config

# 选择新建远程  
没有找到远程，创建一个新的？
n) 新建远程
s) 设置配置密码
q) 退出配置
n/s/q> n # 选择 n

# 设置远程名称  
name> remote
选择要配置的存储类型。
从下面的选项中选择一个，或者手动输入
[snip]
XX / WebDAV
   \ "webdav"
[snip]
Storage> webdav # 选择 webdav 作为远程名称  

# 设置远程 URL http://your_alist_ip:port/dav
输入 WebDAV 服务器的 URL
从下面的选项中选择一个，或者手动输入
 1 / 连接到 example.com
   \ "https://example.com"
url> http://127.0.0.1:5244/dav # 在此处设置 alist 地址和端口，后面加上 "dav"，这是 Alist 所要求的  

# 选择 6  
你使用的 WebDAV 网站/服务/软件名称
从下面的选项中选择一个，或者手动输入
 1 / Fastmail 文件
   \ (fastmail)
 2 / Nextcloud
   \ (nextcloud)
 3 / Owncloud
   \ (owncloud)
 4 / Sharepoint Online，微软账户认证
   \ (sharepoint)
 5 / Sharepoint 使用 NTLM 认证，通常是自托管或本地部署
   \ (sharepoint-ntlm)
 6 / 其他网站/服务或软件
   \ (other)
vendor> 6

# 输入远程账户信息  
用户名
user> admin # 这是你的 alist 用户   

# 输入远程密码  
密码。
y) 是的，输入我的密码
g) 生成随机密码
n) 否，留空此密码
y/g/n> y # 输入 y  
请输入密码：# 输入密码时不可见  
password:
确认密码：# 再次输入密码
password:

# 按回车键  
Bearer Token 代替用户名/密码（例如 Macaroon）
bearer_token>
远程配置

# 选择默认配置  

# 远程配置结果：
--------------------
[remote]
type = webdav
url = http://127.0.0.1:5244/dav
vendor = Other
user = admin
pass = *** ENCRYPTED ***
--------------------

# 确认配置  
y) 是的，确认这个配置
e) 编辑这个远程
d) 删除这个远程
y/e/d> y # 输入 y  

# 输入 "q" 退出配置  
```

## 挂载到本地系统

可以使用以下命令检查是否已成功连接，并确认 `alist` 是否已挂载：

```bash  
# 检查 alist 目录
$ rclone lsd alist:

# 查看 alist 的文件
$ rclone ls alist:
```

```bash 
# 将 alist 目录挂载到本地目录 /mnt/Webdev/，此命令为前台命令，运行后会被挂起。
$ rclone mount alist:/ /webdav  --copy-links --no-gzip-encoding --no-check-certificate --allow-other --allow-non-empty --umask 000 --use-mmap
```

```bash 
# 检查本地挂载位置
$ df -h  

# 输出结果类似于：
Alist:               1.0P     0  1.0P   0% /mnt/Webdev
```

```bash 
# 卸载本地挂载
fusermount -qzu /webdav  
```

## 设置开机自启动

你需要使用 root 权限来运行以下命令：

```bash  
# 编辑服务文件  
$ vim /usr/lib/systemd/system/rclone.Service
```


{{< collapse summary="/usr/lib/systemd/system/rclone.Service" >}}
```ini
# /usr/lib/systemd/system/rclone.service 文件内容：
[Unit] 
Description=rclone
Before=network.service

[Service] 
User=root 
ExecStart=/usr/bin/rclone mount alist: /mnt/Webdev/  --copy-links --no-gzip-encoding --no-check-certificate --allow-other --allow-non-empty --umask 000 --use-mmap

[Install] 
WantedBy=multi-user.target
```
{{< /collapse >}}

```bash  
# 重新加载系统守护进程  
$ systemctl daemon-reload

# 设置服务开机自启动
$ systemctl enable rclone.service

# 启动服务
$ systemctl start rclone.service

# 检查服务状态
$ systemctl status rclone.service  
```

## 部分参考
[https://willxup.top/archives/deploy-alist-and-rclone](https://willxup.top/archives/deploy-alist-and-rclone)

## 上传文件
现在有一个问题，rclone会将本地文件缓存一份到本地的缓存地址，这会导致占用大量的本地磁盘空间，并且显示的上传同步速度和实际的速度不符合，我需要尝试再上传文件的时候直接上传到云端，并且不影响我浏览云端文件的时候，本地的目录或者部分文件的临时缓存。
