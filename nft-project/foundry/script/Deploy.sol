pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Spacebear.sol";

contract SpacebearScript is Script {
    function setUp() public {}

    function run() public {
        string memory seedPhrase = vm.readFile(".secret");
        uint256 privateKey = vm.deriveKey(seedPhrase, 0);
        vm.startBroadcast(privateKey);
        address account0 = vm.addr(0);
        Spacebear spacebear = new Spacebear(account0);

        vm.stopBroadcast();
    }
}