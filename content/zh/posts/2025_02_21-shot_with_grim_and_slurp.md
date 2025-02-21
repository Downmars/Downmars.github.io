---
title: "使用grim和slurp在Wayland环境下进行屏幕截图"
date: 2025-02-21T20:18:25+08:00
lastmod: 2025-02-21T20:18:25+08:00
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


本指南将帮助你在基于 Wayland 的系统（如使用 `sway` 窗口管理器的 Arch Linux 或 Parabola GNU/Linux-libre）上，配置并使用 `grim` 和 `slurp` 进行屏幕截图。配置将支持区域截图与全屏截图，并集成 `waybar` 显示截图通知。此外，截图将自动复制到剪贴板，方便你快速粘贴到其他应用中。通过快捷键，可以方便地启动截图操作，同时避免与屏幕录制快捷键的冲突。

## 安装所需软件

在基于 Arch 的发行版上，使用以下命令安装所需的软件：

```bash
sudo pacman -S grim slurp waybar wl-clipboard jq libnotify
```

- **grim**：Wayland 屏幕截图工具，支持区域截图和全屏截图。
- **slurp**：Wayland 区域选择工具，用于与 `grim` 结合选择截图区域。
- **waybar**：Wayland 状态栏，用于显示截图通知。
- **wl-clipboard**：Wayland 下的剪贴板工具，提供 `wl-copy` 和 `wl-paste` 命令。
- **jq**：命令行 JSON 处理工具，用于解析 `waybar` 配置。
- **libnotify**：发送桌面通知的工具。



## 创建统一的截图脚本

为了简化操作，我们将合并区域截图和全屏截图脚本为一个统一的脚本 `screenshot.sh`。该脚本将根据传递的参数执行不同的截图模式，并自动将截图复制到剪贴板，同时发送桌面通知。为了避免与屏幕录制快捷键的冲突，我们将选择不同的快捷键组合。

### 脚本内容

将以下内容保存为 `~/bin/screenshot.sh` 并赋予执行权限：

```bash
#!/bin/bash

# 屏幕截图脚本：screenshot.sh
# 支持区域截图和全屏截图
# 保存截图、复制到剪贴板并发送通知

# 配置截图保存目录
SCREENSHOT_DIR="$HOME/Pictures/Screenshots"
mkdir -p "$SCREENSHOT_DIR"

# 生成时间戳
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 定义截图文件路径
FILE="$SCREENSHOT_DIR/screenshot_$TIMESTAMP.png"

# 判断截图模式
if [ "$1" == "full" ]; then
    MODE="全屏截图"
    # 使用 grim 进行全屏截图
    grim "$FILE"
else
    MODE="区域截图"
    # 使用 slurp 选择截图区域并使用 grim 进行截图
    grim -g "$(slurp)" "$FILE"
fi

# 检查截图是否成功
if [ $? -eq 0 ]; then
    # 复制截图到剪贴板
    wl-copy < "$FILE"

    # 发送截图完成通知
    notify-send "截图完成" "已保存至: $FILE 并已复制到剪贴板"
else
    notify-send "截图失败" "未能成功捕获屏幕"
fi

exit 0
```

### 赋予执行权限

确保脚本具有执行权限：

```bash
chmod +x ~/bin/screenshot.sh
```

### 脚本说明

- **功能**：
  - **区域截图**：不传递参数时，使用 `slurp` 选择截图区域。
  - **全屏截图**：传递 `full` 参数时，直接截取整个屏幕。
- **截图过程**：
  - 使用 `grim` 进行截图。
  - 使用 `wl-copy` 将截图复制到剪贴板。
  - 使用 `notify-send` 发送桌面通知，显示截图保存路径和状态。
- **保存路径**：
  - 截图将保存至 `~/Pictures/Screenshots/` 目录，文件名格式为 `screenshot_YYYYMMDD_HHMMSS.png`。



## 配置 waybar

由于截图完成后通过 `notify-send` 发送桌面通知，因此不需要在 `waybar` 上额外显示截图通知。然而，如果你希望在 `waybar` 上显示截图缩略图或其他相关信息，可以创建一个自定义模块。以下示例仅保留空白输出，因为主要通知由 `notify-send` 处理。

### 创建自定义模块脚本（可选）

创建 `screenshot_notification.sh` 脚本，用于检测截图是否完成并显示通知。

将以下内容保存为 `~/.config/waybar/screenshot_notification.sh` 并赋予执行权限：

```bash
#!/bin/bash

# 截图通知脚本：screenshot_notification.sh
# 当前示例不在 waybar 上显示任何内容
# 如果需要显示更多信息，可以在此处扩展

echo "{\"text\": \"\", \"class\": \"\"}"
```

### 赋予执行权限

```bash
chmod +x ~/.config/waybar/screenshot_notification.sh
```

### 更新 waybar 配置

编辑 `~/.config/waybar/config`，添加自定义模块 `screenshot_notification`。假设你希望将其添加到 `modules-right` 部分。

```json
{
    "layer": "top",
    "position": "top",
    "modules-right": [
        "screenshot_notification",
        /* 其他模块 */
    ],
    "custom/screenshot_notification": {
        "exec": "~/.config/waybar/screenshot_notification.sh",
        "interval": 60,
        "return-type": "json",
        "format": "{}",
        "max-length": 100
    },
    /* 其他配置 */
}
```

### 配置 waybar 样式（可选）

编辑 `~/.config/waybar/style.css`，为截图通知模块添加样式（当前示例不需要特定样式，因为通知由 `notify-send` 处理）。

```css
/* 示例：为截图标识添加样式 */
#screenshot_notification {
    /* 可根据需要自定义样式 */
}
```

### 重新加载 waybar

保存配置后，重新加载 `waybar` 以应用更改：

```bash
pkill waybar
waybar &
```

> **注意**：由于截图通知通过 `notify-send` 直接发送到桌面环境的通知系统，因此 `waybar` 中的 `screenshot_notification` 模块当前未执行任何功能。你可以根据需求扩展该模块，例如显示最近的截图缩略图或其他相关信息。



## 配置 sway 快捷键

为了避免与屏幕录制快捷键冲突，我们将为截图功能选择不同的快捷键组合。以下是推荐的快捷键：

- **区域截图**：`$mod+Ctrl+Shift+A`
- **全屏截图**：`$mod+Ctrl+Shift+F`

### 编辑 sway 配置文件

打开 sway 配置文件，通常位于 `~/.config/sway/config`：

```bash
nano ~/.config/sway/config
```

### 添加快捷键绑定

在配置文件中添加以下内容：

```bash
# 区域截图
bindsym $mod+Ctrl+Shift+A exec ~/bin/screenshot.sh

# 全屏截图
bindsym $mod+Ctrl+Shift+F exec ~/bin/screenshot.sh full
```

**说明**：

- **区域截图**：按下 `$mod+Ctrl+Shift+A` 启动区域截图。
- **全屏截图**：按下 `$mod+Ctrl+Shift+F` 启动全屏截图。

### 重新加载 sway 配置

保存配置文件后，重新加载 sway 配置：

```bash
swaymsg reload
```



## 使用方法

### 区域截图

1. **按下快捷键**：按下 `$mod+Ctrl+Shift+A`。
2. **选择截图区域**：
   - 鼠标将变为十字形，拖动选择要截图的区域。
   - 松开鼠标按钮后，`grim` 将自动保存截图。
3. **截图完成**：
   - 截图将保存至 `~/Pictures/Screenshots/` 目录，文件名格式为 `screenshot_YYYYMMDD_HHMMSS.png`。
   - 截图将自动复制到剪贴板。
   - 桌面通知将显示截图完成的信息。

### 全屏截图

1. **按下快捷键**：按下 `$mod+Ctrl+Shift+F`。
2. **截图开始**：
   - `grim` 将自动截取整个屏幕，并保存截图。
3. **截图完成**：
   - 截图将保存至 `~/Pictures/Screenshots/` 目录，文件名格式为 `screenshot_YYYYMMDD_HHMMSS.png`。
   - 截图将自动复制到剪贴板。
   - 桌面通知将显示截图完成的信息。

### 粘贴截图

截图已复制到剪贴板，你可以在任何支持粘贴图像的应用中（如聊天工具、文档编辑器等）直接使用 `Ctrl+V` 或右键粘贴来插入截图。



## 管理截图文件

截图文件可能会逐渐占用大量存储空间。以下是一些管理截图文件的方法：

### 自动整理截图文件

可以使用脚本或定时任务（如 `cron` 或 `systemd` 服务）来定期整理截图文件。例如，将旧的截图移动到备份目录或删除超过一定天数的截图。

#### 示例：使用 `cron` 每周清理 30 天前的截图

1. **打开 crontab 编辑器**：

    ```bash
    crontab -e
    ```

2. **添加以下行**：

    ```cron
    0 3 * * 0 mkdir -p ~/Pictures/Screenshots/Backup && find ~/Pictures/Screenshots -type f -name "*.png" -mtime +30 -exec mv {} ~/Pictures/Screenshots/Backup/ \;
    ```

    **说明**：
    - 每周日凌晨 3 点执行。
    - 创建 `Backup` 目录（如果不存在）。
    - 将 30 天前的 `.png` 文件移动到 `Backup` 目录。

### 手动备份

将截图文件手动复制到外部存储设备或云存储服务，以释放本地存储空间。



## 常见问题与解决方法

### 截图无保存或文件为空

**原因**：`grim` 或 `slurp` 未正确执行，可能由于权限问题或选择区域失败。

**解决方法**：
- 确保脚本具有执行权限：

  ```bash
  chmod +x ~/bin/screenshot.sh
  ```

- 运行脚本时检查是否有错误输出：

  ```bash
  ~/bin/screenshot.sh
  ~/bin/screenshot.sh full
  ```

- 确保 `slurp` 能正常选择区域：

  ```bash
  slurp
  ```

  如果 `slurp` 无法选择区域，检查 Wayland 会话权限或重新安装 `slurp`。

### 截图保存路径错误

**原因**：脚本中配置的截图保存目录不存在或路径错误。

**解决方法**：
- 确保截图保存目录存在：

  ```bash
  mkdir -p ~/Pictures/Screenshots
  ```

- 检查脚本中的 `SCREENSHOT_DIR` 变量是否正确设置。

### 截图已复制到剪贴板但无法粘贴

**原因**：`wl-copy` 未正确执行或剪贴板工具未运行。

**解决方法**：
- 确保 `wl-clipboard` 已正确安装：

  ```bash
  sudo pacman -S wl-clipboard
  ```

- 测试 `wl-copy` 是否正常工作：

  ```bash
  echo "Test" | wl-copy
  wl-paste
  ```

  如果输出为 `Test`，则 `wl-copy` 正常工作。

- 确保在 Wayland 会话中运行剪贴板工具。如果使用其他剪贴板管理器，确保它们与 `wl-copy` 兼容。

### 桌面通知未显示

**原因**：`notify-send` 未正确安装或通知系统未配置。

**解决方法**：
- 确保 `libnotify` 已安装：

  ```bash
  sudo pacman -S libnotify
  ```

- 测试 `notify-send` 是否正常工作：

  ```bash
  notify-send "测试通知" "如果你能看到这条消息，notify-send 正常工作。"
  ```

- 检查通知守护进程是否在运行（如 `mako`、`dunst` 等）。

### 快捷键无响应

**原因**：sway 快捷键配置错误或脚本路径不正确。

**解决方法**：
- 确保快捷键绑定正确指向脚本：

  ```bash
  bindsym $mod+Ctrl+Shift+A exec ~/bin/screenshot.sh
  bindsym $mod+Ctrl+Shift+F exec ~/bin/screenshot.sh full
  ```

- 确保脚本路径正确，并且脚本具有执行权限。
- 重新加载 sway 配置：

  ```bash
  swaymsg reload
  ```

### `slurp` 选择区域失败

**原因**：Wayland 会话权限不足或 `slurp` 安装不正确。

**解决方法**：
- 确保 `slurp` 已正确安装：

  ```bash
  sudo pacman -S slurp
  ```

- 确保当前用户有权限访问 Wayland 会话。
- 尝试单独运行 `slurp`：

  ```bash
  slurp
  ```

### 脚本执行错误

**原因**：脚本中存在语法错误或变量未正确引用。

**解决方法**：
- 检查脚本是否正确复制，没有遗漏或多余的字符。
- 确保使用的是正确的 shell（`#!/bin/bash`）。
- 查看脚本执行时的错误输出，进行调试。



## 参考资源

- [grim GitHub 仓库](https://github.com/emersion/grim)
- [slurp GitHub 仓库](https://github.com/emersion/slurp)
- [sway 窗口管理器文档](https://swaywm.org/docs/)
- [waybar GitHub 仓库](https://github.com/Alexays/Waybar)
- [wl-clipboard GitHub 仓库](https://github.com/bugaevc/wl-clipboard)
- [libnotify 官方文档](https://developer.gnome.org/libnotify/stable/)
- [Arch Linux wiki: Screenshot](https://wiki.archlinux.org/title/Screenshot)



## 小结

通过本指南，你已成功配置了 `grim` 和 `slurp` 以在 Wayland 环境下进行高效的屏幕截图。结合 `waybar` 的截图通知显示、快捷键的启动与停止功能，以及自动复制到剪贴板的设置，截图过程变得更加便捷与直观。选择不同的快捷键组合，避免了与屏幕录制快捷键的冲突。根据个人需求，可以进一步优化截图参数，提升截图体验和图像质量。

如果在配置过程中遇到任何问题或有进一步的优化需求，欢迎参考相关工具的官方文档或寻求社区支持。
