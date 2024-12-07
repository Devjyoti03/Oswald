const axios = require('axios');
const { zip } = require('zip-a-folder');
const fs = require('fs');
const path = require('path');
const { utils, ethers } = require('ethers');
const os = require('os');
const { JsonRpcProvider, Wallet, Contract } = require('ethers');

// Configuration
const WALRUS_ADDRESS = process.env.WALRUS_ADDRESS || "https://publisher.walrus-testnet.walrus.space";
const EPOCHS = process.env.EPOCHS || "5";
const WEB3_FILES_PATH = process.env.WEB3_FILES_PATH || '.';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS ;
const RPC_URL = process.env.RPC_URL || 'https://rpc-amoy.polygon.technology/';
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk (adjust as necessary)

if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error('Environment variables PRIVATE_KEY and CONTRACT_ADDRESS must be set.');
  process.exit(1);
}

// Date Formatting
function getFormattedDate() {
  const today = new Date();
  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const localDateString = today.toLocaleString('en-GB', options);
  const [date, time] = localDateString.split(', ');
  const [day, month, year] = date.split('/');
  const [hour, minute, second] = time.split(':');
  return `${year}-${month}-${day}-${hour}-${minute}-${second}`;
}

const backupDir = path.join(os.homedir(), 'backups');
const archiveFileName = `backup-${getFormattedDate()}.zip`;
const ARCHIVE_PATH = path.join(backupDir, archiveFileName);

// Initialize Ethers.js
const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);
const abi = [
  {
    "inputs": [{ "internalType": "string", "name": "cid", "type": "string" }],
    "name": "addBackup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getBackups",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "cid", "type": "string" },
        ],
        "internalType": "struct BackupStorage.Backup[]",
        "name": "",
        "type": "tuple[]",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
];
const contract = new Contract(CONTRACT_ADDRESS, abi, wallet);

// Blob Upload Function (without chunking)
async function uploadBlob(data) {
  const storeUrl = `${WALRUS_ADDRESS}/v1/store?epochs=${EPOCHS}`;
  
  try {
    console.log("Uploading file...");
    const response = await axios.put(storeUrl, data, {
      headers: { 'Content-Type': 'application/octet-stream' },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to upload blob: ${response.statusText}`);
    }

    const blobId = response.data.newlyCreated.blobObject.blobId;
    console.log('Blob uploaded successfully. Blob ID:', blobId);
    return blobId;
  } catch (error) {
    console.error("Error uploading blob:", error.message);
    throw error;
  }
}


// Backup Function
async function backupFiles() {
  try {
    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // Zip the files
    await zip(WEB3_FILES_PATH, ARCHIVE_PATH);
    console.log(`Created archive: ${ARCHIVE_PATH}`);

    // Upload to Walrus
    console.log(`Uploading ${ARCHIVE_PATH} to Walrus...`);
    const fileData = fs.readFileSync(ARCHIVE_PATH);
    const blobId = await uploadBlob(fileData); // Upload without chunking
    console.log('Walrus response: Blob ID:', blobId);

    // Store metadata on the blockchain
    const gasPrice = await provider.getFeeData();
    try{

      const maxPriorityFeePerGas = ethers.utils.parseUnits('30', 'gwei');
    }
    catch(err)
    {
      console.log("thuk gaye guru");
      
      console.log()
      const maxFeePerGas = gasPrice.maxFeePerGas.add(maxPriorityFeePerGas);
      
      const txOptions = {
        gasLimit: utils.hexlify(1000000),
        maxPriorityFeePerGas,
        maxFeePerGas,
      };
      
    }
    const tx = await contract.addBackup(blobId, txOptions);
    console.log('Waiting for transaction confirmation...');
    await tx.wait();
    console.log('Backup metadata successfully stored on Polygon.');

    // Clean up
    fs.unlinkSync(ARCHIVE_PATH);
    console.log('Temporary archive deleted.');
  } catch (error) {
    console.error('Backup process failed:', error.message);
  }
}

module.exports = { backupFiles };