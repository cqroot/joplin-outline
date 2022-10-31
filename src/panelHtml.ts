import { readFileSync, existsSync } from 'fs';
import { settingValue } from './settings';

// From https://stackoverflow.com/a/6234804/561309
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function getHeaderPrefix(level: number) {
  /* eslint-disable no-return-await */
  return await settingValue(`h${level}Prefix`);
}

async function headerToHtml(header: any, showNumber: boolean, prefixHtml: string = '') {
  let numberPrefix = '';
  if (showNumber) {
    numberPrefix = header.number;
  }
  return `<a class="toc-item toc-item-link toc-item-${header.level}" href="javascript:;" `
    + `data-slug="${escapeHtml(header.slug)}" data-lineno="${header.lineno}" `
    + 'onclick="tocItemLinkClicked(this.dataset)" '
    + 'oncontextmenu="copyInnerLink(this.dataset, this.innerText)">'
    + `${prefixHtml}`
    + `<span>${await getHeaderPrefix(header.level)} </span>`
    + `<span class="number-prefix">${numberPrefix} </span>`
    + `<span>${header.html}</span>`
    + '</a>';
}

export default async function panelHtml(headers: any[]) {
  // Settings
  const showNumber = await settingValue('showNumber');
  const collapsible = await settingValue('collapsible');
  const headerIndent = await settingValue('headerIndent');
  const headerDepth = await settingValue('headerDepth');
  const userStyleFile = await settingValue('userStyleFile');
  const userStyle = await settingValue('userStyle');
  const disableLinewrap = await settingValue('disableLinewrap');
  const fontFamily = await settingValue('fontFamily');
  const fontSize = await settingValue('fontSize');
  const fontColor = await settingValue('fontColor');
  const bgColor = await settingValue('bgColor');

  let linewrapStyle = '';
  if (disableLinewrap) {
    linewrapStyle += `
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;`;
  }

  const itemHtmlList = [];
  const divsToClose = [];

  for (let headerIdx = 0; headerIdx < headers.length; headerIdx += 1) {
    const header = headers[headerIdx];

    // header depth
    /* eslint-disable no-continue */
    if (header.level > headerDepth) {
      continue;
    }

    /* eslint-disable no-await-in-loop */
    if (collapsible) {
      let suffix: string = '';
      let toggleElem: string = '<span>&ensp;</span>';

      if (headerIdx >= headers.length - 1) {
        // Last element
        while (divsToClose.length !== 0) {
          suffix = suffix.concat('</div>');
          divsToClose.splice(divsToClose.length - 1, 1);
        }
      } else {
        const nextHeader = headers[headerIdx + 1];

        if (header.level < nextHeader.level) {
          toggleElem = `<span id="toggle-${header.number}" class="toggle-button" onclick="toggleHidden('${header.number}')">&#9662</span>`;
          suffix = suffix.concat(`<div id="toc-group-${header.number}">`);
          divsToClose.push(nextHeader.level);
        } else if (header.level > nextHeader.level) {
          while (divsToClose[divsToClose.length - 1] > nextHeader.level) {
            suffix = suffix.concat('</div>');
            divsToClose.splice(divsToClose.length - 1, 1);
          }
        }
      }
      itemHtmlList.push(`${await headerToHtml(header, showNumber, toggleElem)}${suffix}`);
    } else {
      itemHtmlList.push(`${await headerToHtml(header, showNumber)}`);
    }
  }

  const defaultStyle = `.outline-content {
  font-family: ${fontFamily};
  min-height: calc(100vh - 1em);
  background-color: ${bgColor};
}
.toc-item,
.toc-item > span {
  font-size: ${fontSize}pt;
}
.toc-item {
  display: block;
  margin: 0;
  padding: 2px 0;
  color: ${fontColor};
  ${linewrapStyle}
  text-decoration: none;
}
.toc-item:hover {
  font-weight: bold;
}
${[1, 2, 3, 4, 5, 6].map((item) => `.toc-item-${item} {
  padding-left: ${(item - 1) * headerIndent + 5}px !important;
}`).join('\n')}
.number-prefix {
  font-weight: normal;
  font-style: normal;
}`;

  let userStyleFromFile: string = '';
  if (existsSync(userStyleFile)) {
    userStyleFromFile = readFileSync(userStyleFile, 'utf-8');
  }

  return `<html><head><style>
${defaultStyle}
${userStyleFromFile}
${userStyle}
</style></head>
<body><div class="outline-content">
<a id="header" href="javascript:;" onclick="scrollToTop()">OUTLINE</a>
<div class="container">
${itemHtmlList.join('\n')}
</div>
</div></body></html>`;
}
