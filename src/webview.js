/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const OUTLINE_SEARCH_BAR_ID = 'outline-search';
const OUTLINE_SEARCH_INPUT_ID = 'outline-search-input';

let outlineSearchSavedGroups = null;
let outlineSearchMatches = [];
let outlineSearchActiveIndex = -1;

function tocItemLinkClicked(dataset) {
  webviewApi.postMessage({
    name: 'scrollToHeader',
    lineno: dataset.lineno,
    hash: dataset.slug,
  });
}

function copyInnerLink(dataset, text) {
  if (dataset === '') {
    webviewApi.postMessage({
      name: 'contextMenu',
      hash: '',
      content: '',
    });
  } else {
    webviewApi.postMessage({
      name: 'contextMenu',
      hash: dataset.slug,
      content: text.trim(),
    });
  }

  document.getElementById('header').innerHTML = 'Copy successful!';
  setTimeout(() => {
    document.getElementById('header').innerHTML = 'Outline';
  }, 800);
}

function scrollToTop() {
  webviewApi.postMessage({
    name: 'scrollToHeader',
    lineno: 0,
    hash: 'rendered-md',
  });
}

function areAllGroupsExpanded() {
  for (const group of document.querySelectorAll('[id^="toc-group-"]')) {
    if (group.style.display === 'none') return false;
  }
  return true;
}

function setAllGroupsExpanded(expanded) {
  for (const group of document.querySelectorAll('[id^="toc-group-"]')) {
    group.style.display = expanded ? 'block' : 'none';
  }
  for (const toggle of document.querySelectorAll('.toggle-button')) {
    toggle.innerHTML = expanded ? '&#9662;' : '&#9656;';
  }
}

function updateOutlineToggleAllButton() {
  const button = document.getElementById('outline-toggle-all');
  if (!button) return;

  const expanded = areAllGroupsExpanded();
  button.innerHTML = expanded ? '&#8863;' : '&#8862;';
  const tip = expanded ? 'Collapse all' : 'Expand all';
  button.setAttribute('data-tip', tip);
  button.setAttribute('aria-label', tip);
}

function toggleAllGroups() {
  const expanded = areAllGroupsExpanded();
  setAllGroupsExpanded(!expanded);
  updateOutlineToggleAllButton();
}

function setOutlineActionsVisible(visible) {
  const actions = document.querySelector('.outline-header-actions');
  if (actions) actions.style.display = visible ? 'flex' : 'none';
}

function toggleHidden(groupId) {
  const group = document.getElementById(`toc-group-${groupId}`);
  const toggleElem = document.getElementById(`toggle-${groupId}`);
  if (group.style.display === 'none') {
    group.style.display = 'block';
    toggleElem.innerHTML = '&#9662';
  } else {
    group.style.display = 'none';
    toggleElem.innerHTML = '&#9656';
  }
  updateOutlineToggleAllButton();
}

function getOutlineSearchBar() {
  return document.getElementById(OUTLINE_SEARCH_BAR_ID);
}

function getOutlineSearchInput() {
  return document.getElementById(OUTLINE_SEARCH_INPUT_ID);
}

function isOutlineSearchOpen() {
  const bar = getOutlineSearchBar();
  return !!bar && bar.style.display !== 'none';
}

function getOutlineTocItems() {
  return Array.from(document.querySelectorAll('.toc-item'));
}

// Expand every collapsible group so matches nested in collapsed sections
// are visible while searching. The previous state is restored on close.
function expandOutlineGroupsForSearch() {
  outlineSearchSavedGroups = {};
  for (const group of document.querySelectorAll('[id^="toc-group-"]')) {
    outlineSearchSavedGroups[group.id] = group.style.display;
    group.style.display = 'block';
  }
  for (const toggle of document.querySelectorAll('.toggle-button')) {
    toggle.innerHTML = '&#9662';
  }
}

function restoreOutlineGroupsAfterSearch() {
  const saved = outlineSearchSavedGroups;
  if (!saved) return;

  for (const group of document.querySelectorAll('[id^="toc-group-"]')) {
    if (Object.prototype.hasOwnProperty.call(saved, group.id)) {
      group.style.display = saved[group.id];
    }
  }
  for (const toggle of document.querySelectorAll('.toggle-button')) {
    const groupId = toggle.id.replace('toggle-', '');
    const group = document.getElementById(`toc-group-${groupId}`);
    if (group) {
      toggle.innerHTML = group.style.display === 'none' ? '&#9656' : '&#9662';
    }
  }

  outlineSearchSavedGroups = null;
  updateOutlineToggleAllButton();
}

function highlightOutlineSearchMatch(index) {
  if (outlineSearchMatches.length === 0) return;

  let nextIndex = index;
  if (nextIndex < 0) nextIndex = outlineSearchMatches.length - 1;
  if (nextIndex >= outlineSearchMatches.length) nextIndex = 0;

  outlineSearchMatches.forEach((item) => item.classList.remove('toc-match-active'));
  const item = outlineSearchMatches[nextIndex];
  item.classList.add('toc-match-active');
  outlineSearchActiveIndex = nextIndex;

  if (item.scrollIntoView) {
    item.scrollIntoView({ block: 'nearest' });
  }
}

function applyOutlineSearchFilter() {
  const input = getOutlineSearchInput();
  if (!input) return;

  const query = input.value.trim().toLowerCase();
  outlineSearchMatches = [];

  getOutlineTocItems().forEach((item) => {
    const text = (item.textContent || '').toLowerCase();
    const matched = query === '' || text.indexOf(query) !== -1;
    item.classList.toggle('toc-hidden', !matched);
    item.classList.remove('toc-match-active');
    if (matched) outlineSearchMatches.push(item);
  });

  outlineSearchActiveIndex = -1;
  if (query !== '' && outlineSearchMatches.length > 0) {
    highlightOutlineSearchMatch(0);
  }
}

function openOutlineSearch() {
  const bar = getOutlineSearchBar();
  const input = getOutlineSearchInput();
  if (!bar || !input) return;

  if (!isOutlineSearchOpen()) {
    bar.style.display = 'block';
    expandOutlineGroupsForSearch();
    setOutlineActionsVisible(false);
  }
  input.focus();
  input.select();
}

function clearOutlineSearch() {
  const input = getOutlineSearchInput();
  if (input) input.value = '';

  outlineSearchMatches = [];
  outlineSearchActiveIndex = -1;
  getOutlineTocItems().forEach((item) => {
    item.classList.remove('toc-hidden');
    item.classList.remove('toc-match-active');
  });
  restoreOutlineGroupsAfterSearch();
}

function closeOutlineSearch() {
  const bar = getOutlineSearchBar();
  clearOutlineSearch();
  if (bar) bar.style.display = 'none';
  setOutlineActionsVisible(true);
}

function toggleOutlineSearch() {
  if (isOutlineSearchOpen()) {
    closeOutlineSearch();
  } else {
    openOutlineSearch();
  }
}

function jumpOutlineSearchMatch(step) {
  if (outlineSearchMatches.length === 0) return;

  const start = outlineSearchActiveIndex < 0 ? -1 : outlineSearchActiveIndex;
  highlightOutlineSearchMatch(start + step);

  const item = outlineSearchMatches[outlineSearchActiveIndex];
  if (item && item.dataset && typeof item.dataset.lineno !== 'undefined') {
    tocItemLinkClicked(item.dataset);
  }
}

document.addEventListener('keydown', (event) => {
  const key = (event.key || '').toLowerCase();

  if ((event.ctrlKey || event.metaKey) && key === 'f') {
    event.preventDefault();
    event.stopPropagation();
    toggleOutlineSearch();
    return;
  }

  if (key === 'escape' && isOutlineSearchOpen()) {
    event.preventDefault();
    event.stopPropagation();
    closeOutlineSearch();
    return;
  }

  const onSearchInput = event.target === getOutlineSearchInput();
  if ((key === 'enter' || key === 'arrowdown' || key === 'arrowup') && onSearchInput) {
    event.preventDefault();
    event.stopPropagation();
    jumpOutlineSearchMatch(key === 'arrowup' ? -1 : 1);
  }
});

document.addEventListener('input', (event) => {
  if (event.target === getOutlineSearchInput()) {
    applyOutlineSearchFilter();
  }
});

webviewApi.onMessage((event) => {
  const message = event && event.message;
  if (message && message.name === 'toggleAll') {
    toggleAllGroups();
  }
});
