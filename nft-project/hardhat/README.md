Here's the README with a table of contents and a summary of the contract, but without the contract code itself:

---

# Spacebear Smart Contract Deployment Guide

## Table of Contents

1. [Overview](#overview)
2. [Contract Summary](#contract-summary)
3. [Local Deployment](#local-deployment)
   - [Prerequisites](#prerequisites)
   - [Steps to Deploy Locally](#steps-to-deploy-locally)
4. [Deployment to Sepolia Network](#deployment-to-sepolia-network)
   - [Configuration](#configuration)
5. [Running Tests](#running-tests)
6. [Troubleshooting](#troubleshooting)
7. [Additional Resources](#additional-resources)

## Overview

This README provides instructions for deploying the Spacebear smart contract to the Sepolia test network and running tests using the Hardhat framework.

### Deployed Contract Address

- **Sepolia Network Address:** `0xB5C277B873264A49b52BB0006250Ee5a0E056151`

You can test the deployed contract using the Remix IDE. Import the contract using the address provided above.

## Contract Summary

### Title: Spacebear Contract

### Description

The Spacebear contract is a basic ERC721 implementation that represents Non-Fungible Tokens (NFTs) known as Spacebear. The contract utilizes OpenZeppelin's ERC721 and Ownable contracts to handle NFT functionality. 

### Key Features

- **ERC721 Compliance:** Implements the ERC721 standard for NFTs.
- **Ownable:** Only the contract owner can mint new tokens.
- **Base URI:** Provides a base URI for fetching token metadata.
- **Token Minting:** Allows the owner to mint new Spacebear tokens with incrementing IDs.

## Local Deployment

### Prerequisites

Ensure you have Node.js and Hardhat installed. If not, install them using the following commands:

```bash
npm install --save-dev hardhat
```

### Steps to Deploy Locally

1. **Start a Local Node:**

   Run a local Hardhat node by executing:

   ```bash
   npx hardhat node
   ```

2. **Deploy Your Module Locally:**

   Deploy the Spacebear contract to the local Hardhat network:

   ```bash
   npx hardhat ignition deploy ignition/modules/Spacebear.js --network localhost
   ```

    Note the address of your deployed smart contract for future reference.


3. **Open the Hardhat Console:**

   Run the Hardhat console for the local network:

   ```bash
   npx hardhat console --network localhost
   ```

4. **Interact with Your Contract:**

   Get the Contract Factory and attach it to the deployed contract:

   ```javascript
   /// getting instance
   const spacebear = await ethers.getContractFactory("Spacebear");
   const myContractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
   const mySpacebear = spacebear.attach(myContractAddress);
   // example interaction
   console.log(await mySpacebear.owner());
   ```

## Deployment to Sepolia Network

### Configuration

1. **Set Up API Key and Passphrase:**

   Add your Infura or Alchemy API key and wallet private key to your Hardhat configuration file.

2. **Update `hardhat.config.js`:**

   Add the following network configuration to your Hardhat config file:

   ```javascript
   module.exports = {
     networks: {
       sepolia: {
         url: `https://sepolia.infura.io/v3/${apikey}`, // or use Alchemy or another provider
         accounts: [`0x${passkey}`] // Replace with your wallet private key
       }
       // ... other network configurations
     },
     // ... other Hardhat configurations
   };
   ```

3. **Deploy to Sepolia:**

   Run the deployment command for the Sepolia network:

   ```bash
   npx hardhat ignition deploy ignition/modules/Spacebear.js --network sepolia
   ```

## Running Tests

To run tests for the Spacebear contract, execute:

```bash
npx hardhat test
```

## Troubleshooting

- **Deployment Issues:** Ensure your API key and private key are correctly set up in the Hardhat configuration file.
- **Connection Problems:** Verify your network settings and that your local node or Sepolia network is accessible.

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Remix IDE](https://remix.ethereum.org/)
- [Sepolia Network Information](https://sepolia.dev/)

Feel free to reach out if you encounter any issues or have questions about the deployment process.

---

This README is structured to guide users through the deployment and testing process effectively. Let me know if you need further modifications or additional information!