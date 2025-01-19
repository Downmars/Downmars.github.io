---
title: "Test"
date: 2025-01-19T13:14:54+08:00
lastmod: 2025-01-19T13:14:54+08:00
draft: false

# 作者
author: "Downmars"

# 分类和标签
tags: [""]
categories: [""]

# 描述
description: "" # SEO 搜索优化
summary: ""    # 列表页展示的简短描述

# 可选：权重（用于置顶文章）
# weight: 1

# 可选：封面图片
# cover:
#     image: ""
#     alt: ""
#     caption: ""
---


# How to make a mkdocs?
test
> Assume you have already set up your Github homepage.


> [Mkdocs](https://www.mkdocs.org/)

要使用 MkDocs 创建并部署静态网站到 GitHub Pages（即 `github.io`），并利用您提供的 `ci.yml` 配置 GitHub Actions 进行持续集成和部署，您可以按照以下步骤操作：

## 步骤 1：安装 MkDocs 和相关主题

首先，确保您的本地环境已安装 Python 和 `pip`。然后，安装 MkDocs 及所需的主题和插件。

```bash
pip install mkdocs-material mkdocs-rtd-dropdown
```

## 步骤 2：创建 MkDocs 项目

在您的项目目录中，初始化一个新的 MkDocs 项目：

```bash
mkdocs new my-project
cd my-project
```

这将创建一个基本的 MkDocs 目录结构。

## 步骤 3：配置 `mkdocs.yml`

编辑生成的 `mkdocs.yml` 文件，配置主题和插件。例如：

```yaml
site_name: My Project Documentation
theme:
  name: 'material'
  palette:
    primary: 'blue'
    accent: 'light blue'
plugins:
  - search
  - rtd-dropdown
```

确保根据您的需求调整 `site_name`、主题和插件配置。

## 步骤 4：编写文档内容

在 `docs/` 目录下编辑或添加 Markdown 文件，以构建您的文档内容。

## 步骤 5：初始化 Git 仓库并推送到 GitHub

如果您还没有 Git 仓库，请初始化一个并推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

请将 `your-username` 和 `your-repo` 替换为您的 GitHub 用户名和仓库名称。

## 步骤 6：创建 GitHub Actions 工作流

在您的项目根目录下，创建 `.github/workflows/ci.yml` 文件，并将以下内容粘贴进去：

```yaml
name: ci
on:
  push:
    branches:
      - master 
      - main
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure Git Credentials
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
      - uses: actions/setup-python@v5
        with:
          python-version: '3.x'
      - run: echo "cache_id=$(date --utc '+%V')" >> $GITHUB_ENV 
      - uses: actions/cache@v4
        with:
          key: mkdocs-material-${{ env.cache_id }}
          path: .cache
          restore-keys: |
            mkdocs-material-
      - run: pip install mkdocs-material 
      - run: pip install mkdocs-rtd-dropdown
      - run: mkdocs gh-deploy --force
```

### 工作流说明：

1. **触发条件**：当推送到 `master` 或 `main` 分支时触发。
2. **权限**：授予 `contents` 写权限以便进行部署。
3. **作业配置**：
   - **环境**：使用最新的 Ubuntu 运行环境。
   - **步骤**：
     - **检出代码**：使用 `actions/checkout@v4` 检出仓库代码。
     - **配置 Git 凭证**：设置 Git 用户名和邮箱，以便 GitHub Actions 可以提交更改。
     - **设置 Python 环境**：使用 `actions/setup-python@v5` 设置 Python 3 环境。
     - **设置缓存**：通过当前的周数作为缓存键的一部分，使用 `actions/cache@v4` 缓存 `.cache` 目录，加快后续构建速度。
     - **安装 MkDocs 及插件**：安装 `mkdocs-material` 主题和 `mkdocs-rtd-dropdown` 插件。
     - **部署到 GitHub Pages**：使用 `mkdocs gh-deploy --force` 强制部署到 GitHub Pages。

## 步骤 7：配置 GitHub Pages

1. 进入您的 GitHub 仓库页面。
2. 点击 **Settings（设置）**。
3. 在左侧菜单中选择 **Pages**。
4. 在 **Source** 部分，选择 `gh-pages` 分支（如果 `mkdocs gh-deploy` 使用的是默认设置），然后点击 **Save**。
5. GitHub 将开始部署您的 MkDocs 网站，部署完成后，您可以通过 `https://your-username.github.io/your-repo/` 访问您的静态网站。

## 步骤 8：推送更改触发部署

每当您向 `main` 或 `master` 分支推送更改时，GitHub Actions 会自动运行 `ci.yml` 工作流，构建并部署最新的文档到 GitHub Pages。

```bash
git add .
git commit -m "Update documentation"
git push origin main
```

## 附加提示

- **自定义域名**：如果您有自定义域名，可以在 GitHub Pages 设置中配置。
- **持续改进**：根据需要添加更多 MkDocs 插件或自定义主题配置，以增强文档功能和外观。
- **安全性**：确保您的仓库是私有的（如果需要），并妥善管理访问权限。

通过以上步骤，您应该能够成功创建并部署一个使用 MkDocs 的静态网站到 GitHub Pages，并利用 GitHub Actions 自动化部署流程。如果在过程中遇到任何问题，请检查 GitHub Actions 的日志以获取详细的错误信息，便于调试和解决问题。
