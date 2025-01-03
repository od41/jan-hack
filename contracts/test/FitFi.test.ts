import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { 
    FitFi,
    MockERC20,
    MockYieldProtocol,
    MockActivityValidator 
} from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type IActivityValidator } from "../typechain-types/contracts/interfaces/IActivityValidator";

type ActivityProof = IActivityValidator.ActivityProofStruct

describe("FitFi", function () {
    let fitFi: FitFi;
    let token: MockERC20;
    let yieldProtocol: MockYieldProtocol;
    let activityValidator: MockActivityValidator;
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    
    const WEEK: number = 7 * 24 * 60 * 60;
    const AMOUNT = ethers.parseEther("100");
    
    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        
        // Deploy mock contracts
        const MockERC20Factory = await ethers.getContractFactory("MockERC20");
        token = await MockERC20Factory.deploy();
        
        const MockYieldProtocolFactory = await ethers.getContractFactory("MockYieldProtocol");
        yieldProtocol = await MockYieldProtocolFactory.deploy();
        
        const MockActivityValidatorFactory = await ethers.getContractFactory("MockActivityValidator");
        activityValidator = await MockActivityValidatorFactory.deploy();
        
        // Deploy FitFi
        const FitFiFactory = await ethers.getContractFactory("FitFi");
        fitFi = await FitFiFactory.deploy(
            await token.getAddress(),
            await yieldProtocol.getAddress(),
            await activityValidator.getAddress()
        );
        
        // Setup initial state
        await token.mint(user1.address, AMOUNT);
        await token.mint(user2.address, AMOUNT);
    });
    
    describe("Pool Creation", function () {
        it("should create a new pool", async function () {
            const startTime = await time.latest() + 3600; // 1 hour from now
            await fitFi.createPool(startTime, WEEK);
            
            const pool = await fitFi.pools(0);
            expect(pool.startTime).to.equal(startTime);
            expect(pool.endTime).to.equal(startTime + WEEK);
            expect(pool.isActive).to.be.true;
        });
        
        it("should revert if start time is in the past", async function () {
            const startTime = await time.latest() - 3600;
            await expect(fitFi.createPool(startTime, WEEK))
                .to.be.revertedWith("Invalid start time");
        });
    });
    
    describe("Deposits", function () {
        let poolId: bigint;
        let startTime: number;
        
        beforeEach(async function () {
            startTime = await time.latest() + 3600;
            await fitFi.createPool(startTime, WEEK);
            poolId = 0n;
            
            await token.connect(user1).approve(await fitFi.getAddress(), AMOUNT);
        });
        
        it("should accept deposits", async function () {
            await fitFi.connect(user1).deposit(poolId, AMOUNT);
            
            const userDeposit = await fitFi.getUserDeposit(poolId, user1.address);
            expect(userDeposit).to.equal(AMOUNT);
        });
        
        it("should revert if pool has ended", async function () {
            await time.increaseTo(startTime + WEEK + 1);
            await expect(fitFi.connect(user1).deposit(poolId, AMOUNT))
                .to.be.revertedWith("Pool ended");
        });
    });
    
    describe("Activity Submission", function () {
        let poolId: bigint;
        let startTime: number;
        
        beforeEach(async function () {
            startTime = await time.latest() + 3600;
            await fitFi.createPool(startTime, WEEK);
            poolId = 0n;
            
            await token.connect(user1).approve(await fitFi.getAddress(), AMOUNT);
            await fitFi.connect(user1).deposit(poolId, AMOUNT);
            
            await time.increaseTo(startTime);
        });
        
        it("should accept valid activity submission", async function () {
            const proof: ActivityProof = {
                proofHash: ethers.keccak256("0x1234"),
                timestamp: BigInt(await time.latest()),
                signature: "0x"
            };
            
            await fitFi.connect(user1).submitActivity(poolId, proof, [], []);
            
            const points = await fitFi.getUserActivityPoints(poolId, user1.address);
            expect(points).to.equal(ethers.parseEther("1"));
        });
        
        it("should apply multiplier for group activity", async function () {
            const proof: ActivityProof = {
                proofHash: ethers.keccak256("0x1234"),
                timestamp: BigInt(await time.latest()),
                signature: "0x"
            };
            
            await fitFi.connect(user1).submitActivity(
                poolId,
                proof,
                [user2.address],
                [ethers.keccak256("0x5678")]
            );
            
            const points = await fitFi.getUserActivityPoints(poolId, user1.address);
            expect(points).to.equal(ethers.parseEther("2")); // 2x multiplier
        });
    });
    
    describe("Rewards and Withdrawals", function () {
        let poolId: bigint;
        let startTime: number;
        
        beforeEach(async function () {
            startTime = await time.latest() + 3600;
            await fitFi.createPool(startTime, WEEK);
            poolId = 0n;
            
            await token.connect(user1).approve(await fitFi.getAddress(), AMOUNT);
            await fitFi.connect(user1).deposit(poolId, AMOUNT);
            
            await time.increaseTo(startTime);
        });
        
        it("should calculate rewards correctly", async function () {
            const proof: ActivityProof = {
                proofHash: ethers.keccak256("0x1234"),
                timestamp: BigInt(await time.latest()),
                signature: "0x"
            };
            
            await fitFi.connect(user1).submitActivity(poolId, proof, [], []);
            
            const interest = ethers.parseEther("10");
            await yieldProtocol.setInterest(await token.getAddress(), interest);
            
            const rewards = await fitFi.calculateRewards(poolId, user1.address);
            expect(rewards).to.equal(ethers.parseEther("9.5")); // 10 - 5% admin fee
        });
        
        it("should allow withdrawal after pool ends", async function () {
            await time.increaseTo(startTime + WEEK + 1);
            
            const balanceBefore = await token.balanceOf(user1.address);
            await fitFi.connect(user1).withdraw(poolId);
            const balanceAfter = await token.balanceOf(user1.address);
            
            expect(balanceAfter - balanceBefore).to.equal(AMOUNT);
        });
        
        it("should prevent double withdrawal", async function () {
            await time.increaseTo(startTime + WEEK + 1);
            
            await fitFi.connect(user1).withdraw(poolId);
            await expect(fitFi.connect(user1).withdraw(poolId))
                .to.be.revertedWith("Already withdrawn");
        });
    });
});