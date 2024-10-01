// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract BiddingSystem {

    struct Auction {
        string name;
        uint256 startDate;
        uint256 endDate;
    }

    struct BidData{
        bytes32 commitment;
        uint256 value; 
    }

    address[] private Bidders;

    mapping(address => BidData) public biddingRecord;

    Auction public curAuction;
    uint256 constant RANDOM_NUMBER = 9876543210987654321098765432109876543210;

    modifier noBidActive(){
        require(curAuction.endDate < block.timestamp, "A bid currently is currentyly active, wait 2 minutes to lauunch your own for testing");
        _;
    }

    modifier bidActive(){
        require(curAuction.endDate > block.timestamp, "No bid is currently active, make a bid first");
        _;
    }

    modifier revealBidTimeActive(){
        require(curAuction.endDate < block.timestamp, "Bid can be revealed only after bid time has ended");
        require(curAuction.endDate + 120 > block.timestamp, "Reveal time is 2 minutes after bid time");
        _;
    }

    function createVote(string calldata _name) external noBidActive() {
        // curAuction = Auction(_name, block.timestamp, block.timestamp + 120);
        curAuction = Auction({
            name: _name,
            startDate: block.timestamp,
            endDate: block.timestamp + 120
        });
        for (uint256 i = 0; i < Bidders.length; i++) {
            delete biddingRecord[Bidders[i]];
        }
        delete Bidders;
    }

    function Bid(bytes32 _commit) external bidActive() {
        require(biddingRecord[msg.sender].commitment == bytes32(0), "Already bidded");
        biddingRecord[msg.sender] = BidData(_commit, 0);
        Bidders.push(msg.sender);
    }

    function revealBid(int _randomNumber, uint256 _value) external revealBidTimeActive() {
        require(getHash(_value, _randomNumber) == biddingRecord[msg.sender].commitment, "Invalid Reveal Value");
        biddingRecord[msg.sender].value = _value;
    }

    function getHash(uint _amount, int _randomNumber) pure public returns(bytes32){
        bytes memory combined = abi.encodePacked(RANDOM_NUMBER, _amount, _randomNumber);
        return keccak256(combined);
    }

    function getAllBids() view external returns(address[] memory, uint[] memory){
        uint[] memory _amounts = new uint[](Bidders.length);

        for(uint i = 0; i < Bidders.length; i++){
            _amounts[i] = biddingRecord[Bidders[i]].value;
        }

        return (Bidders, _amounts);
    }

    function getLastAuctionEndDate() view external returns (uint){
        return curAuction.endDate;
    }

}