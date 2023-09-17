const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const app = express();

app.use(express.static('public'));

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Replace with your actual Capture Service API endpoint and token
const CAPTURE_SERVICE_API_ENDPOINT = 'https://na-1-dev.api.opentext.com/capture/cp-rest/v2/';
const CAPTURE_SERVICE_TOKEN = 'fe8c5b3ed227424f4f7f9aacc74730a57af59b5a2c4208ac835cb31259b4339b7fdf5ce48c81215fb787536c15276cfbed0d9960e0c865c5b613cefa76ca0958';

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle the form submission for image processing
app.post('/process', upload.single('image'), async (req, res) => {
  try {
    // Step 1: Get the uploaded image data from the request
    const imageBuffer = req.file.buffer;

    // Step 2: Make a POST request to the Capture Service
    const captureResponse = await axios.post(CAPTURE_SERVICE_API_ENDPOINT, imageBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `Bearer ${CAPTURE_SERVICE_TOKEN}`,
      },
    });

    // Step 3: Handle the response from the Capture Service
    if (captureResponse.status === 200) {
      // Image processing successful
      const resultDiv = '<p>Image processing successful</p>';
      resultDiv += '<a id="download-link" href="/download" download="processed.pdf">Download PDF</a>';
      res.send(resultDiv);
    } else {
      // Handle the case where image processing fails
      console.error('Image processing failed');
      res.status(500).send('<p>Image processing failed</p>');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('<p>An error occurred.</p>');
  }
});

// Serve the generated PDF for download
app.get('/download', (req, res) => {
    // Replace 'generated-pdf.pdf' with the actual path to your generated PDF file
    const filePath = 'generated-pdf.pdf';

    // Set the appropriate headers for the PDF download
    res.setHeader('Content-disposition', 'attachment; filename=processed.pdf');
    res.setHeader('Content-type', 'application/pdf');

    // Stream the PDF file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
