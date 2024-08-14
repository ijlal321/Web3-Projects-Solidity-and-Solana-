const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BankAccountModule", (m) => {

  const bankAccount = m.contract("BankAccount");

  return { bankAccount };
});


// deployed on address 
// 0xf03F6E2c37a7F9F8034dD062B0Be3d95d43F67A9