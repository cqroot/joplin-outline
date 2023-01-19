/* eslint-disable no-undef */
import markdownHeaders from './markdownHeaders';

test('get markdown headers with backticks', () => {
  const headersWithBackticks = markdownHeaders(`# heading 1
\`plaintext
\`\`\`one line 3ticks\`\`\`

plaintext

# heading 1
plaintext
\`inline one-tick\`
\`\`\`one line 3ticks\`\`\`

# heading 1

\`\`\`bash
# heading 1
\`\`\`

# heading 1

\`\`\`\`\`\`
# heading 1
\`\`\`\`\`\`

# heading 1

\`\`\`
# heading 1
\`\`\`\`\`\`

# heading 1

\`\`\`\`\`\`
# heading 1
\`\`\`

# heading 1

plaintext`);

  expect(headersWithBackticks.length).toBe(7);
  expect(headersWithBackticks[0].lineno).toBe(0);
  expect(headersWithBackticks[1].lineno).toBe(6);
  expect(headersWithBackticks[2].lineno).toBe(11);
  expect(headersWithBackticks[3].lineno).toBe(17);
  expect(headersWithBackticks[4].lineno).toBe(23);
  expect(headersWithBackticks[5].lineno).toBe(29);
  expect(headersWithBackticks[6].lineno).toBe(35);
});
