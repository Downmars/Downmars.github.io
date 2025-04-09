---
title: "Chatlog MCP 数据获取"
date: 2025-04-08T21:27:06+08:00
lastmod: 2025-04-08T21:27:06+08:00
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

## 前言  
前段时间买了一台mac mini，但是由于苹果的储存是金子做的，我就使用了外置硬盘来进行大文件的储存。我打算等到一年保修期过后进行扩容操作，在此期间，我使用`ntfs`格式的一块移动硬盘作为外置尿袋。由于苹果使用的是`Apfs`格式的硬盘方式，现在网上使用的一些开源方案我测试并未成功，所以这边使用了[NTFS for Mac](https://www.paragon-software.com/home/ntfs-mac/#)进行硬盘的挂载，但是`AppStore`中的“大于1G软件下载到外置的硬盘中”的选项因为我挂载的还是`ntfs`格式的方法，无法识别到。同时网络上在监控器中寻找安装包的位置方法我也未曾成功，所以暂时搁置了。  
微信等聊天软件的数据占用往往会很大，我就一直没有安装，直到我昨天看到一篇文章[给你的Macbook硬盘省点空间：将微信等APP彻底安装到移动硬盘](https://dysonfreeman.netlify.app/posts/%E5%B0%86app%E5%AE%89%E8%A3%85%E5%9C%A8%E7%A7%BB%E5%8A%A8%E7%A1%AC%E7%9B%98%E4%B8%8A/)，我动了下载微信的心思，同时一个开源软件[chatlog](https://github.com/sjzar/chatlog)坚定了我的想法。这是一个可以从微信或者QQ中获取聊天数据，并且支持MCP协议，可以和市面上的AI助手结合来搭建自己的消息库。  

## 移植微信数据  
```bash  
mv -r ~/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9 /Volume/path/to/your/wechatdata  
ln -s /Volume/path/to/your/wechatdata/2.0b4.0.9 ~/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9  
sudo codesign --sign - --force --deep /Applications/WeChat.app
```

## 安装 chatlog  
```bash  
brew install go 
brew install llvm  
go install github.com/sjzar/chatlog@latest
```
上述分别是安装`go`，安装`lldb`，安装`chatlog`。  

## 关闭SIP  
```bash  
# 1. 进入恢复模式
  Apple Intel Mac: 关机后，按住 Command + R 键开机，直到出现苹果标志和进度条。
  Apple Silicon Mac: 关机后，按住开机键不松开，直到出现苹果标志和进度条。
# 2. 打开终端
  选项 - 实用工具 - 终端
# 3. 关闭 SIP
  输入以下命令关闭 SIP：
  csrutil disable
# 4. 重启系统
```
仅获取数据密钥步骤需要关闭 SIP；获取数据密钥后即可重新打开 SIP，不影响解密数据和 HTTP 服务的运行。  

## 配置 chatlog  
```bash  
 /Users/dowmars/go/bin/chatlog
```
使用以上指令开启`go`安装的`chatlog`。  

{{< figure src="/images/posts/2025_04_08-chatlog_useage/chatlog.png" alt="test" title="chatlog界面" caption="" align="center" >}}

依次执行对应的命令即可最后开启HTTP服务供外部访问，端口为`http://127.0.0.1:5030`。  

## 接入 MCP  
支持 MCP SSE 协议，启动 HTTP 服务后，通过 SSE Endpoint 访问服务：  
提供了 4 个 tool 用于与 AI 助手集成：

-   `chatlog`: 查询聊天记录
-   `query_contact`: 查询联系人
-   `query_chat_room`: 查询群聊
-   `query_recent_chat`: 查询最近会话

以[CherryStudio](https://github.com/CherryHQ/cherry-studio)为例：  
1. 设置 - MCP服务器 - 添加服务器  
2. 名称`自定义` - 类型`see` - URL`http://127.0.0.1:5030/sse`  
3. 右上角保存 - 开启按键 

{{< figure src="/images/posts/2025_04_08-chatlog_useage/cherrystudio_mcp.png" alt="test" title="cherrystudio_mcp" caption="" align="center" >}}

即可使用了。  

{{< figure src="/images/posts/2025_04_08-chatlog_useage/useage.png" alt="test" title="使用事例" caption="" align="center" >}}



