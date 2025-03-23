---
title: "Macos plist 配置"
date: 2025-03-23T14:32:53+08:00
lastmod: 2025-03-23T14:32:53+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: ["macos"]
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
在 macOS 系统中，launchd 是管理系统和用户后台任务（即守护进程 Daemons 与代理进程 Agents）的核心机制。想要在 macOS 上创建或管理定时任务、服务程序或后台脚本，理解 launchd 和其对应的 .plist 配置文件是必不可少的。
{{< sidenote >}}本文内容参考于[Creating Launch Daemons and Agents](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html){{< /sidenote >}}

## 为什呢使用launchd  
相比传统方式（如 cron、inetd），launchd 提供了更现代和统一的方式来启动和管理进程，优势包括：
 - 支持按需启动（On-Demand）：节省系统资源；
 - 无需处理依赖顺序：launchd 会自动协调启动顺序；
 - 统一配置入口：通过标准化的 .plist 文件配置任务；
 - 简化权限处理：系统层任务由 launchd（以 root 身份）启动后传递资源给子进程；
 - 支持多种触发方式：时间、文件变动、目录状态、Socket 等。

## LaunchDaemons vs LaunchAgents  
 - LaunchDaemons：系统级守护进程（/Library/System/LaunchDaemons），在无用户登录时也能运行。
 - LaunchAgents：用户级代理进程（/Library/LaunchAgents 或 ~/Library/LaunchAgents），需要用户登录后才会运行。

## plist 文件结构与关键字段  
.plist 文件是以 XML 格式编写的，以下是几个关键字段：  
| Key                          | 作用说明                                            |
|-----------------------------|------------------------------------------------------|
| `Label`                     | 唯一标识任务（必须）                                 |
| `ProgramArguments`          | 启动命令和参数（必须）                               |
| `KeepAlive`                 | 是否持续运行（默认为 false）                         |
| `StartInterval`             | 每隔多少秒执行一次任务                               |
| `StartCalendarInterval`     | 类似 cron 的定时机制（如每月 7 日 13:45）            |
| `WatchPaths`                | 监听指定路径的变动                                   |
| `QueueDirectories`          | 监听目录非空触发运行                                 |
| `StandardOutPath` / `StandardErrorPath` | 输出日志路径                             |
| `Sockets`                   | 声明监听的端口（支持 TCP/UDP）                       |
| `inetdCompatibility`        | 模拟旧的 inetd 行为                                  |

### Hello World  
{{< collapse summary="/Library/LaunchDaemons/com.example.hello.plist" >}}
```
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.example.hello</string>
    <key>ProgramArguments</key>
    <array>
        <string>hello</string>
        <string>world</string>
    </array>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```
{{< /collapse >}}

### 每 5 分钟执行一次  
{{< collapse summary="/Library/LaunchDaemons/com.example.hello.plist" >}}
```plist  
<key>StartInterval</key>
<integer>300</integer>
```
{{< /collapse >}}

### 监听某文件变化  
{{< collapse summary="/Library/LaunchDaemons/com.example.hello.plist" >}}
```plist  
<key>WatchPaths</key>
<array>
    <string>/etc/hostconfig</string>
</array>
```
{{< /collapse >}}

## 如何加载与管理plist  
```bash  
# 加载任务
sudo launchctl load /Library/LaunchDaemons/com.example.hello.plist

# 卸载任务
sudo launchctl unload /Library/LaunchDaemons/com.example.hello.plist

# 查看任务状态
launchctl list | grep com.example.hello
```

