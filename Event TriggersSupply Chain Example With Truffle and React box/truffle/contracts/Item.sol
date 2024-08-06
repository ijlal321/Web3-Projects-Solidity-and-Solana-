
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "./Item_Manager.sol";

contract Item {
    string public _identifier;
    uint256 public _priceInWei;
    uint _index;
    Item_Manager _manager;

    constructor(string memory identifier, uint256 price, uint index, Item_Manager item_manager) {
        _identifier = identifier;
        _priceInWei = price;
        _index = index;
        _manager = item_manager;
    }

    receive() external payable {
        require(_priceInWei == msg.value, "only exact amount is accepted");
        Item_Manager(_manager).triggerPayment(_index);

    }
}
