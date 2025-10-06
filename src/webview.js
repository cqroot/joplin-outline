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

  // --- Ajout pour copie directe ---
  if (text && text.trim().length > 0) {
    webviewApi.postMessage({
      name: 'copyToClipboard',
      content: text.trim(),
    });

    // Message visuel temporaire dans l’en-tête
    const header = document.getElementById('header');
    if (header) {
      header.innerHTML = 'Copy successful!';
      setTimeout(() => {
        header.innerHTML = 'Outline';
      }, 800);
    }
  }
}

function scrollToTop() {
  webviewApi.postMessage({
    name: 'scrollToHeader',
    lineno: 0,
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