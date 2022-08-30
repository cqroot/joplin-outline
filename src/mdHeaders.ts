const uslug = require('uslug');

function isHeader(line: string, context: any) {
  // check code block
  if (line.match(/(?:```)/)) {
    context.flagBlock = !context.flagBlock;
    return false;
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

/* eslint-disable no-continue, no-useless-escape, no-constant-condition */
export default function mdHeaders(noteBody:string) {
  const headers = [];
  const slugs: any = {};
  const lines = noteBody.split('\n').map((line, index) => ({ index, line }));

  const context: any = {
    flagBlock: false,
    flagComment: false,
  };
  /* eslint-disable prefer-const */
  for (let { index, line } of lines) {
    if (!isHeader(line, context)) {
      continue;
    }

    line = line.trim();
    // remove closing '#'s
    line = line.replace(/\s+#*$/, '');
    // remove HTML tags
    while (true) {
      let x = line.replace(/<[^\/][^>]*>([^<>]*?)<\/[^>]*>/, '$1');
      if (x === line) break;
      line = x;
    }
    // remove math expressions
    while (true) {
      let x = line.replace(/\$.+?\$/, '');
      if (x === line) break;
      line = x;
    }
    // remove Markdown links
    while (true) {
      let x = line.replace(/\[(.*?)\]\(.*?\)/, '$1');
      if (x === line) break;
      line = x;
    }
    // remove nested Markdown '*'s and '_'s
    while (true) {
      let x = line.replace(/([_\*])(?!\s)((?:[^_\*]|[_\*]+(?=\s))+?)(?<!\s)\1/, '$2');
      if (x === line) break;
      line = x;
    }
    const match = line.match(/^(#+)\s+(.*?)\s*$/);
    if (!match) continue;
    if (match[1].length > 6) continue;

    const headerText = match[2] ?? '';

    // get slug
    const s = uslug(headerText);
    const num = slugs[s] ? slugs[s] : 1;
    const output = [s];
    if (num > 1) output.push(num);
    slugs[s] = num + 1;
    const slug = output.join('-');

    headers.push({
      level: match[1].length,
      text: headerText,
      lineno: index,
      slug,
    });
  }
  return headers;
}
