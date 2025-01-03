// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IYieldProtocol {
    function deposit(address token, uint256 amount) external returns (uint256);
    function withdraw(address token, uint256 amount) external returns (uint256);
    function getAccruedInterest(address token) external view returns (uint256);
}
