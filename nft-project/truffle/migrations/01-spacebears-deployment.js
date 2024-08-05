const MyContract = artifacts.require("Spacebear");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(MyContract, accounts[0]);
};
