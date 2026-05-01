// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC7984} from "@iexec-nox/nox-confidential-contracts/contracts/interfaces/IERC7984.sol";
import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import {IIdentityRegistry} from "./interfaces/IERC3643.sol";
import {IERC7540} from "./interfaces/IERC7540.sol";

/// @notice Confidential RWA deal room combining:
///   - ERC-7984: confidential token transfers (hidden bid/repayment amounts)
///   - ERC-3643: investor identity/compliance checks before bid submission
///   - ERC-7540: full async vault interface; assets/shares = 0 because amounts are euint256 handles
contract ObscuraDealRoom is IERC7540 {

    // ────────────────────────── Deal room events ────────────────────────────
    event DealCreated(uint256 indexed dealId, address indexed issuer);
    event DealStateUpdated(uint256 indexed dealId, DealState state);
    event BidSubmitted(uint256 indexed dealId, address indexed investor, bytes32 sealedBid);
    event RepaymentSubmitted(uint256 indexed dealId, euint256 amountHandle);
    event Claimed(uint256 indexed dealId, address indexed investor, euint256 amountHandle);
    event AuditorAccessGranted(uint256 indexed dealId, address indexed auditor);

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
        uint256 requestId;
    }

    // ──────────────────────────── State ─────────────────────────────────────
    IERC7984 public immutable confidentialToken;
    IIdentityRegistry public immutable identityRegistry;

    Deal[] private deals;
    uint256 private _nextRequestId;

    mapping(uint256 => mapping(address => Bid)) private bids;
    mapping(uint256 => mapping(address => bool)) private auditorAccess;
    // ERC-7540: requestId → controller → pendingAssets (always 0 for confidential, used for interface)
    mapping(uint256 => mapping(address => uint256)) private _pendingDepositRequests;
    mapping(uint256 => mapping(address => uint256)) private _claimableDepositRequests;

    modifier onlyIssuer(uint256 dealId) {
        require(deals[dealId].issuer == msg.sender, "Not issuer");
        _;
    }

    constructor(address confidentialTokenAddress, address identityRegistryAddress) {
        require(confidentialTokenAddress != address(0), "Invalid token");
        require(identityRegistryAddress != address(0), "Invalid registry");
        confidentialToken = IERC7984(confidentialTokenAddress);
        identityRegistry = IIdentityRegistry(identityRegistryAddress);
    }

    // ──────────────────────────── Deal management ────────────────────────────

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

    // ─────────────────────── ERC-7540 + ERC-7984 bid ────────────────────────

    /// @notice Submit a sealed bid with confidential amount (ERC-7540 requestDeposit pattern).
    ///         Caller must be ERC-3643 verified before submission.
    ///         Amount is confidential via ERC-7984; DepositRequest.assets is emitted as 0.
    function submitBid(
        uint256 dealId,
        bytes32 sealedBid,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external {
        // ERC-3643 compliance gate
        require(identityRegistry.isVerified(msg.sender), "ERC3643: investor not verified");

        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Funding, "Funding not open");
        Bid storage bid = bids[dealId][msg.sender];
        require(!Nox.isInitialized(bid.amount), "Bid exists");

        euint256 amount = Nox.fromExternal(encryptedAmount, inputProof);
        Nox.allow(amount, address(confidentialToken));
        euint256 transferred = confidentialToken.confidentialTransferFrom(
            msg.sender,
            address(this),
            amount
        );

        uint256 requestId = _nextRequestId++;
        bids[dealId][msg.sender] = Bid({
            sealedBid: sealedBid,
            amount: transferred,
            claimed: false,
            requestId: requestId
        });
        deal.totalCommitted = Nox.add(deal.totalCommitted, transferred);
        Nox.allow(transferred, msg.sender);

        // ERC-7540: assets=0 because amount is confidential (ERC-7984 handle stored separately)
        _pendingDepositRequests[requestId][msg.sender] = 0;
        emit DepositRequest(msg.sender, msg.sender, requestId, msg.sender, 0);
        emit BidSubmitted(dealId, msg.sender, sealedBid);
    }

    // ─────────────────────────────── Repay ──────────────────────────────────

    function repay(
        uint256 dealId,
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external onlyIssuer(dealId) {
        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Funded, "Not funded");
        euint256 amount = Nox.fromExternal(encryptedAmount, inputProof);
        Nox.allow(amount, address(confidentialToken));
        euint256 repaid = confidentialToken.confidentialTransferFrom(
            msg.sender,
            address(this),
            amount
        );
        deal.totalRepaid = Nox.add(deal.totalRepaid, repaid);
        deal.state = DealState.Repaid;
        emit RepaymentSubmitted(dealId, repaid);
        emit DealStateUpdated(dealId, DealState.Repaid);
    }

    // ───────────────────────── ERC-7540 claim/redeem ─────────────────────────

    /// @notice Claim repayment. Maps to ERC-7540 redeem request fulfilment.
    function claim(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Repaid || deal.state == DealState.Claimed, "Not repaid");
        Bid storage bid = bids[dealId][msg.sender];
        require(!bid.claimed, "Already claimed");
        require(Nox.isInitialized(bid.amount), "No bid");

        bid.claimed = true;
        deal.totalClaimed = Nox.add(deal.totalClaimed, bid.amount);
        euint256 transferred = confidentialToken.confidentialTransfer(msg.sender, bid.amount);

        // ERC-7540 redeem event
        emit RedeemRequest(msg.sender, msg.sender, bid.requestId, msg.sender, 0);
        emit Claimed(dealId, msg.sender, transferred);
    }

    // ─────────────────────────── Auditor access ──────────────────────────────

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

    // ───────────────────── ERC-7540 full interface impl ─────────────────────

    /// @notice ERC-7540 requestDeposit entry point for interface compliance.
    ///         For confidential vaults use submitBid(dealId, sealedBid, encryptedAmount, proof) directly.
    ///         assets must be 0; encrypted amount is a Nox euint256 handle passed to submitBid.
    function requestDeposit(uint256 assets, address controller, address) external returns (uint256 requestId) {
        require(assets == 0, "ERC7540: use submitBid for confidential deposits");
        requestId = _nextRequestId++;
        _pendingDepositRequests[requestId][controller] = 0;
        emit DepositRequest(controller, controller, requestId, msg.sender, 0);
    }

    /// @notice ERC-7540 requestRedeem entry point for interface compliance.
    ///         For confidential vaults use claim(dealId) directly.
    function requestRedeem(uint256 shares, address controller, address) external returns (uint256 requestId) {
        require(shares == 0, "ERC7540: use claim for confidential redeems");
        requestId = _nextRequestId++;
        emit RedeemRequest(controller, controller, requestId, msg.sender, 0);
        return requestId;
    }

    /// @notice Returns pending deposit assets. Always 0 — use getBidForInvestor for the euint256 handle.
    function pendingDepositRequest(uint256 requestId, address controller) external view returns (uint256) {
        return _pendingDepositRequests[requestId][controller];
    }

    /// @notice Returns claimable deposit assets. Always 0 for confidential vault.
    function claimableDepositRequest(uint256 requestId, address controller) external view returns (uint256) {
        return _claimableDepositRequests[requestId][controller];
    }

    /// @notice Returns pending redeem shares. Always 0 for confidential vault.
    function pendingRedeemRequest(uint256, address) external pure returns (uint256) {
        return 0;
    }

    /// @notice Returns claimable redeem shares. Always 0 for confidential vault.
    function claimableRedeemRequest(uint256, address) external pure returns (uint256) {
        return 0;
    }

    // ─────────────────────────────── Views ───────────────────────────────────

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
