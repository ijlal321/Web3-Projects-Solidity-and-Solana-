// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract BiddingSystem {

    struct Auction {
        string name;
        uint256 startDate;
        uint256 endDate;
        string[] options;
    }

    struct BidData{
        uint256 commitment;
        uint256 message; 
    }

    address[] private 
    
    
    Biddres;

    Auction public curAuction;
    uint256 constant RANDOM_NUMBER = 9876543210987654321098765432109876543210;

    mapping(address => BidData) public biddingRecord;

    function createVote(string calldata _name, string[] calldata _options) public {
        curAuction = Auction(_name, block.timestamp, block.timestamp + 120, _options);

    }




}