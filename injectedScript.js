(function () {
    console.log("Injectedscript!")
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
        console.log(event);
        if (event.data.action === "checkImageWidths") {
            const result = checkImageWidths();
            window.parent.postMessage({ action: "imageWidthsResult", result: result }, "*");
        }
    });
})()