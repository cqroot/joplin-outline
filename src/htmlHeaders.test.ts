/* eslint-disable no-undef */
import { readFileSync } from 'fs';
import htmlHeaders from './htmlHeaders';

test('get headers from an HTML-format note', () => {
  const headers = htmlHeaders(
    readFileSync('./test/htmlHeaders.html', 'utf-8'),
  );

  expect(headers.length).toBe(5);
  // id taken from a wrapper tag left open on the line above the heading
  expect(headers[0]).toEqual({
    html: 'Chapter 1. Getting Started',
    level: 1,
    lineno: 2,
    number: '1',
    slug: 'getting_started',
  });
  // id taken directly from the heading tag itself
  expect(headers[1]).toEqual({
    html: 'Breaking Down the Problem',
    level: 2,
    lineno: 4,
    number: '1.1',
    slug: 'explicit-id',
  });
  // duplicate header text gets a de-duplicated slug
  expect(headers[2]).toEqual({
    html: 'Note',
    level: 6,
    lineno: 6,
    number: '1.1.0.0.0.1',
    slug: 'note',
  });
  expect(headers[3]).toEqual({
    html: 'Note',
    level: 6,
    lineno: 7,
    number: '1.1.0.0.0.2',
    slug: 'note-2',
  });
  // headers inside <pre> or HTML comments are ignored
  expect(headers[4]).toEqual({
    html: 'Configuring things',
    level: 3,
    lineno: 10,
    number: '1.1.1',
    slug: 'configuring-things',
  });
});

test('a self-closing void element with an id on the previous line is not treated as a wrapper', () => {
  const headers = htmlHeaders(
    '<img src="x.png" id="figure-1">\n<h6>Figure caption</h6>\n',
  );

  expect(headers.length).toBe(1);
  expect(headers[0].slug).toBe('figure-caption');
});
