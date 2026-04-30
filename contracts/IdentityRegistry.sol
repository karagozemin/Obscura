// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IIdentityRegistry} from "./interfaces/IERC3643.sol";

/// @notice ERC-3643-compliant on-chain identity registry.
/// Admin registers KYC-verified investor addresses with an identity hash (e.g. hash of offchain KYC doc).
contract IdentityRegistry is IIdentityRegistry {
    address public admin;

    mapping(address => bytes32) private _identities;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Zero address");
        admin = newAdmin;
    }

    /// @notice Register a KYC-verified investor. identityHash is the off-chain KYC document hash.
    function registerIdentity(address investor, bytes32 identityHash) external onlyAdmin {
        require(investor != address(0), "Zero address");
        require(identityHash != bytes32(0), "Empty hash");
        _identities[investor] = identityHash;
        emit IdentityRegistered(investor, identityHash);
    }

    /// @notice Revoke investor identity (e.g. KYC expired or sanctions hit).
    function revokeIdentity(address investor) external onlyAdmin {
        require(_identities[investor] != bytes32(0), "Not registered");
        _identities[investor] = bytes32(0);
        emit IdentityRevoked(investor);
    }

    /// @notice Returns true if investor has a registered, non-revoked identity.
    function isVerified(address investor) external view returns (bool) {
        return _identities[investor] != bytes32(0);
    }

    function identity(address investor) external view returns (bytes32) {
        return _identities[investor];
    }
}
