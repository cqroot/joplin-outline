document.addEventListener('click', event => {
    const element = event.target;
    if (element.className === 'toc-item-link') {
        console.debug('TOC Plugin Webview: Sending scrollToHash message', element.dataset.slug);
        webviewApi.postMessage({
            name: 'scrollToHash',
            hash: element.dataset.slug,
        });
    }
});
document.addEventListener('contextmenu', event => {
    const element = event.target;
    if (element.className === 'toc-item-link') {
        webviewApi.postMessage({
            name: 'contextMenu',
            hash: element.dataset.slug,
            content: element.innerText
        });

        document.getElementsByClassName("header")[0].innerHTML = "Copy successfully!";
        setTimeout("document.getElementsByClassName(\"header\")[0].innerHTML = \"Outline\"", 800)
    }
});
