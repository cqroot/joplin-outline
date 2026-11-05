import removeMarkdownLinks from './markdown';
import getSlug from './markdownSlug';

const katex = require('katex');
const markdownit = require('markdown-it')({ html: true })
  .use(require('markdown-it-mark'));

function renderFormula(formula: string): string {
  return katex.renderToString(formula.substring(1, formula.length - 1), {
    throwOnError: false,
  });
}

/* eslint-disable no-constant-condition, no-useless-escape */
export function renderInline(line: string): string {
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

export interface HeaderState {
  headerCount: number[];
  slugs: Record<string, number>;
}

export function createHeaderState(): HeaderState {
  return {
    headerCount: [0, 0, 0, 0, 0, 0],
    slugs: {},
  };
}

/* eslint-disable no-param-reassign */
export function buildHeaderEntry(
  rawHeaderText: string,
  headerLevel: number,
  lineno: number,
  state: HeaderState,
  // An id that already exists in the rendered note (e.g. from the source HTML).
  // When present it's used as-is, since it's the only thing Joplin's
  // `scrollToHash` can actually find in the DOM.
  domId?: string,
) {
  let headerText = rawHeaderText;
  headerText = removeMarkdownLinks(headerText);
  // remove html tags and render
  const headerHtml = renderInline(headerText.replace(/(<([^>]+)>)/ig, ''));

  // header count
  state.headerCount[headerLevel - 1] += 1;
  for (let i = headerLevel; i < 6; i += 1) {
    state.headerCount[i] = 0;
  }

  let numberPrefix = '';
  for (let i = 0; i < headerLevel; i += 1) {
    numberPrefix += state.headerCount[i];
    if (i !== headerLevel - 1) {
      numberPrefix += '.';
    }
  }

  let slug: string;
  if (domId) {
    slug = domId;
  } else {
    // get slug
    const s = getSlug(headerText);
    const num = state.slugs[s] ? state.slugs[s] : 1;
    const output: (string | number)[] = [s];
    if (num > 1) output.push(num);
    state.slugs[s] = num + 1;
    slug = output.join('-');
  }

  return {
    level: headerLevel,
    html: headerHtml,
    lineno,
    slug,
    number: numberPrefix,
  };
}
