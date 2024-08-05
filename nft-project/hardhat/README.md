first deploy on local hardhat network

    Start a Local Node: Spin up a local Hardhat node by running:
    npx hardhat node

    Deploy Your Module: In a terminal at the root of your Hardhat project, deploy your module with:
    npx hardhat ignition deploy ignition/modules/Spacebear.js --network localhost

    note the address of your deployed smart contract here

    Open the Hardhat Console: In your terminal, run:
    npx hardhat console --network localhost

    Get the Contract Factory:
    const spacebear = await ethers.getContractFactory("Spacebear");

    Get the Contract Address:
    Replace 'YOUR_CONTRACT_ADDRESS' with the address of the deployed contract you noted earlier.

    const myContractAddress = 'YOUR_CONTRACT_ADDRESS';

    Attach to the Contract:
    const mySpacebear = spacebear.attach(myContractAddress);

    console.log(await mySpacebear.owner());