//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LPFarming is Ownable {
    //contract name
    string public name = "LP Farming";

    IERC20 reflectionToken;

    IERC20 farmingToken;


    uint256 public totalStaked;

    uint256 public annualTotalSupply = 1000;

    mapping(address => uint256) public stakingBalance;

    mapping(address => uint256) public rewardsBalance;

    mapping(address => bool) public isStakingAtm;

    mapping(address => uint) public latestStakingTime;

    constructor(IERC20 _reflectionTokenAddress, IERC20 _farmingTokenAddress) payable {
        reflectionToken = _reflectionTokenAddress;
        farmingToken = _farmingTokenAddress
    }

    //stake tokens function
    function stakeTokens(uint256 _amount) public {
        //must be more than 0
        require(_amount > 0);
        //User adding test tokens
        farmingToken.transferFrom(msg.sender, address(this), _amount);
        totalStaked = totalStaked + _amount;

        rewardsBalance[msg.sender] += getRewards();
        //updating staking balance for user by mapping
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        //updating staking status
        isStakingAtm[msg.sender] = true;
        latestStakingTime[msg.sender] = block.timestamp;
    }


    //unstake tokens function
    function unstakeTokens(uint256 _amount) public {
        //get staking balance for user
        uint256 balance = stakingBalance[msg.sender];
        //amount should be more than 0
        require(balance >= _amount);
       
        //transfer staked tokens back to user
        farmingToken.transfer(msg.sender, _amount );
        totalStaked = totalStaked - _amount;
        //reseting users staking balance 
        stakingBalance[msg.sender] = balance - _amount;

        rewardsBalance[msg.sender] += getRewards();

        latestStakingTime[msg.sender] = block.timestamp;

        //updating staking status
        isStakingAtm[msg.sender] = false;
    }

    function claimRewards() public {
        uint256 balance = stakingBalance[msg.sender];

        require(balance > 0);

        uint256 rewards = rewardsBalance[msg.sender] + getRewards();

        reflectionToken.transfer(msg.sender, rewards);
        latestStakingTime[msg.sender] = block.timestamp;
    }

    function getAPY() public view returns(uint256) {
        return annualTotalSupply/totalStaked;
    }

    function getRewards() public view returns(uint256) {
        uint256 balance = stakingBalance[msg.sender];
        uint256 passedTime = block.timestamp - latestStakingTime[msg.sender];
        uint256 rewards = balance * getAPY() * passedTime / uint256(365 days);
        return rewards;
    }

}