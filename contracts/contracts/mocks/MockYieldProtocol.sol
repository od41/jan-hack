// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IYieldProtocol.sol";

contract MockYieldProtocol is IYieldProtocol {
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public interest;

    function deposit(address token, uint256 amount) external override returns (uint256) {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        deposits[token] += amount;
        return amount;
    }

    function withdraw(address token, uint256 amount) external override returns (uint256) {
        require(deposits[token] >= amount, "Insufficient balance");
        deposits[token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        return amount;
    }

    function getAccruedInterest(address token) external view override returns (uint256) {
        return interest[token];
    }

    // Test helper functions
    function setInterest(address token, uint256 amount) external {
        interest[token] = amount;
    }
}
