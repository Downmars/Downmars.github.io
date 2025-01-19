---
title: "Hugo博客搭建_基础 😊"
date: 2025-01-19T20:05:13+08:00
lastmod: 2025-01-19T20:05:13+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: ["Hugo", "Test"]
categories: [""]

# 描述
description: "" # SEO 搜索优化
summary: ""    # 列表页展示的简短描述

# 可选：权重（用于置顶文章）
weight: null

# 可选：封面图片
cover:
    image: ""
    alt: ""
    caption: ""
---
---
# 前言

以往总是东一笔西一笔写自己的一些内容，也尝试过用MKDOCS来搭建自己的知识库，前段时间看到很多人用Hugo搭建博客，于是也想尝试一下，在这里记录一下搭建与配置的过程。

## 安装环境
我最近也在将日常的工作娱乐环境转向linux，所以说选择了archlinux作为我的安装环境，之后应该会出一系列我的archlinux的配置。<br>

本文涉及环境以及工具的网站：
- [Hugo](https://gohugo.io/)
- [Github](https://github.com)

# Hugo安装及基础配置
## Hugo安装
我是用的是archlinux，所以直接用pacman安装：
```bash
sudo pacman -S hugo
```

安装完之后，可以通过以下命令查看版本：
```bash
hugo version
```
## Hugo初始化
通过上述命令安装hugo程序后，可以在选定的目录下通过`hugo new site $YOUR_SITE_NAME`创建你的博客目录：

> 如果不特殊申明，本文接下来的命令行操作都是在`$YOUR_SITE_NAME`目录下进行的。
```bash
myArch% hugo new site DHugo                      
Congratulations! Your new Hugo site was created in /home/dm/Test/DHugo.

Just a few more steps...

1. Change the current directory to /home/dm/Test/DHugo.
2. Create or install a theme:
   - Create a new theme with the command "hugo new theme <THEMENAME>"
   - Or, install a theme from https://themes.gohugo.io/
3. Edit hugo.toml, setting the "theme" property to the theme name.
4. Create new content with the command "hugo new content <SECTIONNAME>/<FILENAME>.<FORMAT>".
5. Start the embedded web server with the command "hugo server --buildDrafts".

See documentation at https://gohugo.io/.
```
可以使用`tree`指令对我们创建的博客目录进行查看
```bash
myArch% tree                            
.
├── archetypes
│   └── default.md # 博客模板文件
├── assets # 存放静态资源文件
├── content # 存放博客文章
├── data # 存放数据文件  
├── hugo.toml  # 博客配置文件，可以修改为hugo.yaml，支持JSON、YAML、TOML三种不同配置文件
├── i18n  # 多语言配置
├── layouts  # 存放布局配置文件
├── static  # 存放静态资源文件，图片、css、js等
└── themes  # 存放不同主题

9 directories, 2 files
```

## 配置主题
我们在此处的主题选择[PaperMod](https://github.com/adityatelange/hugo-PaperMod)，这是一个Star比较高的主题，简约的并且功能较为丰富。当然，你也可以自己选择主题：
- 官方的主题网址：[https://themes.gohugo.io/](https://themes.gohugo.io/)

在此处，官方推荐将我们选择的主题`fork`一个到自己的账户，并使用`git submodule`进行仓库的链接，这样以便后续主题的单独维护，避免当自己对主题进行修改之后，后续版本管理和更新会与原先主题产生冲突。

当然了，我并没有`fork`一个主题并进行修改，我们通常是将`themes/$THEME/`对应目录下的文件拷贝一份到我们的项目目录`$YOUR_SITE_NAME`中对应的文件夹下，相对目录需要相同，以便我们复制的文件可以覆盖他的默认配置。

```bash
git init
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

之后在hugo.yaml中添加新的一行启用新主题：

```yaml
theme = "PaperMod"
```

## 新建博客

我们可以使用`hugo new path/to/your.md`来创建你的第一个博客啦！

```bash
hugo new posts/test.md
```
```markdown
---
title: "Test"
date: 2022-10-21T19:00:43+08:00
draft: true
---
```
这个命令会在`content`目录下创建`posts`目录，并在生成`posts/test.md`，博文使用`Markdown`语法完成，我们用默认模板生成的博客是草稿状态，可以将`draft`设置为`false`，这样文章就可以发表了。

我们接下来就可以使用` hugo server --disableFastRender `进行本地预览了，通过访问[ http://localhost:1313/]( http://localhost:1313/)可以在本地预览我们创建的博客了。


