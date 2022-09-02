import { readFileSync } from 'fs';
import { settingValue, globalSettingValue } from './settings';

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

async function headerToHtml(header: any, numberStyle: string, showNumber: boolean) {
  let numberPrefix = '';
  if (showNumber) {
    numberPrefix = header.number;
  }
  return '<a id="toc-item-link" class="toc-item-link" href="javascript:;"'
    + `data-slug="${escapeHtml(header.slug)}" data-lineno="${header.lineno}"`
    + 'onclick="tocItemLinkClicked(this.dataset)"'
    + 'oncontextmenu="copyInnerLink(this.dataset, this.innerText)">'
    + `<span>${await getHeaderPrefix(header.level)} </span>`
    + `<i style="${numberStyle}">${numberPrefix} </i>`
    + `<span>${escapeHtml(header.text)}</span>`
    + '</a>';
}

export default async function panelHtml(headers: any[]) {
  // Settings
  const showNumber = await settingValue('showNumber');
  const collapsible = await settingValue('collapsible');
  const headerIndent = await settingValue('headerIndent');
  const headerDepth = await settingValue('headerDepth');
  const numberStyle = await settingValue('numberStyle');
  const userStyle = await settingValue('userStyle');
  const disableLinewrap = await settingValue('disableLinewrap');
  const fontFamily = await settingValue('fontFamily');
  const fontSize = await settingValue('fontSize');
  const fontWeight = await settingValue('fontWeight');
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
    const itemHtmlStr: string = await headerToHtml(header, numberStyle, showNumber);

    if (collapsible) {
      let suffix: string = '';
      let toggleElem: string = '<span>&ensp;<span>';

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
          while (divsToClose[divsToClose.length - 1] >= nextHeader.level) {
            suffix = suffix.concat('</div>');
            divsToClose.splice(divsToClose.length - 1, 1);
          }
        }
      }
      itemHtmlList.push(`<p style="padding-left:${(header.level - 1) * headerIndent}px;">${toggleElem}${itemHtmlStr}</p>${suffix}`);
    } else {
      itemHtmlList.push(`<p style="padding-left:${(header.level - 1) * headerIndent}px;">${itemHtmlStr}</p>`);
    }
  }

  const defaultStyle = `
    .outline-content {
      font-family: ${fontFamily};
      min-height: calc(100vh - 1em);
      background-color: ${bgColor};
      padding: 5px
    }
    .container {
      font-size: ${fontSize}pt;
      font-weight: ${fontWeight};
    }
    .toc-item-link {
      padding: 0 2px;
      text-decoration: none;
      color: ${fontColor};
      ${linewrapStyle}
    }
    .toc-item-link:hover {
      font-weight: bold;
    }
    `;

  const userStyleFromFile = readFileSync(`${await globalSettingValue('profileDir')}/outline.css`, 'utf-8');

  return `
    <head>
    <style>
    ${defaultStyle}
    ${userStyleFromFile}
    ${userStyle}
    </style>
    </head>
    <body>
    <div class="outline-content">
      <a id="header" href="javascript:;" onclick="scrollToTop()">OUTLINE</a>
      <div class="container">
        ${itemHtmlList.join('\n')}
      </div>
    </div>
    </body>`;
}
