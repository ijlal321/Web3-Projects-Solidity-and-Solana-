# Private Auction with Commitments

This project implements a **private auction system** using commit schemes to ensure that bids are hidden during the bidding phase, allowing for a completely secure and private bidding process. The auction utilizes a **commit-reveal scheme** where participants submit commitments that conceal their bids, which are only revealed at the end of the auction.

## Table of Contents
- [Deployment and Demo](#deployment-and-demo)
  - [Smart Contract Deployment Address](#smart-contract-deployment-address)
  - [YouTube Demo](#youtube-demo)
  - [Live Application](#live-application)
- [How It Works](#how-it-works)
- [Features](#features)
- [Getting Started](#getting-started)

## Deployment and Demo

### Smart Contract Deployment Address
The auction smart contract is deployed on the Sepolia testnet at:  
[0xe3f4d3706eA9fD0DBaB51415FCd21b7c0dB8F729](https://sepolia.etherscan.io/address/0xe3f4d3706eA9fD0DBaB51415FCd21b7c0dB8F729)

### YouTube Demo
Watch the [demo on YouTube](https://youtu.be/uetRXBQVfWo) to understand how the system works.

### Live Application
Try the live version of the app [here](https://ijlal321.github.io/Web3-Projects-Solidity-and-Solana-/Private%20Auction%20with%20Commitments/client/privateAuction/dist/).

## How It Works

1. **Create Auction**:
   - Users can create a new auction, which remains open for bidding for **2 minutes**.
   
2. **Commit Phase**:
   - During the bidding phase, participants place a hidden bid by providing two inputs:
     - **Bid Amount**.
     - **Random Number** (used to make the bid secret).
   - The bid is then **committed** to the smart contract using a cryptographic hash of the bid amount and random number. This ensures no one can know the actual bid until the reveal phase.

3. **Reveal Phase**:
   - After the bidding phase ends, the reveal phase begins.
   - Participants must **reveal** their bid by submitting the original **bid amount** and **random number** used during the commit phase.
   - The smart contract validates the bid by checking if the revealed bid and random number match the previously committed hash. If valid, the bid is stored on the blockchain.

4. **Private Bidding**:
   - During the commit phase, all bids are kept private, and participants can only see the bids after the reveal phase is completed.

## Features

- **Private Commitments**: Bids are kept hidden using cryptographic commitments until the reveal phase.
- **Automatic Validation**: The smart contract automatically checks if the revealed bids match the commitments.
- **Timed Phases**: The auction has strict timing for the bidding and reveal phases, ensuring fairness and transparency.

## Getting Started

- To start a new auction, simply visit the live app, create an auction, and place your bid.
- Make sure to note your random number, as it will be required during the reveal phase.

This auction system brings complete privacy and transparency to the bidding process by ensuring no one can see or manipulate the bids before they are revealed.