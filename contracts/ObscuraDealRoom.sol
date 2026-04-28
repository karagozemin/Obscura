// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20Minimal {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

contract ObscuraDealRoom {
    enum DealState {
        Open,
        Funding,
        Funded,
        Repaid,
        Claimed
    }

    struct DealMetadata {
        string title;
        string category;
        uint64 maturityDate;
        string description;
        string documentHash;
    }

    struct Deal {
        address issuer;
        DealMetadata metadata;
        DealState state;
        uint256 totalCommitted;
        uint256 totalRepaid;
        uint256 totalClaimed;
    }

    struct Bid {
        bytes32 sealedBid;
        uint256 amount;
        bool claimed;
    }

    IERC20Minimal public immutable confidentialToken;
    Deal[] private deals;

    mapping(uint256 => mapping(address => Bid)) private bids;
    mapping(uint256 => mapping(address => bool)) private auditorAccess;

    event DealCreated(uint256 indexed dealId, address indexed issuer);
    event DealStateUpdated(uint256 indexed dealId, DealState state);
    event BidSubmitted(uint256 indexed dealId, address indexed investor, bytes32 sealedBid);
    event RepaymentSubmitted(uint256 indexed dealId, uint256 amount);
    event Claimed(uint256 indexed dealId, address indexed investor, uint256 amount);
    event AuditorAccessGranted(uint256 indexed dealId, address indexed auditor);

    modifier onlyIssuer(uint256 dealId) {
        require(deals[dealId].issuer == msg.sender, "Not issuer");
        _;
    }

    constructor(address confidentialTokenAddress) {
        require(confidentialTokenAddress != address(0), "Invalid token");
        confidentialToken = IERC20Minimal(confidentialTokenAddress);
    }

    function createDeal(DealMetadata calldata metadata) external returns (uint256) {
        Deal memory deal = Deal({
            issuer: msg.sender,
            metadata: metadata,
            state: DealState.Open,
            totalCommitted: 0,
            totalRepaid: 0,
            totalClaimed: 0
        });
        deals.push(deal);
        uint256 dealId = deals.length - 1;
        emit DealCreated(dealId, msg.sender);
        return dealId;
    }

    function setFundingOpen(uint256 dealId) external onlyIssuer(dealId) {
        deals[dealId].state = DealState.Funding;
        emit DealStateUpdated(dealId, DealState.Funding);
    }

    function setFunded(uint256 dealId) external onlyIssuer(dealId) {
        deals[dealId].state = DealState.Funded;
        emit DealStateUpdated(dealId, DealState.Funded);
    }

    function submitBid(uint256 dealId, bytes32 sealedBid, uint256 amount) external {
        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Funding, "Funding not open");
        Bid storage bid = bids[dealId][msg.sender];
        require(bid.amount == 0, "Bid exists");
        require(amount > 0, "Amount required");

        require(confidentialToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        bids[dealId][msg.sender] = Bid({
            sealedBid: sealedBid,
            amount: amount,
            claimed: false
        });
        deal.totalCommitted += amount;
        emit BidSubmitted(dealId, msg.sender, sealedBid);
    }

    function repay(uint256 dealId, uint256 amount) external onlyIssuer(dealId) {
        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Funded, "Not funded");
        require(amount == deal.totalCommitted, "Amount must equal total committed");
        require(confidentialToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        deal.totalRepaid = amount;
        deal.state = DealState.Repaid;
        emit RepaymentSubmitted(dealId, amount);
        emit DealStateUpdated(dealId, DealState.Repaid);
    }

    function claim(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Repaid || deal.state == DealState.Claimed, "Not repaid");
        Bid storage bid = bids[dealId][msg.sender];
        require(!bid.claimed, "Already claimed");
        require(bid.amount > 0, "No bid");

        bid.claimed = true;
        deal.totalClaimed += bid.amount;
        require(confidentialToken.transfer(msg.sender, bid.amount), "Transfer failed");
        emit Claimed(dealId, msg.sender, bid.amount);

        if (deal.totalClaimed == deal.totalCommitted) {
            deal.state = DealState.Claimed;
            emit DealStateUpdated(dealId, DealState.Claimed);
        }
    }

    function grantAuditorAccess(uint256 dealId, address auditor) external onlyIssuer(dealId) {
        auditorAccess[dealId][auditor] = true;
        emit AuditorAccessGranted(dealId, auditor);
    }

    function getDeal(uint256 dealId) external view returns (Deal memory) {
        return deals[dealId];
    }

    function getDealsCount() external view returns (uint256) {
        return deals.length;
    }

    function getBidForInvestor(uint256 dealId, address investor) external view returns (Bid memory) {
        require(
            investor == msg.sender ||
                deals[dealId].issuer == msg.sender ||
                auditorAccess[dealId][msg.sender],
            "Not authorized"
        );
        return bids[dealId][investor];
    }

    function hasAuditorAccess(uint256 dealId, address auditor) external view returns (bool) {
        return auditorAccess[dealId][auditor];
    }
}
