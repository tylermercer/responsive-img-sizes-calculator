console.log("contentScript.js");

let minWidth, maxWidth, currentWidth;

const button = document.getElementById('start');
button.addEventListener('click', startResizing);

const iframe = document.getElementById("iframe");

iframe.src = new URL(window.location).searchParams.get('from') || 'https://www.example.com';

window.addEventListener("message", (event) => {
    if (event.data.action === "imageWidthsResult") {
        console.log("Message received in container:", event.data);
        addResultsToTable(event.data.result);
        continueResizing();
    }
});

function startResizing() {
    minWidth = document.getElementById("minWidth").value;
    maxWidth = document.getElementById("maxWidth").value;
    currentWidth = maxWidth;
    document.getElementById("iframe").width = `${currentWidth}px`;
    sendMessageToIframe();
}

function sendMessageToIframe() {
    iframe.contentWindow.postMessage({ action: "checkImageWidths" }, "*");
}

function addResultsToTable(results) {
    const tableBody = document.getElementById("resultTable").getElementsByTagName("tbody")[0];
    results.forEach(result => {
        const newRow = tableBody.insertRow();
        const srcCell = newRow.insertCell(0);
        const widthCell = newRow.insertCell(1);
        srcCell.textContent = result.src;
        widthCell.textContent = result.width;
    });
}

function continueResizing() {
    if (currentWidth > minWidth) {
        currentWidth -= 1;
        document.getElementById("iframe").width = `${currentWidth}px`;
        sendMessageToIframe();
    }
}