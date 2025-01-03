// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IYieldProtocol.sol";
import "./interfaces/IActivityValidator.sol";

contract FitFi is ReentrancyGuard, Ownable {
    struct Pool {
        uint256 startTime;
        uint256 endTime;
        uint256 totalDeposits;
        uint256 totalInterest;
        bool isActive;
        mapping(address => uint256) deposits;
        mapping(address => uint256) activityPoints;
        mapping(address => bool) hasWithdrawn;
    }

    IERC20 public immutable depositToken;
    IYieldProtocol public immutable yieldProtocol;
    IActivityValidator public activityValidator;

    uint256 public constant ADMIN_FEE_BPS = 500; // 5%
    uint256 public poolCounter;

    mapping(uint256 => Pool) public pools;

    event PoolCreated(uint256 indexed poolId, uint256 startTime, uint256 endTime);
    event Deposited(uint256 indexed poolId, address indexed user, uint256 amount);
    event ActivitySubmitted(uint256 indexed poolId, address indexed user, uint256 points);
    event RewardsClaimed(uint256 indexed poolId, address indexed user, uint256 amount);

    constructor(address _depositToken, address _yieldProtocol, address _activityValidator) {
        depositToken = IERC20(_depositToken);
        yieldProtocol = IYieldProtocol(_yieldProtocol);
        activityValidator = IActivityValidator(_activityValidator);
    }

    function createPool(uint256 startTime, uint256 duration) external onlyOwner {
        require(startTime > block.timestamp, "Invalid start time");

        uint256 poolId = poolCounter++;
        Pool storage pool = pools[poolId];

        pool.startTime = startTime;
        pool.endTime = startTime + duration;
        pool.isActive = true;

        emit PoolCreated(poolId, startTime, startTime + duration);
    }

    function deposit(uint256 poolId, uint256 amount) external nonReentrant {
        Pool storage pool = pools[poolId];
        require(pool.isActive, "Pool not active");
        require(block.timestamp < pool.endTime, "Pool ended");

        depositToken.transferFrom(msg.sender, address(this), amount);
        depositToken.approve(address(yieldProtocol), amount);
        yieldProtocol.deposit(address(depositToken), amount);

        pool.deposits[msg.sender] += amount;
        pool.totalDeposits += amount;

        emit Deposited(poolId, msg.sender, amount);
    }
}
