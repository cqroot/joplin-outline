/* eslint-disable no-undef */
import { readFileSync } from 'fs';
import markdownHeaders from './markdownHeaders';

test('get markdown headers with backticks', () => {
  const headersWithBackticks = markdownHeaders(
    readFileSync('./test/markdownHeaders.md', 'utf-8'),
  );

  expect(headersWithBackticks.length).toBe(7);
  expect(headersWithBackticks[0].lineno).toBe(0);
  expect(headersWithBackticks[1].lineno).toBe(6);
  expect(headersWithBackticks[2].lineno).toBe(11);
  expect(headersWithBackticks[3].lineno).toBe(17);
  expect(headersWithBackticks[4].lineno).toBe(23);
  expect(headersWithBackticks[5].lineno).toBe(29);
  expect(headersWithBackticks[6].lineno).toBe(35);
});
