//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPFarming is Ownable {
    //contract name
    string public name = "LP Farming";

    ERC20 public reflectionToken;

    ERC20 public farmingToken;


    uint256 public totalStaked;

    uint256 public annualTotalSupply;

    mapping(address => uint256) public stakingBalance;

    mapping(address => uint256) public rewardsBalance;

    mapping(address => bool) public isStakingAtm;

    mapping(address => uint) public latestStakingTime;

    event Staked( address indexed ,uint256 _amount);
    event UnStaked( address indexed ,uint256 _amount);
    event Withdrawed( address indexed ,uint256 _amount);


    constructor(ERC20 _reflectionTokenAddress, ERC20 _farmingTokenAddress) payable {
        reflectionToken = _reflectionTokenAddress;
        farmingToken = _farmingTokenAddress;
        annualTotalSupply = uint256(1000 * (10 ** reflectionToken.decimals()));
    }

    //stake tokens function
    function stakeTokens(uint256 _amount) public {
        //must be more than 0
        require(_amount > 0);
        //User adding test tokens
        farmingToken.transferFrom(msg.sender, address(this), _amount);

        rewardsBalance[msg.sender] += getCurrentRewards();
        totalStaked = totalStaked + _amount;

        //updating staking balance for user by mapping
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        //updating staking status
        isStakingAtm[msg.sender] = true;
        latestStakingTime[msg.sender] = block.timestamp;
        emit Staked(msg.sender, _amount);
    }


    //unstake tokens function
    function unstakeTokens(uint256 _amount) public {
        //get staking balance for user
        uint256 balance = stakingBalance[msg.sender];
        //amount should be more than 0
        require(balance >= _amount);
       
        //transfer staked tokens back to user
        farmingToken.transfer(msg.sender, _amount );
        rewardsBalance[msg.sender] += getCurrentRewards();

        totalStaked = totalStaked - _amount;
        //reseting users staking balance 
        stakingBalance[msg.sender] = balance - _amount;


        latestStakingTime[msg.sender] = block.timestamp;

        //updating staking status
        isStakingAtm[msg.sender] = false;
        emit UnStaked(msg.sender, _amount);
    }

    function claimRewards() public {
        uint256 balance = stakingBalance[msg.sender];

        require(balance > 0);

        uint256 rewards = rewardsBalance[msg.sender] + getCurrentRewards();
        rewardsBalance[msg.sender] = 0;
        reflectionToken.transfer(msg.sender, rewards);
        latestStakingTime[msg.sender] = block.timestamp;
        emit Withdrawed(msg.sender, rewards);
    }


    function getCurrentRewards() public view returns(uint256) {
        if(totalStaked == 0){
            return uint256(0);
        }
        uint256 balance = stakingBalance[msg.sender];
        uint256 passedTime = block.timestamp - latestStakingTime[msg.sender];
        uint256 rewards = balance * annualTotalSupply / totalStaked * passedTime / uint256(365 days) ;
        return rewards;
    }

    function getRewards() public view returns(uint256) {
        return rewardsBalance[msg.sender] + getCurrentRewards();
    }

}