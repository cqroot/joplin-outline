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

async function headerToHtml(header: any, numberStyle: string, showNumber: boolean) {
  let numberPrefix = '';
  if (showNumber) {
    numberPrefix = header.number;
  }
  return `
    <a id="toc-item-link" class="toc-item-link" href="javascript:;"
      data-slug="${escapeHtml(header.slug)}" data-lineno="${header.lineno}"
      onclick="tocItemLinkClicked(this.dataset)"
      oncontextmenu="copyInnerLink(this.dataset, this.innerText)"
      style="display: block; padding-left:${(header.level - 1) * 15}px;">
        <span>${await getHeaderPrefix(header.level)}</span>
        <i style="${numberStyle}">${numberPrefix}</i>
        <span>${escapeHtml(header.text)}</span>
    </a>`;
}

export default async function panelHtml(headers: any[]) {
  // Settings
  const showNumber = await settingValue('showNumber');
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

  const itemHtml = [];

  for (const header of headers) {
    // header depth
    /* eslint-disable no-continue */
    if (header.level > headerDepth) {
      continue;
    }

    /* eslint-disable no-await-in-loop */
    itemHtml.push(await headerToHtml(header, numberStyle, showNumber));
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

  return `
    <head>
    <style>
    ${defaultStyle}
    ${userStyle}
    </style>
    </head>
    <body>
    <div class="outline-content">
      <a id="header" href="javascript:;" onclick="scrollToTop()">OUTLINE</a>
      <div class="container">
        ${itemHtml.join('\n')}
      </div>
    </div>
    </body>`;
}
