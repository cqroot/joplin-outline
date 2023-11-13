/* eslint-disable no-undef */
import { readFileSync } from 'fs';
import markdownHeaders from './markdownHeaders';

test('get markdown headers with backticks', () => {
  const headers = markdownHeaders(
    readFileSync('./test/markdownHeaders.md', 'utf-8'),
  );

  expect(headers.length).toBe(7);
  expect(headers[0].lineno).toBe(0);
  expect(headers[1].lineno).toBe(6);
  expect(headers[2].lineno).toBe(11);
  expect(headers[3].lineno).toBe(17);
  expect(headers[4].lineno).toBe(23);
  expect(headers[5].lineno).toBe(29);
  expect(headers[6].lineno).toBe(35);
});

test('headers after code highlighting', () => {
  const headers = markdownHeaders(
    readFileSync('./test/markdownHeaders_78.md', 'utf-8'),
  );
  expect(headers.length).toBe(4);
  expect(headers[0]).toEqual({
    html: 'Joplin Plugin Outline',
    level: 1,
    lineno: 0,
    number: '1',
    slug: 'joplin-plugin-outline',
  });
  expect(headers[1]).toEqual({
    html: 'header 1',
    level: 2,
    lineno: 1,
    number: '1.1',
    slug: 'header-1',
  });
  expect(headers[2]).toEqual({
    html: 'header 2',
    level: 2,
    lineno: 4,
    number: '1.2',
    slug: 'header-2',
  });
  expect(headers[3]).toEqual({
    html: 'header 3',
    level: 2,
    lineno: 7,
    number: '1.3',
    slug: 'header-3',
  });
});

test('headers after code highlighting', () => {
  const headers = markdownHeaders(
    readFileSync('./test/markdownHeaders_79.md', 'utf-8'),
  );
  expect(headers.length).toBe(1);
  expect(headers[0]).toEqual({
    html: '<mark>Like <strong>this</strong></mark>',
    level: 1,
    lineno: 0,
    number: '1',
    slug: 'like-this',
  });
});

test('85 markdown links in header', () => {
  const headers = markdownHeaders(
    readFileSync('./test/85-markdown_links_in_header.md', 'utf-8'),
  );
  expect(headers.length).toBe(3);
  expect(headers[0]).toEqual({
    html: 'atextb',
    level: 1,
    lineno: 0,
    number: '1',
    slug: 'atextb',
  });
  expect(headers[1]).toEqual({
    html: 'atext1text2b',
    level: 1,
    lineno: 2,
    number: '2',
    slug: 'atext1text2b',
  });
  expect(headers[2]).toEqual({
    html: '<code>inline blockquote</code> text',
    level: 1,
    lineno: 4,
    number: '3',
    slug: 'inline-blockquote-text',
  });
});

test('86 spaces before code block', () => {
  const headers = markdownHeaders(
    readFileSync('./test/86-spaces_before_code_block.md', 'utf-8'),
  );
  expect(headers.length).toBe(2);
  expect(headers[0]).toEqual({
    html: 'spaces before code block',
    level: 1,
    lineno: 0,
    number: '1',
    slug: 'spaces-before-code-block',
  });
  expect(headers[1]).toEqual({
    html: 'Comment',
    level: 1,
    lineno: 13,
    number: '2',
    slug: 'comment',
  });
});
