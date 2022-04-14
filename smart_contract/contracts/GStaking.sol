//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GovernanceTokenStaking is Ownable {
    //contract name
    string public name = "GovernanceToken STAKING";

    IERC20 governanceToken;

    uint256 public totalStaked;

    mapping(address => uint256) public stakingBalance;

    mapping(address => bool) public isStakingAtm;

    mapping(address => uint) public latestStakingTime;

    constructor(IERC20 _tokenAddress) payable {
        governanceToken = _tokenAddress;
    }

    //stake tokens function
    function stakeTokens(uint256 _amount) public {
        //must be more than 0
        require(_amount > 0);
        //User adding test tokens
        governanceToken.transferFrom(msg.sender, address(this), _amount);
        totalStaked = totalStaked + _amount;
        //updating staking balance for user by mapping
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        //updating staking status
        isStakingAtm[msg.sender] = true;
        latestStakingTime[msg.sender] = block.timestamp;
    }


    //unstake tokens function
    function unstakeTokens() public {
        //get staking balance for user
        uint256 balance = stakingBalance[msg.sender];
        //amount should be more than 0
        require(balance > 0);
        uint256 rewards = getRewards();
        //transfer staked tokens back to user
        governanceToken.transfer(msg.sender, balance + rewards);
        totalStaked = totalStaked - balance;
        //reseting users staking balance
        stakingBalance[msg.sender] = 0;
        //updating staking status
        isStakingAtm[msg.sender] = false;
    }

    function claimRewards() public {
        uint256 balance = stakingBalance[msg.sender];

        require(balance > 0);

        uint256 rewards = getRewards();

        governanceToken.transfer(msg.sender, rewards);
        latestStakingTime[msg.sender] = block.timestamp;
    }

    function getAPY() public view returns(uint256) {
        return uint256(120);
    }

    function getRewards() public view returns(uint256) {
        uint256 balance = stakingBalance[msg.sender];
        uint256 passedTime = block.timestamp - latestStakingTime[msg.sender];
        uint256 rewards = balance * getAPY() * passedTime / uint256(365 days);
        return rewards;
    }


}