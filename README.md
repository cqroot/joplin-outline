<div align="center">
  <h1>Joplin Outline Plugin</h1>
  <i>This is a outline plugin for <a href="https://github.com/laurent22/joplin">Joplin</a>. Refer to <a href="https://github.com/laurent22/joplin/tree/dev/packages/app-cli/tests/support/plugins/toc/">joplin toc</a>.</i>
  <p align="center">
    <a href="README.md">English</a>
    ·
    <a href="README.zh-CN.md">简体中文</a>
    <br />
  </p>
  <p>
    <a href="https://github.com/cqroot/joplin-outline/actions">
      <img src="https://github.com/cqroot/joplin-outline/workflows/test/badge.svg" alt="Action Status" />
    </a>
    <img src="https://img.shields.io/github/issues/cqroot/joplin-outline" />
    <img src="https://img.shields.io/github/license/cqroot/joplin-outline" />
    <img src="https://img.shields.io/npm/v/joplin-plugin-outline?label=version" />
    <img src="https://img.shields.io/github/downloads/cqroot/joplin-outline/total?label=github%20downloads" />
    <img src="https://img.shields.io/npm/dt/joplin-plugin-outline?label=npm%20downloads" />
  </p>
  <hr>
</div>

![screenshot](.github/screenshot.png)

## Features

- Support atx-style headers (`#`), not setext-style headers (`---`, `===`).
- Support right click to paste markdown inner link.
- Support collapsible outline.
- Support automatic numbering.
- Support custom style.
- Support adding custom symbols before headings. 
- Support jumping to header in Editor Mode. (contributed by [@jerrylususu](https://github.com/jerrylususu/joplin-outline))

## Documentation

- [Custom panel style](https://github.com/cqroot/joplin-outline/wiki/Custom-panel-style)

## Requirements

- Joplin 1.3.15 or higher for application plugins support.

## Installation

To install joplin-outline, copy [outline.jpl](https://github.com/cqroot/joplin-outline/releases/latest) to your profile's `plugins` directory. The outline will be automatically loaded and executed when you restart the application.

## Building

### Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.

The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

### Updating the plugin framework

To update the plugin framework, run `yo joplin --update`

Keep in mind that doing so will overwrite all the framework-related files **outside of the "src/" directory** (your source code will not be touched). So if you have modified any of the framework-related files, such as package.json or .gitignore, make sure your code is under version control so that you can check the diff and re-apply your changes.

For that reason, it's generally best not to change any of the framework files or to do so in a way that minimises the number of changes. For example, if you want to modify the Webpack config, create a new separate JavaScript file and include it in webpack.config.js. That way, when you update, you only have to restore the line that include your file.

## Community

[A markdown outline sidebar plugin for Joplin](https://discourse.joplinapp.org/t/a-markdown-outline-sidebar-plugin-for-joplin/13364)

[Toc as the sidebar](https://discourse.joplinapp.org/t/toc-as-the-sidebar/5979/64)

## Contributors

<a href="https://github.com/cqroot/joplin-outline/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=cqroot/joplin-outline" />
</a>
