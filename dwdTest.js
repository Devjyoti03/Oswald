const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration for download path
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// Your address or API base URL for blob download
const ADDRESS = "https://aggregator.walrus-testnet.walrus.space"; // replace with your actual address

// Function to download the blob and save as a zip file
async function downloadBlob(blobId) {
  const readUrl = `${ADDRESS}/v1/${blobId}`;
  const response = await axios.get(readUrl, { responseType: 'arraybuffer' });

  if (response.status !== 200) {
    throw new Error(`Failed to download blob: ${response.statusText}`);
  }

  // Determine the file path where the zip will be saved
  const zipFilePath = path.join(DOWNLOAD_DIR, `downloaded_${blobId}.zip`);

  // Write the downloaded data to a zip file
  fs.writeFileSync(zipFilePath, response.data);
  console.log(`Blob downloaded and saved as ${zipFilePath}`);

  return zipFilePath;
}

// Example usage
const blobId = "EK9h1exHtiTHc32EwAqIGLMyqvUzGYFAZFgwWm_rNfY"; // Replace with the actual Blob ID
downloadBlob(blobId)
  .then((filePath) => {
    console.log(`Blob successfully saved as zip at: ${filePath}`);
  })
  .catch((error) => {
    console.error('Error downloading blob:', error.message);
  });

