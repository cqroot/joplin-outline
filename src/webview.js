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
    content: text,
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
