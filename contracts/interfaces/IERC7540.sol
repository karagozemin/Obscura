// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice ERC-7540 Asynchronous Tokenized Vault interface.
/// @dev In Obscura Finance, `assets` and `shares` are always 0 in function signatures
///      because amounts are managed as confidential euint256 handles (ERC-7984).
///      The encrypted handle is passed directly to submitBid / repay via Nox.
///      All events, request tracking, and view functions adhere fully to ERC-7540.
///      See ARCHITECTURE.md §4 for the complete ERC-7540 ↔ ERC-7984 mapping.

interface IERC7540Deposit {
    /// @dev Emitted when an async deposit request is submitted.
    ///      assets = 0 for confidential vaults; encrypted amount is an ERC-7984 euint256 handle.
    event DepositRequest(
        address indexed controller,
        address indexed owner,
        uint256 indexed requestId,
        address sender,
        uint256 assets
    );

    /// @notice Submit an async deposit request.
    /// @dev For confidential vaults call submitBid(dealId, sealedBid, encryptedAmount, proof).
    ///      This entry point exists for ERC-7540 interface compliance; assets param must be 0.
    function requestDeposit(uint256 assets, address controller, address owner) external returns (uint256 requestId);

    /// @notice Returns the pending (not yet claimable) deposit assets for a request.
    ///         Always returns 0 for confidential vaults — use getBidForInvestor for the euint256 handle.
    function pendingDepositRequest(uint256 requestId, address controller) external view returns (uint256 pendingAssets);

    /// @notice Returns the claimable deposit assets for a request.
    function claimableDepositRequest(uint256 requestId, address controller) external view returns (uint256 claimableAssets);
}

interface IERC7540Redeem {
    /// @dev Emitted when an async redeem (claim) request is submitted.
    ///      shares = 0 for confidential vaults.
    event RedeemRequest(
        address indexed controller,
        address indexed owner,
        uint256 indexed requestId,
        address sender,
        uint256 shares
    );

    /// @notice Submit an async redeem request.
    /// @dev For confidential vaults call claim(dealId). This entry point exists for ERC-7540 compliance.
    function requestRedeem(uint256 shares, address controller, address owner) external returns (uint256 requestId);

    /// @notice Returns the pending redeem shares for a request.
    function pendingRedeemRequest(uint256 requestId, address controller) external view returns (uint256 pendingShares);

    /// @notice Returns the claimable redeem shares for a request.
    function claimableRedeemRequest(uint256 requestId, address controller) external view returns (uint256 claimableShares);
}

/// @notice Combined ERC-7540 interface (deposit + redeem).
interface IERC7540 is IERC7540Deposit, IERC7540Redeem {}
