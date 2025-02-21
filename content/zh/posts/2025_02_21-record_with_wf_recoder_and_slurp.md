---
title: "使用wf-recoder和slurp在Wayland环境下进行高效录制"
date: 2025-02-21T20:11:04+08:00
lastmod: 2025-02-21T20:11:04+08:00
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

本指南将帮助你在基于 Wayland 的系统（如使用 sway 窗口管理器的 Arch Linux 或 Parabola GNU/Linux-libre）上，配置并使用 `wf-recorder` 和 `slurp` 进行屏幕录制。配置将支持区域录制与全屏录制，并包含系统音频与麦克风音频的录制。录制过程中将在 `waybar` 上显示录制标识和时长，结束录制后将通过通知栏显示录制信息。此外，通过重复按下录制快捷键，可以实现录制的启动与停止。

## 安装所需软件

在基于 Arch 的发行版上，使用以下命令安装 `wf-recorder`、`slurp`、`ffmpeg`、`waybar` 以及其他必要工具：

```bash
sudo pacman -S wf-recorder slurp ffmpeg waybar jq libnotify
```

- **wf-recorder**：Wayland 屏幕录制工具。
- **slurp**：Wayland 区域选择工具。
- **ffmpeg**：多媒体处理工具，用于录制音频和合并视频音频。
- **waybar**：Wayland 状态栏，用于显示录制状态。
- **jq**：命令行 JSON 处理工具，用于解析 waybar 配置。
- **libnotify**：发送桌面通知的工具。

## 创建录制脚本

创建一个统一的录制脚本 `record_toggle.sh`，用于启动和停止录制。此脚本将处理区域录制与全屏录制，录制系统音频与麦克风音频，并与 `waybar` 和通知集成。

### 脚本内容

将以下内容保存为 `~/bin/record_toggle.sh` 并赋予执行权限：

```bash
#!/bin/bash

# 录制脚本：record_toggle.sh
# 支持启动和停止录制
# 录制模式：区域录制或全屏录制
# 录制系统音频与麦克风音频
# 集成 waybar 标识和录制时长显示，结束后发送通知

# 配置
RECORD_DIR="$HOME/Videos"
mkdir -p "$RECORD_DIR"

# 状态文件路径
RECORDING_FLAG="/tmp/recording_flag"
STATUS_FILE="/tmp/recording_status"
STOP_FLAG="/tmp/stop_recording_flag"

# 检查是否正在录制
if [ -f "$RECORDING_FLAG" ]; then
    # 正在录制，执行停止录制
    echo "停止录制中..."
    
    # 发送停止标识
    touch "$STOP_FLAG"
    
    exit 0
else
    # 未录制，执行启动录制
    # 检查是否传递了录制模式参数
    if [ "$1" == "full" ]; then
        RECORD_GEOMETRY=""
        MODE="全屏录制"
    else
        RECORD_GEOMETRY="-g \"$(slurp)\""
        MODE="区域录制"
    fi
    
    # 生成时间戳
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    # 定义文件路径
    VIDEO_FILE="$RECORD_DIR/recording_$TIMESTAMP.mp4"
    AUDIO_FILE="$RECORD_DIR/recording_$TIMESTAMP-audio.wav"
    FINAL_FILE="$RECORD_DIR/recording_$TIMESTAMP-final.mp4"
    
    # 创建录制标识
    echo "$MODE" > "$RECORDING_FLAG"
    
    # 启动系统音频录制（默认音频设备）
    ffmpeg -f pulse -i default -c:a pcm_s16le "$AUDIO_FILE" &
    FFMPEG_PID=$!
    
    # 启动视频录制
    if [ -z "$RECORD_GEOMETRY" ]; then
        wf-recorder -f "$VIDEO_FILE" &
    else
        wf-recorder -g "$(slurp)" -f "$VIDEO_FILE" &
    fi
    WF_PID=$!
    
    # 启动计时器，记录录制时长
    SECONDS=0
    while kill -0 $WF_PID 2>/dev/null; do
        sleep 1
        SECONDS=$((SECONDS + 1))
        # 更新状态文件以供 waybar 显示
        echo "$SECONDS" > "$STATUS_FILE"
        
        # 检查是否存在停止标识文件
        if [ -f "$STOP_FLAG" ]; then
            echo "停止录制标识已检测到。"
            kill $WF_PID
            kill $FFMPEG_PID
            rm "$STOP_FLAG"
            break
        fi
    done &
    TIMER_PID=$!
    
    # 等待录制进程结束
    wait $WF_PID
    kill $FFMPEG_PID 2>/dev/null
    kill $TIMER_PID 2>/dev/null
    
    # 合并视频和音频
    ffmpeg -i "$VIDEO_FILE" -i "$AUDIO_FILE" -c:v copy -c:a aac "$FINAL_FILE"
    
    # 清理临时文件
    rm "$VIDEO_FILE" "$AUDIO_FILE"
    rm "$RECORDING_FLAG"
    rm "$STATUS_FILE"
    
    # 发送录制结束通知
    DURATION=$(printf '%02d:%02d:%02d' $((SECONDS / 3600)) $(( (SECONDS % 3600) / 60 )) $((SECONDS % 60)))
    notify-send "录制结束" "保存至: $FINAL_FILE\n时长: $DURATION"
    
    exit 0
fi
```

### 赋予执行权限

```bash
chmod +x ~/bin/record_toggle.sh
```

### 脚本说明

- **启动录制**：
  - **区域录制**：不传递参数，使用 `slurp` 选择录制区域。
  - **全屏录制**：传递 `full` 参数，不使用 `slurp`，直接录制全屏。
- **停止录制**：
  - 脚本检测到录制标识文件 `recording_flag` 后，通过创建 `stop_recording_flag` 文件通知录制进程停止。
- **录制过程**：
  - 使用 `wf-recorder` 录制视频。
  - 使用 `ffmpeg` 录制音频（系统音频与麦克风）。
  - 计时器记录录制时长，并更新 `status_file` 供 `waybar` 显示。
- **结束录制**：
  - 合并视频和音频文件。
  - 清理临时文件。
  - 发送录制结束通知。

## 配置 waybar

在 `waybar` 上显示录制状态和时长，需要创建一个自定义模块。

### 创建自定义模块脚本

创建 `recording.sh` 脚本，用于检测录制状态并输出 JSON 格式的数据供 `waybar` 使用。

将以下内容保存为 `~/.config/waybar/recording.sh` 并赋予执行权限：

```bash
#!/bin/bash

STATUS_FILE="/tmp/recording_status"
RECORDING_FLAG="/tmp/recording_flag"

if [ -f "$RECORDING_FLAG" ]; then
    if [ -f "$STATUS_FILE" ]; then
        SECONDS=$(cat "$STATUS_FILE")
        SECONDS=$((SECONDS / 2)) # i donot know why time is two than true.
        HOURS=$((SECONDS / 3600))
        MINUTES=$(( (SECONDS % 3600) / 60 ))
        SECS=$((SECONDS % 60))
        TIME_FORMAT=$(printf "%02d:%02d:%02d" $HOURS $MINUTES $SECS)
    else
        TIME_FORMAT="00:00:00"
    fi

    MODE=$(cat "$RECORDING_FLAG")
    if [ "$MODE" == "全屏录制" ]; then
        MODE_ICON=""  # 全屏录制图标
    else
        MODE_ICON=""  # 区域录制图标
    fi

    echo "{\"text\": \"$MODE_ICON Recording $TIME_FORMAT\", \"class\": \"recording\"}"
else
    echo "{\"text\": \"\", \"class\": \"\"}"
fi
```

### 赋予执行权限

```bash
chmod +x ~/.config/waybar/recording.sh
```

### 更新 waybar 配置

编辑 `~/.config/waybar/config`，添加自定义模块 `recording`：

```json
{
    "layer": "top",
    "position": "top",
    "modules-left": ["recording", /* 其他模块 */],
    "custom/recording": {
        "exec": "~/.config/waybar/recording.sh",
        "interval": 1,
        "return-type": "json",
        "format": "{}",
        "max-length": 100
    },
    /* 其他配置 */
}
```

### 配置 waybar 样式

编辑 `~/.config/waybar/style.css`，为录制模块添加样式：

```css
#recording {
    color: #FF0000; /* 红色表示录制中 */
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
}
```

### 重新加载 waybar

保存配置后，重新加载 `waybar` 以应用更改：

```bash
pkill waybar
waybar &
```

## 配置 sway 快捷键

配置 sway 快捷键，使录制脚本可以通过按键启动与停止。

### 编辑 sway 配置文件

打开 sway 配置文件，通常位于 `~/.config/sway/config`：

```bash
nano ~/.config/sway/config
```

### 添加快捷键绑定

在配置文件中添加以下内容：

```bash
# 启动/停止区域录制
bindsym $mod+Shift+R exec ~/bin/record_toggle.sh

# 启动/停止全屏录制
bindsym $mod+Shift+F exec ~/bin/record_toggle.sh full
```

**说明**：

- **区域录制**：按下 `$mod+Shift+R` 启动或停止区域录制。
- **全屏录制**：按下 `$mod+Shift+F` 启动或停止全屏录制。

保存并关闭配置文件后，重新加载 sway 配置：

```bash
swaymsg reload
```

## 使用方法

### 启动录制

- **区域录制**：
  1. 按下快捷键 `$mod+Shift+R`。
  2. 使用鼠标选择要录制的区域（由 `slurp` 提供）。
  3. 录制开始，`waybar` 上将显示录制标识和时长。

- **全屏录制**：
  1. 按下快捷键 `$mod+Shift+F`。
  2. 录制开始，`waybar` 上将显示录制标识和时长。

### 停止录制

- 再次按下相同的快捷键：
  - **区域录制**：按下 `$mod+Shift+R` 停止录制。
  - **全屏录制**：按下 `$mod+Shift+F` 停止录制。

录制结束后：
- `waybar` 上的录制标识将消失。
- 桌面通知将显示录制文件的保存路径和时长。

## 管理录制文件

录制的视频文件可能会占用大量存储空间。建议定期清理或备份录制文件。

### 自动清理旧录制文件

可以使用 `cron` 或 `systemd` 定时任务，定期将旧录制文件移动到备份目录。例如，使用 `cron` 每周清理 7 天前的录制文件：

1. 打开 crontab 编辑器：

    ```bash
    crontab -e
    ```

2. 添加以下行：

    ```cron
    0 2 * * 0 mkdir -p ~/Videos/Backup && find ~/Videos -type f -name "*.mp4" -mtime +7 -exec mv {} ~/Videos/Backup/ \;
    ```

    **说明**：
    - 每周日凌晨 2 点执行。
    - 创建 `Backup` 目录（如果不存在）。
    - 将 7 天前的 `.mp4` 文件移动到 `Backup` 目录。

### 手动备份

将录制文件备份到外部存储设备或云存储服务，以释放本地存储空间。

## 常见问题与解决方法

### 录制视频无声音

**原因**：`wf-recorder` 默认不录制音频，需使用 `ffmpeg` 单独录制音频。

**解决方法**：
- 确保 `ffmpeg` 正常录制音频，并在录制结束后正确合并视频与音频。
- 检查 PulseAudio 或 PipeWire 配置，确保音频设备正确。

### 录制过程中卡顿或性能下降

**解决方法**：
- **优化编码器设置**：在脚本中使用更快的编码预设，如 `--codec-preset fast`。
- **降低分辨率或帧率**：选择较低的录制分辨率或帧率。
- **关闭不必要的后台应用**：释放系统资源，提高录制性能。

### 录制文件无法播放或损坏

**原因**：录制过程中意外中断或编码器不兼容。

**解决方法**：
- 使用 `ffmpeg` 修复损坏的视频文件：

    ```bash
    ffmpeg -i corrupted.mp4 -c copy fixed.mp4
    ```

- 确保录制过程中系统稳定，避免中断录制进程。

### 选择区域后录制失败

**解决方法**：
- 确保 `slurp` 正常工作，尝试单独运行 `slurp` 测试区域选择。
- 检查权限问题，确保当前用户有权限访问 Wayland 会话和录制屏幕。

### waybar 上不显示录制标识

**解决方法**：
- 确保 `recording.sh` 脚本具有执行权限。
- 检查 `waybar` 配置文件是否正确引用自定义模块。
- 查看 `waybar` 日志，排查脚本执行错误。

## 参考资源

- [wf-recorder GitHub 仓库](https://github.com/davatorium/wf-recorder)
- [slurp GitHub 仓库](https://github.com/emersion/slurp)
- [sway 窗口管理器文档](https://swaywm.org/docs/)
- [PipeWire 官方文档](https://pipewire.org/)
- [FFmpeg 官方文档](https://ffmpeg.org/documentation.html)
- [waybar GitHub 仓库](https://github.com/Alexays/Waybar)
- [notify-send 手册](https://linux.die.net/man/1/notify-send)



## 小结

通过本指南，你已成功配置了 `wf-recorder` 和 `slurp` 以在 Wayland 环境下进行高效的屏幕录制。结合 `waybar` 的录制状态显示和快捷键的启动与停止功能，录制过程变得更加便捷与直观。根据个人需求，可以进一步优化录制参数，提升录制体验和视频质量。


