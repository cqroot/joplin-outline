/* eslint-disable no-undef */
import getSlug from './markdownSlug';

test('get slug', () => {
  expect(getSlug('header')).toBe('header');
  expect(getSlug('header with space')).toBe('header-with-space');
  expect(getSlug('formula $\\frac{1}{\\pi}$')).toBe('formula');

  expect(getSlug('_header')).toBe('_header');
  expect(getSlug('__header')).toBe('__header');
  expect(getSlug('*header')).toBe('header');
  expect(getSlug('**header')).toBe('header');

  expect(getSlug('_header_')).toBe('header');
  expect(getSlug('__header__')).toBe('header');
  expect(getSlug('*header*')).toBe('header');
  expect(getSlug('**header**')).toBe('header');

  expect(getSlug('\\_header\\_')).toBe('_header_');
  expect(getSlug('\\_\\_header\\_\\_')).toBe('__header__');
  expect(getSlug('\\*header\\*')).toBe('header');
  expect(getSlug('\\*\\*header\\*\\*')).toBe('header');

  // https://github.com/cqroot/joplin-outline/pull/58
  expect(getSlug('<b>Heading2 <u>with html</u></b>')).toBe('heading2-with-html');
  expect(getSlug('Heading3 with math $\\alpha$')).toBe('heading3-with-math');
  expect(getSlug('[Heading4 with Two MD Links](#heading1) [🔗](#heading2-with-html)')).toBe('heading4-with-two-md-links-link');
  expect(getSlug('Heading5 starts with blanks')).toBe('heading5-starts-with-blanks');
  expect(getSlug('Tests of Markdown * ')).toBe('tests-of-markdown');
  expect(getSlug('***strong emph***')).toBe('strong-emph');
  expect(getSlug('***strong** in emph*')).toBe('strong-in-emph');
  expect(getSlug('***emph* in strong**')).toBe('emph-in-strong');
  expect(getSlug('**in strong *emph***')).toBe('in-strong-emph');
  expect(getSlug('*in emph **strong***')).toBe('in-emph-strong');
  expect(getSlug('*emph *with emph* in it*')).toBe('emph-with-emph-in-it');
  expect(getSlug('**strong **with strong** in it**')).toBe('strong-with-strong-in-it');
  expect(getSlug('Tests of Markdown _ ')).toBe('tests-of-markdown-_');
  expect(getSlug('___strong emph___')).toBe('strong-emph');
  expect(getSlug('___strong__ in emph_')).toBe('strong-in-emph');
  expect(getSlug('___emph_ in strong__')).toBe('emph-in-strong');
  expect(getSlug('__in strong _emph___')).toBe('in-strong-emph');
  expect(getSlug('_in emph __strong___')).toBe('in-emph-strong');
  expect(getSlug('_emph _with emph_ in it_')).toBe('emph-with-emph-in-it');
  expect(getSlug('__strong __with strong__ in it__')).toBe('strong-with-strong-in-it');
  expect(getSlug('Tests of Markdown * and _')).toBe('tests-of-markdown-and-_');
  expect(getSlug('**_strong emph_**')).toBe('strong-emph');
  expect(getSlug('*__strong__ in emph*')).toBe('strong-in-emph');
  expect(getSlug('__*emph* in strong__')).toBe('emph-in-strong');
  expect(getSlug('__in strong *emph*__')).toBe('in-strong-emph');
  expect(getSlug('_in emph **strong**_')).toBe('in-emph-strong');
  expect(getSlug('*emph _with emph_ in it*')).toBe('emph-with-emph-in-it');
  expect(getSlug('__strong **with strong** in it__')).toBe('strong-with-strong-in-it');
});
