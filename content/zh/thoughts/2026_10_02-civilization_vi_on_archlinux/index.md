---
title: "Arch Linux 上的《文明 VI》：窗口不出现，按钮也点不动"
date: 2026-10-02T08:31:07+08:00
draft: false
description: "在 Hyprland 下运行《文明 VI》原生版时，先遇到被遮挡的报错窗，随后遇到游戏按钮无法点击；记录这次有效的 Steam 启动选项。"
---

今天在 Arch Linux 的 Hyprland 会话里启动《文明 VI》原生版，Steam 一直显示游戏正在运行，桌面上却没有游戏画面。查窗口时才发现，一个很小的报错窗被其他窗口挡住了，内容是 `An unrecoverable error has occurred, and Civilization VI cannot continue.`。在 Steam 启动选项里强制 `SDL_VIDEODRIVER=x11` 后，游戏终于能显示。[ArchWiki 的《文明 VI》排障记录](https://wiki.archlinux.org/title/Steam/Game-specific_troubleshooting)也提到这个报错和相同的启动参数。

但能进游戏还不等于能玩。版权说明页的 Continue 按钮看得见却点不动。我试过把游戏分辨率从 1368×768 调到虚拟显示器的 2560×1440，也试过把 SUNSHINE 显示器的缩放从 160% 临时改成 100%，按钮依然没有反应。临时越过版权页后，后面的 2K 条款页按钮同样点不动。至少在这次排查中，单独调整分辨率或缩放都没有解决鼠标输入的问题。

最后把 Steam 的《文明 VI》启动选项设为：

```text
gamescope -W 2560 -H 1440 -w 2560 -h 1440 -f -- env SDL_VIDEODRIVER=x11 %command%
```

重新启动后，2K 条款页收到了点击，主菜单里的“单人游戏”也能正常打开。这是我在 2560×1440 虚拟显示器上验证过的设置；换成其他屏幕时，命令里的宽高需要按实际分辨率调整。[Gamescope 文档](https://github.com/ValveSoftware/gamescope/blob/master/README.md)说明了这种 Steam 启动方式。现有结果能确认 Gamescope 解决了这次按钮无法点击的问题，但还不能确定原本的鼠标事件具体在哪一层发生了偏差。
