const Chai = artifacts.require("chai");

contract("Chai", (accounts) => {
  let chaiInstance;
  const owner = accounts[0];
  const buyer = accounts[1];
  const name = "Alice";
  const message = "This is a test message.";
  const chaiValue = web3.utils.toWei("1", "ether");

  before(async () => {
    chaiInstance = await Chai.deployed();
  });

  it("should allow a user to buy chai and transfer ether", async () => {
    const initialOwnerBalance = await web3.eth.getBalance(owner);

    await chaiInstance.buyChai(name, message, { from: buyer, value: chaiValue });

    const finalOwnerBalance = await web3.eth.getBalance(owner);
    const balanceDifference = web3.utils.toBN(finalOwnerBalance).sub(web3.utils.toBN(initialOwnerBalance));

    assert.equal(balanceDifference.toString(), chaiValue, "Ether was not transferred correctly");
  });

  it("should store a memo after buying chai", async () => {
    const memos = await chaiInstance.getMemos();
    assert.equal(memos.length, 1, "Memo was not stored");

    const memo = memos[0];
    assert.equal(memo.name, name, "Name in memo is not correct");
    assert.equal(memo.message, message, "Message in memo is not correct");
    assert.equal(memo.from, buyer, "Buyer address in memo is not correct");
  });

  it("should require a non-zero payment to buy chai", async () => {
    try {
      await chaiInstance.buyChai(name, message, { from: buyer, value: 0 });
      assert.fail("The transaction should have thrown an error");
    } catch (error) {
      assert.include(error.message, "Please pay more than 0 ether", "Error message is not correct");
    }
  });
});
