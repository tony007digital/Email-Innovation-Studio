const fileInput = document.getElementById("fileInput");
const feedback = document.getElementById("feedback");

fileInput.addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
        feedback.textContent = `Uploaded a ${file.type} file! Extracting content...`;
        processPDF(file);
    } else {
        feedback.textContent = "Please upload a PDF file.";
    }
}

function processPDF(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const typedArray = new Uint8Array(e.target.result);
        parsePDF(typedArray);
    };
    reader.readAsArrayBuffer(file);
}

function parsePDF(data) {
    const loadingTask = pdfjsLib.getDocument({data: data});
    loadingTask.promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
            page.getTextContent().then(function(textContent) {
                feedback.textContent = "Extracted Text: " + textContent.items.map(item => item.str).join(" ");
            });
        });
    });
}

