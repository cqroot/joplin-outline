const uslug = require('uslug');

/* eslint-disable no-constant-condition, no-useless-escape */
export default function getSlug(line: string): string {
  let result = line;
  // remove HTML tags
  while (true) {
    const x = result.replace(/<[^\/][^>]*>([^<>]*?)<\/[^>]*>/, '$1');
    if (x === result) break;
    result = x;
  }

  // remove math expressions
  while (true) {
    const x = result.replace(/\$.+?\$/, '');
    if (x === result) break;
    result = x;
  }

  // remove Markdown links
  while (true) {
    const x = result.replace(/\[(.*?)\]\(.*?\)/, '$1');
    if (x === result) break;
    result = x;
  }

  // replace '\_' with a temporary string
  while (true) {
    const x = result.replace(/\\_/g, '$ts$');
    if (x === result) break;
    result = x;
  }

  // remove nested Markdown '*'s and '_'s
  while (true) {
    const x = result.replace(
      /([_\*])(?!\s)((?:[^_\*]|[_\*]+(?=\s))+?)(?<!\s)\1/,
      '$2',
    );
    if (x === result) break;
    result = x;
  }

  // replace '\_' back
  while (true) {
    const x = result.replace(/\$ts\$/g, '\\_');
    if (x === result) break;
    result = x;
  }

  return uslug(result);
}
