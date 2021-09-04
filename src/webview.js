/* eslint-disable no-undef */
document.addEventListener('click', (event) => {
  const element = event.target;
  if (element.className === 'toc-item-link') {
    webviewApi.postMessage({
      name: 'scrollToHeader',
      lineno: element.dataset.lineno,
      hash: element.dataset.slug,
    });
  } else if (element.className === 'header') {
    webviewApi.postMessage({
      name: 'scrollToHeader',
      lineno: 1,
      hash: 'rendered-md',
    });
  }
});
document.addEventListener('contextmenu', (event) => {
  const element = event.target;
  if (element.className === 'toc-item-link') {
    webviewApi.postMessage({
      name: 'contextMenu',
      hash: element.dataset.slug,
      content: element.innerText,
    });

    document.getElementsByClassName('header')[0].innerHTML = 'Copy successful!';
    setTimeout(() => {
      document.getElementsByClassName('header')[0].innerHTML = 'Outline';
    }, 800);
  }
});
