// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/Spacebear.sol"; // Adjust the path if necessary

contract SpacebearTest is Test {
    Spacebear private spacebear;
    address private initialOwner = address(0x123);
    address private recipient = address(0x456);
    string private tokenURI = "spacebear_1.json";
    
    function setUp() public {
        spacebear = new Spacebear(initialOwner);
    }

    function testInitialOwner() public {
        assertEq(spacebear.owner(), initialOwner);
    }

    function testSafeMint() public {
        // Mint a new token
        vm.prank(initialOwner); // Impersonate the initialOwner
        spacebear.safeMint(recipient, tokenURI);

        // Check ownership
        assertEq(spacebear.ownerOf(0), recipient);

        console.log(spacebear.tokenURI(0));

    }

    function testMintingByNonOwnerFails() public {
        // Attempt to mint from a non-owner address
        vm.expectRevert();
        vm.prank(address(0x789)); // Impersonate a non-owner
        spacebear.safeMint(recipient, tokenURI);
    }
}
