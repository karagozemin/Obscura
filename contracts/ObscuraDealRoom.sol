// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC7984} from "@iexec-nox/nox-confidential-contracts/contracts/interfaces/IERC7984.sol";
import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

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
        euint256 totalCommitted;
        euint256 totalRepaid;
        euint256 totalClaimed;
    }

    struct Bid {
        bytes32 sealedBid;
        euint256 amount;
        bool claimed;
    }

    IERC7984 public immutable confidentialToken;
    Deal[] private deals;

    mapping(uint256 => mapping(address => Bid)) private bids;
    mapping(uint256 => mapping(address => bool)) private auditorAccess;

    event DealCreated(uint256 indexed dealId, address indexed issuer);
    event DealStateUpdated(uint256 indexed dealId, DealState state);
    event BidSubmitted(uint256 indexed dealId, address indexed investor, bytes32 sealedBid);
    event RepaymentSubmitted(uint256 indexed dealId, euint256 amountHandle);
    event Claimed(uint256 indexed dealId, address indexed investor, euint256 amountHandle);
    event AuditorAccessGranted(uint256 indexed dealId, address indexed auditor);

    modifier onlyIssuer(uint256 dealId) {
        require(deals[dealId].issuer == msg.sender, "Not issuer");
        _;
    }

    constructor(address confidentialTokenAddress) {
        require(confidentialTokenAddress != address(0), "Invalid token");
        confidentialToken = IERC7984(confidentialTokenAddress);
    }

    function createDeal(DealMetadata calldata metadata) external returns (uint256) {
        euint256 zero = Nox.toEuint256(0);
        Deal memory deal = Deal({
            issuer: msg.sender,
            metadata: metadata,
            state: DealState.Open,
            totalCommitted: zero,
            totalRepaid: zero,
            totalClaimed: zero
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

    function submitBid(
        uint256 dealId,
        bytes32 sealedBid,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external {
        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Funding, "Funding not open");
        Bid storage bid = bids[dealId][msg.sender];
        require(!Nox.isInitialized(bid.amount), "Bid exists");

        Nox.fromExternal(encryptedAmount, inputProof);
        euint256 transferred = confidentialToken.confidentialTransferFrom(
            msg.sender,
            address(this),
            encryptedAmount,
            inputProof
        );

        bids[dealId][msg.sender] = Bid({sealedBid: sealedBid, amount: transferred, claimed: false});
        deal.totalCommitted = Nox.add(deal.totalCommitted, transferred);
        Nox.allow(transferred, msg.sender);
        emit BidSubmitted(dealId, msg.sender, sealedBid);
    }

    function repay(
        uint256 dealId,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external onlyIssuer(dealId) {
        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Funded, "Not funded");
        euint256 repaid = confidentialToken.confidentialTransferFrom(
            msg.sender,
            address(this),
            encryptedAmount,
            inputProof
        );
        deal.totalRepaid = Nox.add(deal.totalRepaid, repaid);
        deal.state = DealState.Repaid;
        emit RepaymentSubmitted(dealId, repaid);
        emit DealStateUpdated(dealId, DealState.Repaid);
    }

    function claim(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Repaid || deal.state == DealState.Claimed, "Not repaid");
        Bid storage bid = bids[dealId][msg.sender];
        require(!bid.claimed, "Already claimed");
        require(Nox.isInitialized(bid.amount), "No bid");

        bid.claimed = true;
        deal.totalClaimed = Nox.add(deal.totalClaimed, bid.amount);
        euint256 transferred = confidentialToken.confidentialTransfer(msg.sender, bid.amount);
        emit Claimed(dealId, msg.sender, transferred);
    }

    function grantAuditorAccess(
        uint256 dealId,
        address auditor,
        address investor
    ) external onlyIssuer(dealId) {
        auditorAccess[dealId][auditor] = true;
        Bid storage bid = bids[dealId][investor];
        if (Nox.isInitialized(bid.amount)) {
            Nox.allow(bid.amount, auditor);
        }
        emit AuditorAccessGranted(dealId, auditor);
    }

    function closeDeal(uint256 dealId) external onlyIssuer(dealId) {
        deals[dealId].state = DealState.Claimed;
        emit DealStateUpdated(dealId, DealState.Claimed);
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
