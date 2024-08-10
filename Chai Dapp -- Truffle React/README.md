

# Chai Dapp

  

Welcome to the Chai Dapp, a decentralized application (DApp) built with Solidity smart contracts and React for tipping and messaging functionality. This application allows users to "buy chai" by sending Ether to a smart contract, which then stores their message and details on the blockchain.

  
  
## Live Showcase: Chai Dapp (Truffle & React)
https://ijlal321.github.io/Web3-Projects-Solidity-and-Solana-/Chai%20Dapp%20--%20Truffle%20React/client/build/



## Overview

  

Chai Dapp features:

-  **Smart Contract**: Handles the logic for tipping and storing messages.

-  **React Frontend**: Provides a user-friendly interface for interacting with the smart contract.

  

### Smart Contract

  

The smart contract is deployed on Seoplia Network at: [0x775437488D0B9b26A7aFD3fdFCAc3dd5724cA17b](https://etherscan.io/address/0x775437488D0B9b26A7aFD3fdFCAc3dd5724cA17b).

  

#### Contract Code

  

```solidity

// SPDX-License-Identifier: MIT

pragma  solidity >=0.7.0 <0.9.0;

  

contract chai{

  

struct  Memo{

string name;

string message;

uint timestamp;

address from;

}

  

Memo[] memos;

address  payable owner; //owner is going to receive funds

constructor(){

owner = payable(msg.sender);

}

  

function  buyChai(string  calldata  name,string  calldata  message) external  payable{

require(msg.value>0,"Please pay more than 0 ether");

owner.transfer(msg.value);

memos.push(Memo(name,message,block.timestamp,msg.sender));

}

  

function  getMemos() public  view  returns(Memo[] memory){

return memos;

}

}

```

  

### Frontend

  

The React frontend provides an interface for users to interact with the Chai smart contract. You can view the live deployment at:

  

### How to Run Locally

  

1.  **Clone the repository:**

  

```bash

git clone https://github.com/ijlal321/Web3-Projects-Solidity-and-Solana.git

cd Web3-Projects-Solidity-and-Solana/Chai Dapp -- Truffle React

```

  

2.  **Install dependencies:**

  

```bash

npm install

```

  

3.  **Start the development server:**

  

```bash

npm start

```

  

4.  **Interact with the DApp:**

  

Open your browser and go to `http://localhost:3000` to interact with the Chai Dapp.

  

### Contributing

  

Feel free to open issues or submit pull requests if you have suggestions for improvements or new features.

  

### License

  

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

  