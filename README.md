<div align="center">
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
  <h1>Joplin Outline Plugin</h1>
  <i>This is a outline plugin for <a href="https://github.com/laurent22/joplin">Joplin</a>. Refer to <a href="https://github.com/laurent22/joplin/tree/dev/packages/app-cli/tests/support/plugins/toc/">joplin toc</a>.</i>
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

## Features

- Support atx-style headers (`#`), not setext-style headers (`---`, `===`).
- Support right click to paste markdown inner link.
- Support custom style.
- Support adding custom symbols before headings. 
- Support jumping to header in Editor Mode. (contributed by [@jerrylususu](https://github.com/jerrylususu/joplin-outline))

## Requirements

- Joplin 1.3.15 or higher for application plugins support.

## Installation

To install joplin-outline, copy [outline.jpl](https://github.com/cqroot/joplin-outline/releases/latest) to your profile's `plugins` directory. The outline will be automatically loaded and executed when you restart the application.

## Configurations

| Configuration    | Type   | Description                                           |
| ---------------- | ------ | ----------------------------------------------------- |
| Toggle Shortcut  | String | Shortcut to switch panel display                      |
| Auto Hide        | Bool   | Automatically hide the panel when there is no content |
| Font Family      | String | Default: var(--joplin-font-family)                    |
| Font Size （pt） | Int    | Default: 10pt                                         |
| Font Color       | String | Default: var(--joplin-color)                          |
| Background Color | String | Default: var(--joplin-background-color)               |
| Disable Linewrap | Bool   | Disable the linewrap                                  |
| Number <i> Style | String |                                                       |
| H[1-6] Prefix    | String | Custom prefix                                         |

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Jasper-zz"><img src="https://avatars.githubusercontent.com/u/22317011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jasper</b></sub></a><br /><a href="https://github.com/cqroot/joplin-outline/commits?author=Jasper-zz" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/brttbndr"><img src="https://avatars.githubusercontent.com/u/60824?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brett Bender</b></sub></a><br /><a href="https://github.com/cqroot/joplin-outline/commits?author=brttbndr" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jerrylususu"><img src="https://avatars.githubusercontent.com/u/17522475?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Neko Null</b></sub></a><br /><a href="https://github.com/cqroot/joplin-outline/commits?author=jerrylususu" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!