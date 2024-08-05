Certainly! Here’s an updated README with a more detailed description of the contract and a table of contents.

---

# Spacebear ERC721 Token

## Overview

`Spacebear` is an ERC721 token smart contract that leverages the OpenZeppelin Contracts library. This contract is designed to mint and manage unique, non-fungible tokens (NFTs) on the Ethereum blockchain. Each `Spacebear` token represents a distinct digital collectible, identified by a unique token ID. 

The contract includes basic functionality for minting new tokens and managing ownership, making it suitable for creating and distributing NFTs in various applications, including digital art, gaming, and collectibles.

### Key Features
- **ERC721 Compliance**: Follows the ERC721 standard for NFTs, ensuring compatibility with a wide range of tools and marketplaces.
- **Ownership Control**: Only the contract owner can mint new tokens, allowing centralized control over token creation.
- **Base URI**: Provides a base URI for fetching token metadata, which can be extended for richer metadata and integration with decentralized storage solutions.

## Table of Contents

- [Overview](#overview)
- [Features](#key-features)
- [Deployment](#deployment)
  - [Local Test Network (Ganache)](#local-test-network-ganache)
  - [Deployment on Truffle](#deployment-on-truffle)
  - [Deployment on Real Network](#deployment-on-real-network)
- [Testing](#testing)
- [Source Code Verification on Etherscan](#source-code-verification-on-etherscan)

## Deployment

### Local Test Network (Ganache)

1. **Configure Ganache:**

   Ensure your `truffle-config.js` includes the following configuration:

   ```js
   ganache: {
       host: "127.0.0.1",     // Localhost (default: none)
       port: 8545,            // Standard Ethereum port (default: none)
       network_id: "*",       // Any network (default: none)
   },
   ```

2. **Start Ganache:**

   - If globally installed: `ganache`
   - If locally installed: `npx ganache`

3. **Deploy Contract:**

   ```sh
   truffle migrate --network ganache
   ```

4. **Interact with the Contract:**

   Start the Truffle console:

   ```sh
   truffle console --network ganache
   ```

   In the console, you can perform operations such as:

   ```js
   const spacebear = await Spacebear.deployed();
   spacebear.name();
   const accounts = await web3.eth.getAccounts();
   await spacebear.safeMint(accounts[1]);
   spacebear.ownerOf(0);
   spacebear.tokenURI(0);
   .exit
   ```

### Deployment on Truffle

1. **Start Truffle Development Console:**

   ```sh
   truffle develop
   ```

2. **Deploy Contract:**

   ```sh
   migrate
   ```

3. **Interact with the Contract:**

   Use the same commands as in the Ganache console.

### Deployment on Real Network

For deployment on a test network like Sepolia:

1. **Install HDWallet Provider:**

   ```sh
   npm install @truffle/hdwallet-provider
   ```

2. **Create Secret Files:**

   ```sh
   touch .secret
   echo ".secret" >> .gitignore
   touch .infura
   echo ".infura" >> .gitignore
   ```

3. **Update `truffle-config.js`:**

   ```js
   const HDWalletProvider = require("@truffle/hdwallet-provider");
   const fs = require('fs');
   const mnemonicPhrase = fs.readFileSync(".secret").toString().trim();
   const infuraProjectID = fs.readFileSync(".infura").toString().trim();

   module.exports = {
       networks: {
           sepolia: {
               provider: () => new HDWalletProvider(mnemonicPhrase, `https://sepolia.infura.io/v3/${infuraProjectID}`),
               network_id: 11155111,
           },
       },
       // other configurations
   };
   ```

4. **Use Truffle Dashboard:**

   ```sh
   truffle dashboard
   ```

   Follow the prompts in the browser to connect with MetaMask. Deploy the contract:

   ```sh
   truffle migrate --network dashboard
   ```

## Testing

To test the contract:

1. **Install Truffle Assertions:**

   ```sh
   npm install truffle-assertions
   ```

2. **Run Tests:**

   Open Truffle console and execute:

   ```sh
   test
   ```

## Source Code Verification on Etherscan

1. **Install Verification Plugin:**

   ```sh
   npm install -D truffle-plugin-verify
   ```

2. **Update `truffle-config.js`:**

   ```js
   plugins: ['truffle-plugin-verify'],
   api_keys: {
       etherscan: fs.readFileSync('.etherscan').toString().trim()
   }
   ```

3. **Create Etherscan Secret File:**

   ```sh
   touch .etherscan
   echo ".etherscan" >> .gitignore
   ```

4. **Verify the Contract:**

   ```sh
   truffle run verify Spacebear --network dashboard
   ```

   **Verify this code at **
   https://sourcify.dev/#/lookup/0x3af6900fd04D589065e98A8C1077228D3317E31f 

---