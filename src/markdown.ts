/* eslint-disable no-constant-condition */
export default function removeMarkdownLinks(line: string): string {
  let result = line;

  // remove Markdown links
  while (true) {
    const x = result.replace(/\[(.*?)\]\(.*?\)/, '$1');
    if (x === result) break;
    result = x;
  }

  return result;
}
