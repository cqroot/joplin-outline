/* eslint-disable no-continue */
export default function mdHeaders(noteBody:string) {
  const headers = [];
  const lines = noteBody.split('\n').map((line, index) => ({ index, line }));
  let flagBlock = false;
  let flagComment = false;
  /* eslint-disable prefer-const */
  for (let { index, line } of lines) {
    // check code block
    if (line.match(/(?:```)/)) {
      flagBlock = !flagBlock;
      continue;
    }
    // check comment block
    if (line.match(/(?:<!--)/) && !line.match(/(?:-->)/)) {
      flagComment = true;
      continue;
    }
    if (line.match(/(?:-->)/)) {
      flagComment = false;
      continue;
    }
    if (flagBlock || flagComment) continue;

    // check header
    line = line.replace(/(\s#+)?$/, '');
    const match = line.match(/^(#+)\s(?:\[(.*)\]|(.*))/);
    if (!match) continue;
    if (match[1].length > 6) continue;
    headers.push({
      level: match[1].length,
      text: typeof (match[2]) === 'undefined' ? match[3] : match[2],
      lineno: index,
    });
  }
  return headers;
}
