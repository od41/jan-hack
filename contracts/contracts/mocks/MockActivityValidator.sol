// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IActivityValidator.sol";

contract MockActivityValidator is IActivityValidator {
    bool public shouldValidateActivity = true;
    uint256 public proximityMultiplier = 2e18;

    function validateActivity(uint256, address, ActivityProof calldata) external view override returns (bool) {
        return shouldValidateActivity;
    }

    function validateProximity(uint256, address[] calldata, bytes32[] calldata)
        external
        view
        override
        returns (uint256)
    {
        return proximityMultiplier;
    }

    // Test helper functions
    function setShouldValidateActivity(bool _should) external {
        shouldValidateActivity = _should;
    }

    function setProximityMultiplier(uint256 _multiplier) external {
        proximityMultiplier = _multiplier;
    }
}
