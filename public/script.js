// JavaScript code to handle the form submission
document.getElementById('upload-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch('/process', {
            method: 'POST',
            body: formData
        });

        if (response.status === 200) {
            // Image processing successful
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = 'Image processing successful';

            // Parse the response to extract the PDF data
            const pdfBlob = await response.blob();

            // Create a blob URL for the PDF
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Automatically trigger the PDF download
            const downloadLink = document.createElement('a');
            downloadLink.href = pdfUrl;
            downloadLink.download = 'processed.pdf';
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            // Handle the case where image processing fails
            console.error('Image processing failed');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});
