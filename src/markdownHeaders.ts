import getSlug from './markdownSlug';

const katex = require('katex');
const markdownit = require('markdown-it')({ html: true })
  .use(require('markdown-it-mark'));

function isHeader(line: string, context: any) {
  // check code block
  if (!line.match(/(?:```)(?:.+?)(?:```)/)) {
    if (line.match(/(?:^```)/)) {
      context.flagBlock = !context.flagBlock;
      return false;
    }
  }
  // check comment block
  if (line.match(/(?:<!--)/) && !line.match(/(?:-->)/)) {
    context.flagComment = true;
    return false;
  }
  if (line.match(/(?:-->)/)) {
    context.flagComment = false;
    return false;
  }
  if (context.flagBlock || context.flagComment) return false;

  if (!line.match(/^ {0,3}#/)) return false;

  return true;
}

function renderFormula(formula: string): string {
  return katex.renderToString(formula.substring(1, formula.length - 1), {
    throwOnError: false,
  });
}

/* eslint-disable no-constant-condition, no-useless-escape */
function renderInline(line: string): string {
  let html = line;
  html = line.replace(/\$.+?\$/g, renderFormula);
  html = markdownit.renderInline(html);

  // remove HTML links
  while (true) {
    const x = html.replace(/<a\s[^>]*?>([^<>]*?)<\/a>/, '$1');
    if (x === html) break;
    html = x;
  }

  return html;
}

/* eslint-disable no-continue, no-useless-escape */
export default function markdownHeaders(noteBody: string) {
  const headers = [];
  const slugs: any = {};
  const lines = noteBody.split('\n').map((line, index) => ({ index, line }));
  const headerCount: number[] = [0, 0, 0, 0, 0, 0];

  const checkContext: any = {
    flagBlock: false,
    flagComment: false,
  };
  /* eslint-disable prefer-const */
  for (let { index, line } of lines) {
    if (!isHeader(line, checkContext)) {
      continue;
    }

    line = line.trim();
    // remove closing '#'s
    line = line.replace(/\s+#*$/, '');

    const match = line.match(/^(#+)\s+(.*?)\s*$/);
    if (!match) continue;
    const headerLevel = match[1].length;
    if (headerLevel > 6) continue;
    let headerText = match[2] ?? '';
    const headerHtml = renderInline(headerText);

    // header count
    headerCount[headerLevel - 1] += 1;
    for (let i = headerLevel; i < 6; i += 1) {
      headerCount[i] = 0;
    }

    let numberPrefix = '';
    for (let i = 0; i < headerLevel; i += 1) {
      numberPrefix += headerCount[i];
      if (i !== headerLevel - 1) {
        numberPrefix += '.';
      }
    }

    // get slug
    const s = getSlug(headerText);
    const num = slugs[s] ? slugs[s] : 1;
    const output = [s];
    if (num > 1) output.push(num);
    slugs[s] = num + 1;
    const slug = output.join('-');

    headers.push({
      level: headerLevel,
      html: headerHtml,
      lineno: index,
      slug,
      number: numberPrefix,
    });
  }
  return headers;
}
