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
  const bgColor = await settingValue('bgColor');
  const collapsible = await settingValue('collapsible');
  const disableLinewrap = await settingValue('disableLinewrap');
  const fontFamily = await settingValue('fontFamily');
  const fontSize = await settingValue('fontSize');
  const fontColor = await settingValue('fontColor');
  const headerIndent = await settingValue('headerIndent');
  const headerDepth = await settingValue('headerDepth');
  const hoverStyleType = await settingValue('hoverStyleType');
  const itemPadding = await settingValue('itemPadding');
  const showNumber = await settingValue('showNumber');
  const userStyleFile = await settingValue('userStyleFile');
  const userStyle = await settingValue('userStyle');

  let linewrapStyle = '';
  if (disableLinewrap) {
    linewrapStyle += `
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;`;
  }

  const itemHtmlList = [];
  const divsToClose = [];
  let hasCollapsibleGroups = false;

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
          hasCollapsibleGroups = true;
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

  let hoverStyle = `.toc-item:hover {
  font-weight: bold;
}`;
  if (hoverStyleType === 1) {
    hoverStyle = `.toc-item:hover {
  background-color: var(--joplin-background-color-hover3);
  border-radius: 3px;
}`;
  }
  const defaultStyle = `.outline-content {
  font-family: ${fontFamily};
  min-height: calc(100vh - 1em);
  background-color: ${bgColor};
  padding: 5px;
}
.toc-item,
.toc-item > span {
  font-size: ${fontSize}pt;
}
.toc-item {
  display: block;
  margin: 0;
  padding: ${itemPadding}px 0;
  color: ${fontColor};
  ${linewrapStyle}
  text-decoration: none;
}
${hoverStyle}
${[1, 2, 3, 4, 5, 6].map((item) => `.toc-item-${item} {
  padding-left: ${(item - 1) * headerIndent + 5}px !important;
}`).join('\n')}
.number-prefix {
  font-weight: normal;
  font-style: normal;
}
.outline-search {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 2px 0 6px 0;
  background-color: ${bgColor};
}
.outline-search input {
  width: 100%;
  box-sizing: border-box;
  padding: 4px 6px;
  font-family: ${fontFamily};
  font-size: ${fontSize}pt;
  color: ${fontColor};
  background-color: ${bgColor};
  border: 1px solid var(--joplin-divider-color, #cccccc);
  border-radius: 3px;
  outline: none;
}
.toc-item.toc-hidden {
  display: none !important;
}
.toc-item.toc-match-active {
  background-color: var(--joplin-background-color-hover3);
  border-radius: 3px;
}
.outline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}
.outline-header-actions {
  display: flex;
  flex-shrink: 0;
  gap: 4px;
}
.outline-action {
  position: relative;
  cursor: pointer;
  padding: 1px 6px;
  font-size: ${fontSize}pt;
  line-height: 1.4;
  color: var(--joplin-color-faded);
  background-color: transparent;
  border: 1px solid var(--joplin-divider-color, #cccccc);
  border-radius: 3px;
}
.outline-action:hover {
  color: ${fontColor};
  background-color: var(--joplin-background-color-hover3);
}
.outline-action::after {
  content: attr(data-tip);
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 20;
  padding: 2px 6px;
  font-size: ${fontSize}pt;
  font-weight: normal;
  white-space: nowrap;
  color: var(--joplin-color);
  background-color: var(--joplin-background-color);
  border: 1px solid var(--joplin-divider-color, #cccccc);
  border-radius: 3px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.12s ease;
}
.outline-action:hover::after {
  opacity: 1;
  visibility: visible;
}`;

  let userStyleFromFile: string = '';
  if (existsSync(userStyleFile)) {
    userStyleFromFile = readFileSync(userStyleFile, 'utf-8');
  }

  let actionsHtml = '';
  if (collapsible && hasCollapsibleGroups) {
    actionsHtml = `<span class="outline-header-actions">
<button type="button" id="outline-toggle-all" class="outline-action" data-tip="Collapse all" aria-label="Collapse all" onclick="toggleAllGroups()">&#8863;</button>
</span>`;
  }

  return `<html><head><style>
${defaultStyle}
${userStyleFromFile}
${userStyle}
</style></head>
<body><div class="outline-content">
<div class="outline-header">
<a id="header" href="javascript:;" onclick="scrollToTop()" oncontextmenu="copyInnerLink('', '')">OUTLINE</a>
${actionsHtml}
</div>
<div id="outline-search" class="outline-search" style="display: none;">
<input id="outline-search-input" type="text" placeholder="Search outline" />
</div>
<div class="container">
${itemHtmlList.join('\n')}
</div>
</div></body></html>`;
}
