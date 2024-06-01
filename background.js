chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('content.html')
    }, (newTab) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
            if (tabId === newTab.id && changeInfo.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.scripting.executeScript({
                    target: { tabId: newTab.id },
                    func: (currentUrl) => {
                        document.getElementById('iframe').src = currentUrl;
                        document.getElementById('iframe').onload = function () {
                            const iframeWindow = document.getElementById('iframe').contentWindow;
                            iframeWindow.eval(`
                  (${injectedScript.toString()})();
                `);
                        };
                    },
                    args: [tab.url]
                });
            }
        });
    });
});

// Define the injected script as a string
const injectedScript = function () {
    // injected-script.js content goes here
    (function () {
        // Function to check the width of all images on the page
        function checkImageWidths() {
            const images = document.getElementsByTagName('img');
            const result = [];
            for (let img of images) {
                result.push({ src: img.src, width: img.width });
            }
            return result;
        }

        // Listen for messages from the parent frame
        window.addEventListener("message", (event) => {
            if (event.data.action === "checkImageWidths") {
                const result = checkImageWidths();
                window.parent.postMessage({ action: "imageWidthsResult", result: result }, "*");
            }
        });
    })();
};
