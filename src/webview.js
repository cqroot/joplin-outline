/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function tocItemLinkClicked(dataset) {
  webviewApi.postMessage({
    name: 'scrollToHeader',
    lineno: dataset.lineno,
    hash: dataset.slug,
  });
}

function copyInnerLink(dataset, text) {
  webviewApi.postMessage({
    name: 'contextMenu',
    hash: dataset.slug,
    content: text.trim(),
  });

  document.getElementById('header').innerHTML = 'Copy successful!';
  setTimeout(() => {
    document.getElementById('header').innerHTML = 'Outline';
  }, 800);
}

function scrollToTop() {
  webviewApi.postMessage({
    name: 'scrollToHeader',
    lineno: 1,
    hash: 'rendered-md',
  });
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
}
