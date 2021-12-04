import { settingValue } from './settings';

const uslug = require('uslug');

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

export default async function (headers: any[]) {
  // Settings
  const showNumber = await settingValue('showNumber');
  const headerDepth = await settingValue('headerDepth');
  const numberStyle = await settingValue('numberStyle');
  const disableLinewrap = await settingValue('disableLinewrap');
  const fontFamily = await settingValue('fontFamily');
  const fontSize = await settingValue('fontSize');
  const fontWeight = await settingValue('fontWeight');
  const fontColor = await settingValue('fontColor');
  const bgColor = await settingValue('bgColor');

  let pStyle = '';
  if (disableLinewrap) {
    pStyle += 'white-space: nowrap;text-overflow:ellipsis;overflow:hidden;';
  }

  const slugs: any = {};
  const itemHtml = [];
  const headerCount: number[] = [0, 0, 0, 0, 0, 0];

  for (const header of headers) {
    // header depth
    /* eslint-disable no-continue */
    if (header.level > headerDepth) {
      continue;
    }

    // get slug
    const s = uslug(header.text);
    const num = slugs[s] ? slugs[s] : 1;
    const output = [s];
    if (num > 1) output.push(num);
    slugs[s] = num + 1;
    const slug = output.join('-');

    headerCount[header.level - 1] += 1;
    for (let i = header.level; i < 6; i += 1) {
      headerCount[i] = 0;
    }

    let numberPrefix = '';
    if (showNumber) {
      for (let i = 0; i < header.level; i += 1) {
        numberPrefix += headerCount[i];
        if (i !== header.level - 1) {
          numberPrefix += '.';
        }
      }
    }

    /* eslint-disable no-await-in-loop */
    itemHtml.push(`
<p class="toc-item" style="padding-left:${(header.level - 1) * 15}px;${pStyle}">
   ${await getHeaderPrefix(header.level)}
   <i style="${numberStyle}">${numberPrefix}</i>
    <a class="toc-item-link" href="javascript:;" data-slug="${escapeHtml(slug)}" data-lineno="${header.lineno}" style="color: ${fontColor}">
        ${escapeHtml(header.text)}
    </a>
</p>`);
  }

  return `
<div class="outline-content"
style="font-family: ${fontFamily}; min-height: calc(100vh - 1em); background-color: ${bgColor}; padding: 5px">
    <a class="header" href="javascript:;">OUTLINE</a>
    <div class="container" style="
          font-size: ${fontSize}pt;
          font-weight: ${fontWeight};
    ">
        ${itemHtml.join('\n')}
    </div>
</div>`;
}
