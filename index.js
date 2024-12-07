#!/usr/bin/env node
require('dotenv').config();
const chalk = require('chalk');

const shell = require('shelljs');
const fs = require('fs');
const { backupFiles } = require('./backup');
const figlet = require('figlet');
const path = require('path');
const os = require('os');

const displayAsciiArt = () => {
  figlet('OSWALD', (err, data) => {
    if (err) {
      console.log(chalk.greenBright('THANK YOU for installing OSWALD:', err));
      return;
    }
    console.log(chalk.blueBright(data));
  });
};
const configPath = path.join(os.homedir(), 'oswald_config.json');

const loadConfig = () => {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath));
  }
  return { email: null, networks: {} };
};

const saveConfig = (config) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};
const setupCredentials = () => {
  const config = loadConfig();
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter your email ID: ', (email) => {
    console.log(`You entered: ${email}`);
    rl.question('Confirm saving this email ID (yes/no)? ', (confirmation) => {
      if (confirmation.toLowerCase() === 'yes') {
        config.email = email;
        saveConfig(config);
        console.log(chalk.greenBright('Email ID saved successfully!'));
      } else {
        console.log(chalk.yellow('Email ID not saved.'));
      }
      rl.close();
    });
  });
};


const displayCredits = () => {
  figlet('The Goodman Code', function(err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(chalk.hex('#DC143C')(data));
    console.log(chalk.green(`
Project by:
- Soham De
- Arghya Chowdhury
- Devjyoti Bannerjee
- Sayan Genri
- Anindya Roy
`));
  });
};






const setupOswaldPipeline = () => {
  const workflowsDir = '.github/workflows';
  const OswaldWorkflowPath = `${workflowsDir}/walrus.yml`;

  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
    console.log(`Created '.github/workflows' directory.`);
    console.log("help us walrus!");
  }


  const workflowContent = `
name: Backup to WALRUS
on: [push]
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install -g oswald
      - run: oswald backupFiles
    env:
      CONTRACT_ADDRESS: \${{ secrets.CONTRACT_ADDRESS }}
      PRIVATE_KEY: \${{ secrets.PRIVATE_KEY }}
`;

  fs.writeFileSync(OswaldWorkflowPath, workflowContent);
  console.log(chalk.greenBright(`Created '${OswaldWorkflowPath}' file.`));
  console.log(`\n Now set the following secrets in your github repository: `);
  console.log(chalk.cyan(`\n CONTRACT_ADDRESS \n PRIVATE_KEY `));



};

const removeOswaldPipeline = () => {
  const workflowPath = '.github/workflows/walrus.yml';
  if (fs.existsSync(workflowPath)) {
    fs.unlinkSync(workflowPath);
    console.log(chalk.redBright('Walrus workflow removed.'));
  } else {
    console.log(chalk.yellow('No Walrus workflow found to remove.'));
  }
};

const setupSlitherArmor = () => {
  const workflowsDir = '.github/workflows';
  const slitherWorkflowPath = `${workflowsDir}/slither.yml`;

  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
    console.log(`Created '.github/workflows' directory.`);
  }

  const workflowContent = `
name: Slither Analysis
on: 
  push:
    branches: [ dev, main ]
  pull_request:
    branches: [ dev, main ]
  schedule:
    - cron: "0 7 * * 2"
jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Run Slither
        uses: crytic/slither-action@v0.4.0
        id: slither
        with:
          target: 'contracts'
          sarif: results.sarif
          fail-on: none
      - name: Upload SARIF file
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: \${{ steps.slither.outputs.sarif }}
`;

  fs.writeFileSync(slitherWorkflowPath, workflowContent);
  console.log(chalk.cyan(`Web3 armor is activated.`));
  console.log(chalk.greenBright(` \n Created '${slitherWorkflowPath}' file.`));
};

const removeSlitherArmor = () => {
  const workflowPath = '.github/workflows/slither.yml';
  if (fs.existsSync(workflowPath)) {
    fs.unlinkSync(workflowPath);
    console.log(chalk.redBright('Slither workflow removed.'));
  } else {
    console.log(chalk.yellow('No Slither workflow found to remove.'));
  }
};

const displayHelp = () => {
  displayAsciiArt();

  console.log(chalk.bold.cyan('\nWelcome to Oswald CLI Tool\n'));
  console.log(chalk.yellow('Usage:'));
  console.log(chalk.bold.white('\nGeneral Commands:'));
  console.log(chalk.blueBright(`
  oswaldcrypt help
    - Displays this help information.

  oswaldcrypt credits
    - Shows the contributors of the project.
`));

  console.log(chalk.bold.white('\nPipeline Setup Commands:'));
  console.log(chalk.blueBright(`
  oswaldcrypt setup-pipeline
    - Sets up the Walrus GitHub Actions workflow for automatic backups.
  
  oswaldcrypt remove-pipeline
    - Removes the Walrus GitHub Actions workflow.

  oswaldcrypt armor-on
    - Activates the Slither security analysis workflow for smart contracts.

  oswaldcrypt armor-off
    - Deactivates the Slither security analysis workflow.
`));

  console.log(chalk.bold.white('\nConfiguration Commands:'));
  console.log(chalk.blueBright(`
  oswaldcrypt setupcreds
    - Saves your email address for workflow notifications.

  oswaldcrypt savechain
    - Saves a new blockchain network configuration.

  oswaldcrypt deletechain
    - Deletes an existing blockchain network configuration.
`));

  console.log(chalk.bold.white('\nHardhat Integration Commands:'));
  console.log(chalk.blueBright(`
  oswaldcrypt setuphardhat <contract_name> <chain_name>
    - Creates a GitHub Actions workflow to deploy a smart contract using Hardhat.
    - Example: oswaldcrypt setuphardhat MyContract polygon
`));

  console.log(chalk.yellowBright('\nFor further details, refer to the documentation or contact support.'));
};

const saveChain = () => {
  const config = loadConfig();
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter network name: ', (networkName) => {
    rl.question('Enter network ID: ', (networkID) => {
      rl.question('Enter RPC URL: ', (rpcURL) => {
        config.networks[networkName] = { networkID, rpcURL };
        saveConfig(config);
        console.log(chalk.greenBright(`Network "${networkName}" saved successfully!`));
        rl.close();
      });
    });
  });
};
const deleteChain = () => {
  const config = loadConfig();
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log(chalk.cyan('Saved Networks:'));
  Object.keys(config.networks).forEach((network, idx) => {
    console.log(`${idx + 1}. ${network}`);
  });
  rl.question('Enter the name of the network to delete: ', (networkName) => {
    if (config.networks[networkName]) {
      delete config.networks[networkName];
      saveConfig(config);
      console.log(chalk.greenBright(`Network "${networkName}" deleted successfully!`));
    } else {
      console.log(chalk.red(`Network "${networkName}" not found.`));
    }
    rl.close();
  });
};


function createDeploymentWorkflow(contractName, chainConfig) {
  const workflowContent = `
name: Deploy Contract to ${chainConfig.networkName || 'Unnamed Network'}

on:
  push:
    branches: [ main ]

jobs:
  deploy-contract:
    runs-on: ubuntu-latest
    permissions:
      write-all: true
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy Contract
        uses: YBadiss/deploy-contract@v2
        with:
          contract-name: '${contractName}'
          parent-dir: './contracts'
          deployer-pk: \${{ secrets.PRIVATE_KEY }}
          chain-id: '${chainConfig.networkID}'
          rpc-url: '${chainConfig.rpcURL}'
          verify: false
          etherscan-url: '${chainConfig.etherscanUrl || ''}'
          etherscan-api-key: \${{ secrets.ETHERSCAN_API_KEY }}
`;

  const workflowsDir = path.resolve('.github', 'workflows');
  const workflowFilePath = path.join(workflowsDir, "deploy.yml");

  // Ensure the workflows directory exists
  fs.mkdirSync(workflowsDir, { recursive: true });

  // Write the workflow to the file
  fs.writeFileSync(workflowFilePath, workflowContent.trim());
  console.log(chalk.green(`Workflow created at ${workflowFilePath}`));
}


function setupHardhatWorkflow(contractName, chainName) {
  const configFilePath = path.join(os.homedir(), 'oswald_config.json');


  // Check if the configuration file exists
  if (!fs.existsSync(configFilePath)) {
    console.log(chalk.red('Error: Configuration file oswald_config.json not found.'));
    return;
  }

  // Read and parse the configuration file
  const configFileContent = fs.readFileSync(configFilePath, 'utf8');
  let config;
  try {
    config = JSON.parse(configFileContent);
  } catch (err) {
    console.log(chalk.red('Error: Failed to parse oswald_config.json.'));
    return;
  }

  // Check if chain details are present
  const chainConfig = config.networks[chainName];

  if (!chainConfig) {
    console.log(chalk.red(`Error: Chain details for "${chainName}" not found in oswald_config.json.`));
    return;
  }

  // Display chain details (for verification)
  console.log(chalk.green(`Using chain: ${chainName}`));
  console.log(chalk.green(`Chain ID: ${chainConfig.networkID}`));
  console.log(chalk.green(`RPC URL: ${chainConfig.rpcURL}`));

  // Generate deployment script or GitHub workflow
  createDeploymentWorkflow(contractName, chainConfig);
}



// CLI command
const command = process.argv[2];
if (command === 'setup-pipeline') {
  setupOswaldPipeline();
} else if (command === 'remove-pipeline') {
  removeOswaldPipeline();
} else if (command === 'armor-on') {
  setupSlitherArmor();
} else if (command === 'armor-off') {
  removeSlitherArmor();
} else if (command === 'setupcreds') {
  setupCredentials();
} else if (command === 'savechain') {
  saveChain();
} else if (command === 'deletechain') {
  deleteChain();
} else if (command === 'setuphardhat') {
  const contractName = process.argv[3];
  const chainName = process.argv[4];
  
  if (!contractName || !chainName) {
    console.log(chalk.red('Error: Please provide the contract name and chain name.'));
    console.log('Usage: oswald setuphardhat <contract_name> <chain_name>');
  } else {
    setupHardhatWorkflow(contractName, chainName);
  }
} else if (command === 'backupFiles') {
  backupFiles();
} else if (command === 'help') {
  displayHelp();
} else if (command === 'credits') {
  displayCredits(); 
} else {
  console.log('Unknown command. Use "oswald help" to display available commands.');
}

// changes
