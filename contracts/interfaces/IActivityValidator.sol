// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IActivityValidator {
    struct ActivityProof {
        bytes32 proofHash;
        uint256 timestamp;
        bytes signature;
    }

    function validateActivity(uint256 poolId, address user, ActivityProof calldata proof) external returns (bool);

    function validateProximity(uint256 poolId, address[] calldata users, bytes32[] calldata proofs)
        external
        returns (uint256 multiplier);
}
