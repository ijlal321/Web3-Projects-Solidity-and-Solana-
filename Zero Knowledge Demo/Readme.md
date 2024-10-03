# Zero Knowledge Demo

Welcome to the Zero Knowledge Demo! This project showcases the principles of zero-knowledge proofs using the ZoKrates library. In this demo, users can prove they know the square of a number without revealing the number itself.

## Table of Contents

1. [Live Demo](#live-demo)
2. [Overview](#overview)
3. [Smart Contract Address](#smart-contract-address)
4. [Technologies Used](#technologies-used)
5. [Getting Started](#getting-started)
6. [Usage](#usage)
7. [Contributing](#contributing)
8. [License](#license)
9. [Acknowledgments](#acknowledgments)

## Live Demo

You can explore the live demo here: [Zero Knowledge Live Demo](https://ijlal321.github.io/Web3-Projects-Solidity-and-Solana-/Zero%20Knowledge%20Demo/ZeroKnowledge-Proof/dist/)

Or watch video here: [Recorded Demo](https://youtu.be/aXm9ssYREIU)


## Overview

In this application, users will:

1. **Input a Secret**: The user will input a number whose square they know.
2. **Generate a Proof**: The application will generate a cryptographic proof that the user knows the square of the number without disclosing the number itself.
3. **Blockchain Verification**: The generated proof is sent to a blockchain smart contract for verification.
4. **Success Confirmation**: The application displays whether the verification was successful.

## Smart Contract Address

The smart contract for verification is deployed at:

```
0x06e8e912306d00407527DbF34762022BB86aDCAF
```

## Technologies Used

- **ZoKrates**: A toolbox for zkSNARKs on Ethereum, enabling the generation and verification of zero-knowledge proofs.
- **Solidity**: Smart contract programming language used for deploying the verification contract.
- **JavaScript**: Used to interact with the ZoKrates library and handle user inputs and outputs.
- **React**: For frontend and interacting with smart contract.

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/Web3-Projects-Solidity-and-Solana.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd Web3-Projects-Solidity-and-Solana/Zero\ Knowledge\ Demo/ZeroKnowledge-Proof
   ```

3. **Install dependencies** (if applicable):

   ```bash
   npm install
   ```

4. **Run the application**:

   You can use a simple HTTP server to serve the static files. If you have Python installed, you can use:

   ```bash
   npm run dev
   ```

   Then open your browser and go to `http://localhost:5173`.

## Usage

1. Enter a number in the input field.
2. Click on "Generate Proof" to create the proof.
3. The proof will be sent to the blockchain for verification.
4. The result of the verification will be displayed on the screen.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you'd like to add!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [ZoKrates](https://zokrates.github.io/introduction.html) for providing a powerful toolkit for zkSNARKs.
- Community contributions and resources that helped shape this project.

---

For any questions or support, please reach out to us. Enjoy exploring the fascinating world of zero-knowledge proofs!