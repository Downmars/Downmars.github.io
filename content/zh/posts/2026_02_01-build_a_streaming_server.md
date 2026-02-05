---
title: "2026_02_01 Build_a_streaming_server"
date: 2026-02-01T16:22:28+08:00
lastmod: 2026-02-01T16:22:28+08:00
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

## 网络检测  
### 带宽  
对于串流被控端需要有足够的上行带宽，例如4K 60FPS一般需要50Mbps，如果要排除一些网络不稳定状态，可能还需要有1/3的冗余带宽；同理，对于串流控制端需要有足够的下行带宽，也需要大致50Mbps。我们这里可以用[speedtest](https://www.speedtest.net/)等软件进行测量。

### 延迟  
对于一些高交互性，竞技性的游戏，串流进行游戏不建议，毕竟有一个服务器的往返时间差，吃力不讨好。对于一些如逆转裁判，GAL等非即时交互的游戏可以有一个比较好的体验，总而言之60ms以内的延迟都处于可接受范围内，如果高于100ms就会出现卡顿，音画不同步等问题。这边可以用ping来测试服务器时延，但是需要*2。

### 丢包率
如果网络质量比较差，丢包就会导致视频流，音频流不稳定，画面出现花屏，模糊，断裂，严重影响使用体验，这边也可以用ping来测量。

### NAT
NAT的层级对于我们串流方式的选择也有很大的影响，一般划分NAT为4个层级，NAT1、NAT2、NAT3、NAT4，对于想要实现NAT穿越的用户来说，需要两边的NATA和NATB要满足A+B<=6。在NAT3与NAT4的环境中，内部网络的设备通过路由器共享同一个公网IP地址，外部的设备无法直接访问内网中的设备。为了让外部设备能够访问内网设备，需要通过路由器进行端口转发或者使用中继服务器；在NAT1与NAT2环境下，由于路由器允许更加自由的连接和端口映射，内网设备可以直接与外网设备之间直接建立联系，即P2P打洞，实现更加好的网络性能。  
我们这边使用FRP进行终端流量转播来实现流量的转播。
你可以使用一些在线网站[MyNat](https://mao.fan/mynat)、[NatTypeTester](https://github.com/HMBSbige/NatTypeTester)等一些工具查看你现在使用网络的NAT类型。  

## FRP穿透
[FRP](https://github.com/fatedier/frp)是一个用于内网穿透的反向代理应用，将服务器端部署在具有公网IP的机器上，客户端部署在内网或者防火墙内的机器上，通过访问暴露在服务器上的端口，反向代理到处于内网的服务。  

### FRPS
#### 防火墙端口开放  
| TCP | UDP |
|:---:|:---:|
| 7000 | 47998 |
| 7001 | 47999 |
| 7080 | 48000 |
| 7500 | |
| 47984 | |
| 47989 | |
| 47990 | |
| 48010 | |
我们需要在购置的服务器的外部配置网站上开放FRP以及Moonlight与Sunshine的服务通讯端口。

#### 服务器端口开放  
```bash
// 开放TCP端口
sudo nfw allow tcp 7000
sudo nfw allow tcp 7001
sudo nfw allow tcp 7080
sudo nfw allow tcp 7500
sudo nfw allow tcp 47984
sudo nfw allow tcp 47989
sudo nfw allow tcp 47990
sudo nfw allow tcp 48010

// 开放UDP端口
sudo nfw allow udp 47998
sudo nfw allow udp 47999
sudo nfw allow udp 48000

// 查看开放的端口
sudo nfw show
```
我这边使用的是nfw查看、配置服务器系统当前的防火墙规则以及端口。

#### frps.toml
我们首先需要下载[frp的打包软件](https://github.com/fatedier/frp/releases/tag/v0.67.0)，这里用的是0.67.0的版本。解压下来可以并编辑我们的frps.toml服务端frp配置
{{< collapse summary="/usr/bin/frps/frps.toml" >}}
```toml
[common]
bindPort = 7000
authentication_method = token
token = YOUR_TOKEN
dashboard_port = 7500
dashboard_user = YOUR_ADMIN
dashboard_pwd = YOUR_PASSWORD
tansport.tcpMux = true
```
{{< /collapse >}}

{{< collapse summary="/etc/systemd/system/frps.service" >}}
```service
[Unit]
Description=FRP Server (frps)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/frps -c /etc/frp/frps.toml
Restart=always
RestartSec=3
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```
{{< /collapse >}}

我这边的配置是将解压下来的软件包换了个位置，具体需要按自己的情况修改frps.toml和frps位置。
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now frps
sudo systemctl status frps --no-pager
```
可以通过以上指令进行frps服务自启动
### FRPC
同样的，我们需要在被控端使用frp中frpc服务。
{{< collapse summary="frpc.toml" >}}
```toml
[common]
serverAddr = "服务器公网IP"
serverPort = 7000

transport.protocol = "tcp"
transport.poolCount = 8
auth.method = "token"
auth.token = "YOUR_TOKEN"

[[proxies]]
name = "moonlight-control-1"
type = "tcp"
localIP = "127.0.0.1"
localPort = 47984
remotePort = 47984

[[proxies]]
name = "moonlight-control-2"
type = "tcp"
localIP = "127.0.0.1"
localPort = 47989
remotePort = 47989

[[proxies]]
name = "moonlight-video-stream"
type = "udp"
localIP = "127.0.0.1"
localPort = 47998
remotePort = 47998

[[proxies]]
name = "moonlight-video-stream-2"
type = "udp"
localIP = "127.0.0.1"
localPort = 47999
remotePort = 47999

[[proxies]]
name = "moonlight-video-stream-3"
type = "udp"
localIP = "127.0.0.1"
localPort = 48000
remotePort = 48000

 [[proxies]]
name = "port4"
type = "tcp"
localIP = "127.0.0.1"
localPort = 48010
remotePort = 48010

```
{{< /collapse >}}

如果需要配置被控端自启动，linux就用service，windows就用bat，看自己使用情况。

## Sunshine & Moonlight

[Sunshine](https://github.com/LizardByte/Sunshine)和[Moonlight](https://moonlight-stream.org/)是串流的游戏流媒体服务端以及客户端，我们需要在被控电脑端配置Sunshine，在控制端配置Moonlight。
Sunshine直接下载Release中适合自己版本并打包好的软件即可，一般打开后访问[192.168.1.5:47990](192.168.1.5:47990)。第一次访问需要设置用户名与密码，之后等待Moonlight端发起串流请求并在PIN选项卡中输入Moonlight给出的PIN码即可。
Moonlight需要你控制端如平板，手机，笔记本电脑等上安装，之后填入服务器的公网IP，就会返回一个PIN码，在Sunshine中输入即可建立串流。  
Sunshine还需要配置自启动，这个也需要根据被控端的系统来设置。  

## 参考  
[Moonlight 远程串流 + 远程开机全流程搭建（低成本方案）](https://www.bilibili.com/opus/1097667321616400401)
[体验较好的低延迟串流方案 | MoonLight+Sunshine+Tailscale](https://blog.welain.com/articles/2024/moonlight-streaming-with-vpn/)
[Server搭建过程-5.Frp穿透介绍和P2P](https://alphax.top/1b481c64/)

