
# Supply Chain Management System

This project is a decentralized supply chain management system built using Truffle and React Box. The smart contracts are written in Solidity, and the front-end is developed using React.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [How to Deploy](#how-to-deploy)
- [Functionality](#functionality)
- [Benefits of Blockchain in Supply Chain](#benefits-of-blockchain-in-supply-chain)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project demonstrates a supply chain management system where items can be tracked through different stages: creation, payment, and delivery. The system is implemented using smart contracts on the Ethereum blockchain, providing transparency and security.

## Features

- **Item Creation**: The owner can create new items.
- **Payment Trigger**: Users can make payments for the items.
- **Delivery Trigger**: The owner can mark items as delivered.
- **Supply Chain Tracking**: Track the status of items through different stages.

## Installation

To set up the project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/supply-chain.git
    cd supply-chain
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Compile the contracts**:
    ```bash
    truffle compile
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Ensure your MetaMask is connected to the correct network.
3. Use the interface to create items, make payments, and mark deliveries.

## How to Deploy

1. **Start Truffle Development Environment**:
    ```bash
    cd truffle
    truffle develop
    ```

2. **Deploy Contracts**:
    ```bash
    migrate
    ```
    This will deploy the contracts on a test local network. Keep it running and open a new terminal.

3. **Start the Client**:
    ```bash
    cd client
    npm start
    ```

## Functionality

- **Item Creation**: The owner can create new items by providing an identifier and price.
- **Payment Trigger**: Users can pay for the items. The payment is validated, and the item's status is updated to "paid".
- **Delivery Trigger**: The owner can mark items as delivered once payment is received. The item's status is then updated to "delivered".
- **Supply Chain Tracking**: The status of each item can be tracked through the smart contracts, ensuring transparency and accountability.

## Benefits of Blockchain in Supply Chain

- **Transparency**: All transactions and item statuses are recorded on the blockchain, providing a transparent view of the supply chain.
- **Security**: The decentralized nature of the blockchain ensures that the data is secure and tamper-proof.
- **Traceability**: Items can be easily tracked through each stage of the supply chain, reducing the chances of fraud and errors.
- **Efficiency**: Smart contracts automate many processes, reducing the need for intermediaries and speeding up transactions.

## Testing

To run the tests, use the following command:

```bash
truffle test
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT.

---
