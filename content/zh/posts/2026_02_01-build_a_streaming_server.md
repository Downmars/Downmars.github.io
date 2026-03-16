---
title: "使用 FRP + Sunshine + Moonlight 搭建远程串流服务"
date: 2026-02-01T16:22:28+08:00
lastmod: 2026-03-16T21:30:28+08:00
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

{{< admonition type=“tip” title=“更新说明（2026-03-16）” collapsible=“true” >}}
> 本文已根据实际部署与排障过程进行修订，主要更新内容包括：  
> 1. 修正 FRP 服务端/客户端配置说明；  
> 2. 补充 Sunshine 自定义端口族与多客户端并存的配置逻辑；  
> 3. 新增 Moonlight `certificate mismatch`、`unexpected end of stream`、端口检测异常等问题的排查说明；  
> 4. 修正部分端口开放与服务暴露建议。  
{{< /admonition >}}

## 网络检测  
### 带宽  
对于串流被控端需要有足够的上行带宽，例如4K 60FPS一般需要50Mbps，如果要排除一些网络不稳定状态，可能还需要有1/3的冗余带宽；同理，对于串流控制端需要有足够的下行带宽，也需要大致50Mbps。我们这里可以用[speedtest](https://www.speedtest.net/)等软件进行测量。

### 延迟  
对于一些高交互性，竞技性的游戏，串流进行游戏不建议，毕竟有一个服务器的往返时间差，吃力不讨好。对于一些如逆转裁判，GAL等非即时交互的游戏可以有一个比较好的体验，总而言之对于远程串流而言，时延越低体验越好。一般来说，60ms 以内仍可接受，超过 100ms 后，在高交互场景中更容易出现明显的输入迟滞、音画不同步等问题。这边可以用ping来测试服务器时延，但是需要*2。

### 丢包率
如果网络质量比较差，丢包就会导致视频流，音频流不稳定，画面出现花屏，模糊，断裂，严重影响使用体验，这边也可以用ping来测量。

### NAT
NAT的层级对于我们串流方式的选择也有很大的影响，一般划分NAT为4个层级，NAT1、NAT2、NAT3、NAT4，对于想要实现NAT穿越的用户来说，NAT 类型会影响串流方案的选择。若双方网络条件较好，可以尝试点对点连接；若处于严格 NAT 或运营商网络环境下，通常更稳妥的做法是通过具备公网 IP 的中继服务器进行转发，例如使用 FRP。在NAT3与NAT4的环境中，内部网络的设备通过路由器共享同一个公网IP地址，外部的设备无法直接访问内网中的设备。为了让外部设备能够访问内网设备，需要通过路由器进行端口转发或者使用中继服务器；在NAT1与NAT2环境下，由于路由器允许更加自由的连接和端口映射，内网设备可以直接与外网设备之间直接建立联系，即P2P打洞，实现更加好的网络性能。  
我们这边使用FRP进行终端流量转播来实现流量的转播。
你可以使用一些在线网站[MyNat](https://mao.fan/mynat)、[NatTypeTester](https://github.com/HMBSbige/NatTypeTester)等一些工具查看你现在使用网络的NAT类型。  

## FRP穿透
[FRP](https://github.com/fatedier/frp)是一个用于内网穿透的反向代理应用，将服务器端部署在具有公网IP的机器上，客户端部署在内网或者防火墙内的机器上，通过访问暴露在服务器上的端口，反向代理到处于内网的服务。  

### FRPS
#### Sunshine 默认端口族  
Sunshine 默认以 47989 为基准端口，相关端口族如下：
```md  
## Sunshine 默认端口族

- TCP
  - 47984：HTTPS
  - 47989：HTTP
  - 47990：Web UI
  - 48010：RTSP

- UDP
  - 47998：Video
  - 47999：Control
  - 48000：Audio
  - 48002：Mic（通常未使用）
```
Sunshine 官方文档说明，修改 port 后，其它端口会按固定偏移整体变化；Moonlight 官方文档也把 47984、47989、48010（TCP）以及 47998、47999、48000、48002、48010（UDP）列为 Sunshine 场景下需要关注的联网端口。

#### 服务器端口开放  
```bash
# FRP
sudo ufw allow 7000/tcp
sudo ufw allow 7500/tcp

# Sunshine A（默认端口族，基础端口 47989）
sudo ufw allow 47984/tcp
sudo ufw allow 47989/tcp
sudo ufw allow 48010/tcp

sudo ufw allow 47998/udp
sudo ufw allow 47999/udp
sudo ufw allow 48000/udp
sudo ufw allow 48002/udp
sudo ufw allow 48010/udp

# 查看规则
sudo ufw status numbered
```
我们需要在购置的服务器的外部配置网站上开放FRP以及Moonlight与Sunshine的服务通讯端口。

#### frps.toml
我们首先需要下载[frp的打包软件](https://github.com/fatedier/frp/releases/tag/v0.67.0)，这里用的是0.67.0的版本。解压下来可以并编辑我们的frps.toml服务端frp配置
{{< collapse summary="/usr/bin/frps/frps.toml" >}}
```toml
bindPort = 7000

auth.method = "token"
auth.token = "YOUR_TOKEN"

webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "YOUR_ADMIN"
webServer.password = "YOUR_PASSWORD"

transport.tcpMux = true

allowPorts = [
  { start = 47984, end = 48010 }
]
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
{{< collapse summary="/etc/frp/frpc.toml" >}}
```toml
serverAddr = "服务器公网IP"
serverPort = 7000

auth.method = "token"
auth.token = "YOUR_TOKEN"

user = "pc-a"

[[proxies]]
name = "sunshine-https"
type = "tcp"
localIP = "127.0.0.1"
localPort = 47984
remotePort = 47984

[[proxies]]
name = "sunshine-http"
type = "tcp"
localIP = "127.0.0.1"
localPort = 47989
remotePort = 47989

[[proxies]]
name = "sunshine-rtsp-tcp"
type = "tcp"
localIP = "127.0.0.1"
localPort = 48010
remotePort = 48010

[[proxies]]
name = "sunshine-video"
type = "udp"
localIP = "127.0.0.1"
localPort = 47998
remotePort = 47998

[[proxies]]
name = "sunshine-control"
type = "udp"
localIP = "127.0.0.1"
localPort = 47999
remotePort = 47999

[[proxies]]
name = "sunshine-audio"
type = "udp"
localIP = "127.0.0.1"
localPort = 48000
remotePort = 48000

[[proxies]]
name = "sunshine-mic"
type = "udp"
localIP = "127.0.0.1"
localPort = 48002
remotePort = 48002

[[proxies]]
name = "sunshine-rtsp-udp"
type = "udp"
localIP = "127.0.0.1"
localPort = 48010
remotePort = 48010
```
{{< /collapse >}}

如果需要配置被控端自启动，linux就用service，windows就用bat，看自己使用情况。

## 多客户端情况  
如果只接入一台 Sunshine 主机，直接使用默认端口族即可。  
如果要同时接入多台 Sunshine 主机，`frpc.toml`则需要满足以下条件：  
1. 每台客户端使用不同的 `user`；  
2. 每台客户端的代理 `name` 唯一；  
3. 每台客户端占用不同的 `remotePort`；  
4. 如果某台主机修改了 Sunshine 基础端口，则该主机的 `localPort` 也必须对应新的端口族。  

假设第二台 Sunshine 主机将基础端口改为 `48989`，则其本地端口族会变为：
```md  
- TCP
  - 48984
  - 48989
  - 48990
  - 49010

- UDP
  - 48998
  - 48999
  - 49000
  - 49002
  - 49010
```

{{< collapse summary="/etc/frp/frpc-b.toml" >}}
```toml
serverAddr = "服务器公网IP"
serverPort = 7000

auth.method = "token"
auth.token = "YOUR_TOKEN"

user = "pc-b"

[[proxies]]
name = "sunshine-b-https"
type = "tcp"
localIP = "127.0.0.1"
localPort = 48984
remotePort = 48984

[[proxies]]
name = "sunshine-b-http"
type = "tcp"
localIP = "127.0.0.1"
localPort = 48989
remotePort = 48989

[[proxies]]
name = "sunshine-b-rtsp-tcp"
type = "tcp"
localIP = "127.0.0.1"
localPort = 49010
remotePort = 49010

[[proxies]]
name = "sunshine-b-video"
type = "udp"
localIP = "127.0.0.1"
localPort = 48998
remotePort = 48998

[[proxies]]
name = "sunshine-b-control"
type = "udp"
localIP = "127.0.0.1"
localPort = 48999
remotePort = 48999

[[proxies]]
name = "sunshine-b-audio"
type = "udp"
localIP = "127.0.0.1"
localPort = 49000
remotePort = 49000

[[proxies]]
name = "sunshine-b-mic"
type = "udp"
localIP = "127.0.0.1"
localPort = 49002
remotePort = 49002

[[proxies]]
name = "sunshine-b-rtsp-udp"
type = "udp"
localIP = "127.0.0.1"
localPort = 49010
remotePort = 49010
```
{{< /collapse >}}
### frps 端口白名单（多客户端）  
如果第二台主机使用 `48989` 这一组端口，则服务端的 `allowPorts` 和防火墙规则也需要同步增加：
{{< collapse summary="/usr/bin/frps/frps.toml" >}}
```toml
allowPorts = [
  { start = 47984, end = 48010 },
  { start = 48984, end = 49010 }
]
```
{{< /collapse >}}
服务端防火墙也可以写成：
```bash  
sudo ufw allow 48984/tcp
sudo ufw allow 48989/tcp
sudo ufw allow 49010/tcp

sudo ufw allow 48998/udp
sudo ufw allow 48999/udp
sudo ufw allow 49000/udp
sudo ufw allow 49002/udp
sudo ufw allow 49010/udp
```

## Sunshine & Moonlight
[Sunshine](https://github.com/LizardByte/Sunshine)和[Moonlight](https://moonlight-stream.org/)是串流的游戏流媒体服务端以及客户端，我们需要在被控电脑端配置Sunshine，在控制端配置Moonlight。
Sunshine直接下载Release中适合自己版本并打包好的软件即可，一般打开后访问[192.168.1.5:47990](192.168.1.5:47990)。第一次访问需要设置用户名与密码，之后等待Moonlight端发起串流请求并在PIN选项卡中输入Moonlight给出的PIN码即可。  
Moonlight需要你控制端如平板，手机，笔记本电脑等上安装，之后填入服务器的公网IP，如果配置了第二台客户端，需要填入公网IP:48989，以此类推，就会返回一个PIN码，在Sunshine中输入即可建立串流。  
Sunshine还需要配置自启动，这个也需要根据被控端的系统来设置。  

## 参考  
[Moonlight 远程串流 + 远程开机全流程搭建（低成本方案）](https://www.bilibili.com/opus/1097667321616400401)  
[体验较好的低延迟串流方案 | MoonLight+Sunshine+Tailscale](https://blog.welain.com/articles/2024/moonlight-streaming-with-vpn/)  
[Server搭建过程-5.Frp穿透介绍和P2P](https://alphax.top/1b481c64/)  

