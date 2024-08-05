const { expect } = require("chai");
const hre = require("hardhat");

describe("Spacebear", function () {
  let spacebear;
  let accounts;

  beforeEach(async function () {
    // Get the list of accounts
    accounts = await hre.ethers.getSigners();

    // Get the contract factory
    const Spacebear = await hre.ethers.getContractFactory("Spacebear");

    // Deploy the contract with accounts[0] as the argument
    spacebear = await Spacebear.deploy(accounts[0].address);
  });

  it("should deploy the contract and check the owner", async function () {
    // Log the owner address
    console.log(await spacebear.owner());

    // Use chai assertions to verify the owner address
    expect(await spacebear.owner()).to.equal(accounts[0].address);
  });
});
