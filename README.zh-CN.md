<div align="center">
  <h1>Joplin Outline Plugin</h1>
  <i>这是一个为 <a href="https://github.com/laurent22/joplin">Joplin</a> 提供 outline 功能的插件. 受 <a href="https://github.com/laurent22/joplin/tree/dev/packages/app-cli/tests/support/plugins/toc/">joplin toc</a> 启发。</i>
  <p align="center">
    <a href="README.md">English</a>
    ·
    <a href="README.zh-CN.md">简体中文</a>
    <br />
  </p>
  <p>
    <img src="https://img.shields.io/github/issues/cqroot/joplin-outline?style=flat-square" />
    <img src="https://img.shields.io/github/license/cqroot/joplin-outline?style=flat-square" />
    <img src="https://img.shields.io/npm/v/joplin-plugin-outline?label=version&style=flat-square" />
    <img src="https://img.shields.io/github/downloads/cqroot/joplin-outline/total?label=github%20downloads&style=flat-square" />
    <img src="https://img.shields.io/npm/dt/joplin-plugin-outline?label=npm%20downloads&style=flat-square" />
  </p>
  <hr>
</div>


![screenshot](.github/screenshot.png)

## 特性

- 支持 atx 风格的标题（`#`），不支持 setext 风格的标题（`---`，`===`）。
- 支持右键拷贝 markdown 内链。
- 支持自定义界面风格。
- 支持各级标题前增加自定义符号。

## 需求

- Joplin 1.3.15 或更高以支持插件。

## 安装

拷贝 outline.jpl 文件到你的 plugins 目录中。outline 插件会在重启应用后自动加载。

## 设置

| 配置项           | 类型   | 描述           |
| ---------------- | ------ | -------------- |
| Toggle Shortcut  | String | 切换快捷键     |
| Auto Hide        | Bool   | 是否自动隐藏   |
| Font Family      | String | 主界面字体族   |
| Font Size （pt） | Int    | 主界面字体大小 |
| Font Color       | String | 主界面字体颜色 |
| Background Color | String | 主界面背景颜色 |
| Disable Linewrap | Bool   | 禁用行换行     |
| Number <i> Style | String | 数字风格       |
| H[1-6] Prefix    | String | 标题前缀       |

## 社区

[A markdown outline sidebar plugin for Joplin](https://discourse.joplinapp.org/t/a-markdown-outline-sidebar-plugin-for-joplin/13364)

[Toc as the sidebar](https://discourse.joplinapp.org/t/toc-as-the-sidebar/5979/64)
