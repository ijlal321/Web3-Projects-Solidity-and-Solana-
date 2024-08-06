// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Item.sol";

contract Item_Manager is Ownable{
    constructor() Ownable(msg.sender){

    }

    enum SupplyChainSteps {created, paid, delivereed}

    struct S_Item { 
        SupplyChainSteps _step;
        string _identifier;
        Item _item;
    }

    mapping (uint => S_Item) public items;
    uint public index;

    event SupplyChainStep(uint index, uint step, address _address);

    function createItem(string memory identifier, uint price) public onlyOwner {
        Item newItem = new Item(identifier, price, index, this);
        items[index]._step = SupplyChainSteps.created;
        items[index]._identifier = identifier;
        items[index]._item = newItem;
        emit SupplyChainStep(index, uint(items[index]._step), address(newItem));
        index +=1;
    }

    function triggerPayment(uint _index) public payable  {
        Item curItem = items[_index]._item;
        require(address(curItem) == msg.sender, "only item contract is allowed to send transaction");
        require(items[_index]._step == SupplyChainSteps.created, "further in supply chain");
        items[_index]._step = SupplyChainSteps.paid;
        emit SupplyChainStep(_index , uint(items[_index]._step), address(curItem));
    }

    function triggerDelivery(uint _index) public onlyOwner{
        require(items[_index]._step == SupplyChainSteps.paid, "further in supply chain");
        items[_index]._step = SupplyChainSteps.delivereed;
        emit SupplyChainStep(_index , uint(items[_index]._step), address(items[_index]._item));
    }
}

