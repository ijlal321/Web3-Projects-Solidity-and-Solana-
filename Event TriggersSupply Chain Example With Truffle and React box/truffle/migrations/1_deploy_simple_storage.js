const Item_Manager = artifacts.require("Item_Manager");

module.exports = function (deployer) {
  deployer.deploy(Item_Manager);
};
