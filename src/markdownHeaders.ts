import { buildHeaderEntry, createHeaderState } from './headerEntry';

function isBlocked(line: string, context: any): boolean {
  // check code block
  if (!line.match(/(?:`{3,})(?:.+?)(?:`{3,})/) && !line.match(/(?:~{3,})(?:.+?)(?:~{3,})/)) {
    // Opening fence: 3+ backticks or tildes; the rest of the line must not
    // contain the same fence character (CommonMark info string rule).
    const fenceMatch = line.match(/^\s{0,3}(`{3,})([^`]*)$/)
      || line.match(/^\s{0,3}(~{3,})([^~]*)$/);
    if (fenceMatch) {
      const fenceChar = fenceMatch[1][0];
      const fenceLength = fenceMatch[1].length;
      if (context.flagBlock) {
        // A fence only closes the block when it uses the same character and
        // is at least as long as the opening fence.
        if (context.fenceChar === fenceChar && fenceLength >= context.fenceLength) {
          context.flagBlock = false;
          context.fenceChar = null;
          context.fenceLength = 0;
        }
      } else {
        context.flagBlock = true;
        context.fenceChar = fenceChar;
        context.fenceLength = fenceLength;
      }
      return true;
    }
  }

  // check comment block
  if (line.match(/(?:<!--)/) && !line.match(/(?:-->)/)) {
    context.flagComment = true;
    return true;
  }
  if (line.match(/(?:-->)/)) {
    context.flagComment = false;
    return true;
  }

  return context.flagBlock || context.flagComment;
}

function matchMarkdownHeader(line: string): { level: number; text: string } | null {
  if (!line.match(/^ {0,3}#/)) return null;

  let trimmed = line.trim();
  // remove closing '#'s
  trimmed = trimmed.replace(/\s+#*$/, '');

  const match = trimmed.match(/^(#+)\s+(.*?)\s*$/);
  if (!match) return null;
  const level = match[1].length;
  if (level > 6) return null;
  return { level, text: match[2] ?? '' };
}

// A literal HTML header (e.g. `<h2>Title</h2>`) that occupies the whole line
function matchInlineHtmlHeader(line: string): { level: number; text: string } | null {
  const match = line.trim().match(/^<h([1-6])(?:\s[^>]*)?>(.*)<\/h\1>$/i);
  if (!match) return null;
  return { level: parseInt(match[1], 10), text: match[2] ?? '' };
}

/* eslint-disable no-continue */
export default function markdownHeaders(noteBody: string) {
  const headers = [];
  const lines = noteBody.split('\n').map((line, index) => ({ index, line }));
  const state = createHeaderState();

  const checkContext: any = {
    flagBlock: false,
    flagComment: false,
    fenceChar: null,
    fenceLength: 0,
  };

  for (const { index, line } of lines) {
    if (isBlocked(line, checkContext)) continue;

    const match = matchMarkdownHeader(line) ?? matchInlineHtmlHeader(line);
    if (!match) continue;

    headers.push(buildHeaderEntry(match.text, match.level, index, state));
  }
  return headers;
}
