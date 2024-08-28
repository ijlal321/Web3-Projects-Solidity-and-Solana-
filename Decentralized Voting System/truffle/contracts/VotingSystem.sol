// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingSystem is Ownable {
    constructor() Ownable(msg.sender) {}

    enum organizationStatus {
        notApproved,
        approved,
        banned
    }

    struct Vote {
        string name;
        uint256 startDate;
        uint256 endDate;
        string[] options;
    }

    struct Organization {
        string name;
        address owner;
        uint256 id;
        organizationStatus status;
        address[] members;
        Vote[] votes;
    }

    mapping(uint256 => Organization) public Organizations;
    mapping(address => bool) public existingOwners;
    mapping(uint256 => mapping(uint256 => mapping(address => uint)))
        public VotesRecord; // 0 means not voted yet
    //   0                  0                  0x0000      0

    uint256 public nextOrgId;

    modifier notAnExistingOwner() {
        require(
            !existingOwners[msg.sender],
            "You cannot create more than one origanization"
        );
        _;
    }

    modifier onlyOrganizationOwner(uint256 OrganizationId) {
        require(
            Organizations[OrganizationId].owner == msg.sender,
            "only organization owner can do this action."
        );
        _;
    }

    modifier checkVoteDuration(uint256 endDate) {
        uint256 currentTime = block.timestamp;
        require(
            endDate > currentTime,
            "Vote end time cannot me less than current time "
        );
        require(
            endDate <= currentTime + 30 days,
            "Voting durating cannot be more than 30 days"
        );
        require(
            endDate > currentTime + 10 minutes,
            "Voting duration must be atleast 10 minutes "
        );
        _;
    }

    modifier validateNewOptions(string[] memory options) {
        require(
            options.length > 1,
            "provide more than 1 vote options for vote"
        );
        require(options.length < 11, "max 10 vote options are supported");
        _;
    }

    modifier isMemberofOrganization(uint organizationId) {
        bool isMember = false;
        for (
            uint i = 0;
            i < Organizations[organizationId].members.length;
            i++
        ) {
            if (Organizations[organizationId].members[i] == msg.sender) {
                isMember = true;
                break;
            }
        }
        require(isMember, "You are not a member of this organization");
        _;
    }

    modifier isNotMemberofOrganization(uint organizationId) {
        bool isMember = false;
        for (
            uint i = 0;
            i < Organizations[organizationId].members.length;
            i++
        ) {
            if (Organizations[organizationId].members[i] == msg.sender) {
                isMember = true;
                break;
            }
        }
        require(!isMember, "You are already a member of this organization");
        _;
    }

    modifier OrganizationActive(uint OrganizationId) {
        require(
            Organizations[OrganizationId].status == organizationStatus.approved,
            "Organization is not approved"
        );
        _;
    }

    modifier VoteActive(uint OrganizationId, uint voteId) {
        require(
            Organizations[OrganizationId].votes.length > voteId,
            "Vote Id not valid"
        );
        require(
            Organizations[OrganizationId].votes[voteId].endDate >
                block.timestamp,
            "Vote has been finished"
        );
        _;
    }

    modifier validVoteOption(
        uint OrganizationId,
        uint voteId,
        uint optionNr
    ) {
        require(
            optionNr != 0,
            "0 means vote not selected, once selected cannot be changed"
        );
        require(
            Organizations[OrganizationId].votes[voteId].options.length >=
                optionNr,
            "invalid option Index"
        );
        _;
    }

    modifier OrganizationExists(uint organizationId) {
        require(
            organizationId < nextOrgId,
            "Organization with this Id does not exist"
        );
        _;
    }

    event organizationCreated(address indexed organizationOwner, uint organizationId);
    event voteSubmitted(address indexed candidate, uint voteId, uint OrganizationId, uint option);

    function renounceOwnership() public view override onlyOwner {
        revert("ownership rennounce is not allowed");
    }

    function CreateOrganization(string memory name) public notAnExistingOwner {
        Organization storage newOrganization = Organizations[nextOrgId];
        newOrganization.name = name;
        newOrganization.owner = msg.sender;
        newOrganization.id = nextOrgId;
        newOrganization.status = organizationStatus.notApproved;
        emit organizationCreated(msg.sender, nextOrgId);
        nextOrgId += 1;
        existingOwners[msg.sender] = true;
    }

    function createVote(
        uint256 OrganizationId,
        string memory name,
        uint256 endDate,
        string[] memory options
    )
        public
        OrganizationExists(OrganizationId)
        onlyOrganizationOwner(OrganizationId)
        checkVoteDuration(endDate)
        validateNewOptions(options)
        OrganizationActive(OrganizationId)
    {
        Vote memory newVote = Vote(name, block.timestamp, endDate, options);
        Organizations[OrganizationId].votes.push(newVote);
    }

    function sumbitVote(
        uint OrganizationId,
        uint voteId,
        uint optionNr
    )
        public
        OrganizationExists(OrganizationId)
        isMemberofOrganization(OrganizationId)
        OrganizationActive(OrganizationId)
        VoteActive(OrganizationId, voteId)
        validVoteOption(OrganizationId, voteId, optionNr)
    {
        VotesRecord[OrganizationId][voteId][msg.sender] = optionNr;
        emit voteSubmitted(msg.sender, voteId, OrganizationId, optionNr);
    }

    function approveOrganization(
        uint OrganizationId
    ) public onlyOwner OrganizationExists(OrganizationId) {
        require(
            Organizations[OrganizationId].status ==
                organizationStatus.notApproved,
            "only unapproved organization is approved"
        );
        Organizations[OrganizationId].status = organizationStatus.approved;
    }

    function BanOrganization(
        uint OrganizationId
    ) public onlyOwner OrganizationExists(OrganizationId) {
        require(
            Organizations[OrganizationId].status !=
                organizationStatus.notApproved,
            "unapproved organization cannot be banned"
        );
        Organizations[OrganizationId].status = organizationStatus.banned;
    }

    function unBanOrganization(
        uint OrganizationId
    ) public onlyOwner OrganizationExists(OrganizationId) {
        require(
            Organizations[OrganizationId].status == organizationStatus.banned,
            "only banned organization can be unBanned"
        );
        Organizations[OrganizationId].status = organizationStatus.approved;
    }

    function becomeMember(
        uint OrganizationId
    )
        public
        OrganizationExists(OrganizationId)
        OrganizationActive(OrganizationId)
        isNotMemberofOrganization(OrganizationId)
    {
        Organizations[OrganizationId].members.push(msg.sender);
    }

    function revokeMembership(
        uint OrganizationId,
        uint memberIndex
    )
        public
        OrganizationExists(OrganizationId)
        isMemberofOrganization(OrganizationId)
    {
        require(
            Organizations[OrganizationId].members[memberIndex] == msg.sender,
            "incorrect index for member, try again"
        );
        uint arrLen = Organizations[OrganizationId].members.length;
        Organizations[OrganizationId].members[memberIndex] = Organizations[
            OrganizationId
        ].members[arrLen - 1];
        Organizations[OrganizationId].members.pop();
    }

    function getAllVoteCampaigns(
        uint OrganizationId
    ) public view OrganizationExists(OrganizationId) returns (Vote[] memory) {
        return Organizations[OrganizationId].votes;
    }

    function getAllOrganizationMembers(
        uint OrganizationId
    ) public view OrganizationExists(OrganizationId) returns (address[] memory) {
        return Organizations[OrganizationId].members;
    }

    function getAVoteSubmissions(uint OrganizationId, uint voteId) public view returns(address[] memory, uint[] memory)
    {
        address[] memory members = Organizations[OrganizationId].members;
        uint[] memory res = new uint[](members.length);
        for (uint i = 0; i < members.length; i++){
            res[i] =  VotesRecord[OrganizationId][voteId][members[i]];
        }
        return (members, res);
    }
}
