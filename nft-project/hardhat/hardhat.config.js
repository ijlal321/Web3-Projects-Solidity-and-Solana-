require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
const fs = require('fs');
const path = require('path');

// Define the path to the files
const apikeyPath = path.join(__dirname, '.apikey');
const passkeyPath = path.join(__dirname, '.passkey');

// Read the contents of the files
const apikey = fs.readFileSync(apikeyPath, 'utf8').trim();
const passkey = fs.readFileSync(passkeyPath, 'utf8').trim();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${apikey}`, // or use Alchemy or another provider
      accounts: [`0x${passkey}`] // Replace YOUR_PRIVATE_KEY with your wallet private key
    }
  }
};
