// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Minimal ERC-3643 (T-REX) identity registry interface for investor compliance.
interface IIdentityRegistry {
    event IdentityRegistered(address indexed investor, bytes32 identityHash);
    event IdentityRevoked(address indexed investor);

    function registerIdentity(address investor, bytes32 identityHash) external;
    function revokeIdentity(address investor) external;
    function isVerified(address investor) external view returns (bool);
    function identity(address investor) external view returns (bytes32);
}

/// @notice ERC-3643 compliance interface for transfer-level checks.
interface ICompliance {
    function canTransfer(address from, address to, uint256 amount) external view returns (bool);
    function transferred(address from, address to, uint256 amount) external;
}
