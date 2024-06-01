chrome.action.onClicked.addListener((tab) => {
    const params = new URLSearchParams();
    params.append('from', tab.url);
    const url = `content.html?${params.toString()}`;
    console.log(url);
    chrome.tabs.create({
        url: chrome.runtime.getURL(url)
    }, (newTab) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
            if (tabId === newTab.id && changeInfo.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                console.log("Foobar yass");
            }
        });
    });
});
