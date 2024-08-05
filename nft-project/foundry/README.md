# Foundry Installation and Setup Guide

## Table of Contents

1. [Overview](#overview)
   - [Spacebear Contract](#spacebear-contract)
2. [Installation](#installation)
3. [Using Foundry](#using-foundry)
   - [Initialize a New Project](#initialize-a-new-project)
   - [Install OpenZeppelin Contracts](#install-openzeppelin-contracts)
   - [Update Import Paths](#update-import-paths)
   - [Compile Your Contracts](#compile-your-contracts)
   - [Testing](#testing)
   - [Deploying to a Network](#deploying-to-a-network)
4. [Conclusion](#conclusion)

## Overview

This guide helps you install and set up Foundry, a development environment for Ethereum smart contracts. The example provided is a smart contract named `Spacebear`, which demonstrates how to create and manage an ERC721 token using Foundry. 

### Spacebear Contract

The `Spacebear` contract is a simple ERC721 token that includes features for minting tokens with unique URIs and a custom base URI. It extends the OpenZeppelin `ERC721` and `ERC721URIStorage` contracts and uses `Ownable` to ensure only the owner can mint new tokens.

- **Imports**:
  - `ERC721`: Base contract for the ERC721 standard.
  - `ERC721URIStorage`: Extension for managing token URIs.
  - `Ownable`: Provides ownership management.

- **Constructor**: Initializes the token with the name "Spacebear" and symbol "SBR", and sets the initial owner.

- **Base URI**: Customizes the base URI for metadata.

- **Minting**: Allows the owner to mint new tokens with unique URIs.

- **Overrides**:
  - `tokenURI()`: Returns the token URI.
  - `supportsInterface()`: Checks interface support.

## Installation

To install Foundry, follow these steps:

1. **Create a new directory for Foundry** (optional, but recommended):
   ```bash
   mkdir foundry
   cd foundry
   ```

2. **Download and execute the Foundry installation script**:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   ```

3. **Update your shell environment**:
   ```bash
   source ~/.bashrc
   ```

4. **Upgrade Foundry to the latest version**:
   ```bash
   foundryup
   ```

## Using Foundry

Once installed, Foundry provides three main commands:

- **`forge`**: For building, testing, debugging, and deploying smart contracts.
- **`anvil`**: A local Ethereum node, similar to Ganache.
- **`cast`**: Provides low-level access to smart contracts (akin to the Truffle console).

### Initialize a New Project

1. **Create a new Foundry project**:
   ```bash
   forge init .
   ```

2. **Remove existing contracts, tests, and scripts**:
   ```bash
   rm src/*.sol test/*.sol script/*.sol
   ```

3. **Commit these changes to your Git repository**:
   ```bash
   git add .
   git commit -a -m "Added spacebear contract and removed everything else"
   ```

### Install OpenZeppelin Contracts

To use OpenZeppelin contracts, install the package:

```bash
forge install openzeppelin/openzeppelin-contracts
```

### Update Import Paths

Modify your Solidity imports to match Foundry's directory structure:

```solidity
import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
```

### Compile Your Contracts

To compile your smart contracts, run:

```bash
forge build
```

### Testing

To run tests, simply write your test code and execute:

```bash
forge test
```

### Deploying to a Network

1. **Add a deployment script**: Create a new file called `Deploy.sol` in the `script` folder.

2. **Store your seed phrase securely**: Place your seed phrase in a file named `.secret` and ensure it is added to `.gitignore`.

3. **Configure environment variables**: In a file named `.env`, add the following:

   ```env
   GOERLI_RPC_URL=https://goerli.infura.io/v3/[INFURA_KEY]
   ETHERSCAN_API_KEY=...
   ```

   Replace `[INFURA_KEY]` with your Infura key and provide your Etherscan API key if you want Foundry to verify contracts directly with Etherscan.

4. **Update Foundry configuration**: Edit `foundry.toml` to include permissions for reading the `.secret` file:

   ```toml
   [profile.default]
   src = 'src'
   out = 'out'
   libs = ['lib']
   fs_permissions = [{ access = "read", path = "./"}]
   # See more config options https://github.com/foundry-rs/foundry/tree/master/config

   [rpc_endpoints]
   goerli = "${GOERLI_RPC_URL}"
   ```

5. **Set environment variables**:
   ```bash
   source .env
   ```

6. **Run the deployment script**:
   ```bash
   forge script script/Deploy.sol:SpacebearScript --broadcast --verify --rpc-url ${GOERLI_RPC_URL}
   ```

## Conclusion

You've successfully set up Foundry, initialized a project, installed dependencies, and prepared for deployment. The provided `Spacebear` contract demonstrates how to implement a basic ERC721 token with custom functionality. For more information on Foundry's configuration options, check out the [official documentation](https://github.com/foundry-rs/foundry/tree/master/config).