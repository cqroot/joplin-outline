import removeMarkdownLinks from './markdown';
import getSlug from './markdownSlug';

const katex = require('katex');
const markdownit = require('markdown-it')({ html: true })
  .use(require('markdown-it-mark'));

function isHeader(line: string, context: any) {
  // check code block
  if (!line.match(/(?:```)(?:.+?)(?:```)/)) {
    if (line.match(/(?:^\s{0,3}```)/)) {
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

function renderFormulas(line: string): string {
  const render = (s: string) => s.replace(/\$.+?\$/g, renderFormula);

  if (!line.includes('`')) {
    return render(line);
  }

  const codeBlocks: [number, number][] = [];
  for (let i = 0; i < line.length; i++) {
    const relativeBlockStart = line.substring(i).indexOf('`');
    if (relativeBlockStart === -1) {
      break;
    }

    const blockStart = i + relativeBlockStart;

    // Escaped backticks aren't a block start
    if (line[blockStart - 1] === '\\') {
      i = blockStart;
      continue;
    }

    // Actually got a code block here: get tick count for matching
    const lookahead = line.substring(blockStart);
    const tickCount = lookahead.match(/^`+/)[0].length;

    // Find end
    const innerBlockStart = blockStart + tickCount;
    const relativeBlockEnd = lookahead.substring(tickCount).indexOf('`'.repeat(tickCount)) + 1;
    if (relativeBlockEnd === -1) {
      // No matching end
      i = tickCount - 1;
      continue;
    }

    // Get block span (inclusive/exclusive start/end index)
    const blockEnd = innerBlockStart + relativeBlockEnd + tickCount - 1;
    codeBlocks.push([blockStart, blockEnd]);
    i = blockEnd;
  }

  let renderedString = '';
  let currentStart = 0;
  for (const [blockStart, blockEnd] of codeBlocks) {
    renderedString += render(line.substring(currentStart, blockStart));
    renderedString += line.substring(blockStart, blockEnd);
    currentStart = blockEnd;
  }
  renderedString += render(line.substring(currentStart, line.length));
  return renderedString;
}

/* eslint-disable no-constant-condition, no-useless-escape */
function renderInline(line: string): string {
  let html = line;
  html = renderFormulas(line);
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
    headerText = removeMarkdownLinks(headerText);
    // remove html tags and render
    const headerHtml = renderInline(headerText.replace(/(<([^>]+)>)/ig, ''));

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
