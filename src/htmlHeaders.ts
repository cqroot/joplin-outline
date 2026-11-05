import { buildHeaderEntry, createHeaderState } from './headerEntry';

// Joplin's HTML renderer doesn't auto-generate heading anchors the way it does
// for Markdown, so clicking an outline item can only jump to a header if the
// source HTML already has an id somewhere Joplin's `getElementById`-based
// scrollToHash will find it: on the heading tag itself, or on a wrapper tag
// that opens on the line right above it (the common pattern in exported/clipped
// HTML, e.g. `<div class="sect1" id="...">` followed by `<h1>...</h1>`).
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',
]);

function isBlocked(line: string, context: any): boolean {
  // check <pre> block, so sample HTML shown as code isn't parsed as real headers
  const hasOpenPre = /<pre[\s>]/i.test(line);
  const hasClosePre = /<\/pre>/i.test(line);

  if (hasOpenPre && !hasClosePre) {
    context.flagPre = true;
    return true;
  }
  if (hasClosePre) {
    context.flagPre = false;
    return true;
  }
  if (context.flagPre) return true;

  // check comment block
  if (/<!--/.test(line) && !/-->/.test(line)) {
    context.flagComment = true;
    return true;
  }
  if (/-->/.test(line)) {
    context.flagComment = false;
    return true;
  }

  return context.flagComment;
}

function matchHtmlHeader(line: string): { level: number; text: string } | null {
  const match = line.match(/<h([1-6])(?:\s[^>]*)?>(.*?)<\/h\1>/i);
  if (!match) return null;
  return { level: parseInt(match[1], 10), text: match[2] ?? '' };
}

function findDomId(headingLine: string, previousLine: string): string | undefined {
  // an id directly on the heading tag itself
  const ownMatch = headingLine.match(/<h[1-6]\s[^>]*\bid=["']([^"']+)["']/i);
  if (ownMatch) return ownMatch[1];

  // an id on a wrapper tag left open at the end of the previous line
  const wrapperMatch = previousLine.match(/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\bid=["']([^"']+)["'][^>]*(?<!\/)>\s*$/);
  if (wrapperMatch && !VOID_ELEMENTS.has(wrapperMatch[1].toLowerCase())) return wrapperMatch[2];

  return undefined;
}

/* eslint-disable no-continue */
export default function htmlHeaders(noteBody: string) {
  const headers = [];
  const lines = noteBody.split('\n').map((line, index) => ({ index, line }));
  const state = createHeaderState();

  const checkContext: any = {
    flagPre: false,
    flagComment: false,
  };

  for (let i = 0; i < lines.length; i += 1) {
    const { index, line } = lines[i];
    if (isBlocked(line, checkContext)) continue;

    const match = matchHtmlHeader(line);
    if (!match) continue;

    const domId = findDomId(line, i > 0 ? lines[i - 1].line : '');
    headers.push(buildHeaderEntry(match.text, match.level, index, state, domId));
  }
  return headers;
}
