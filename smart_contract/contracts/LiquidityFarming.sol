//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPFarming is Ownable {

    //contract name
    string public name = "LP Farming";

    // The stakers will receive this rewards token.
    ERC20 public reflectionToken;
    // Users have to stake this token to receive reward tokens.
    ERC20 public farmingToken;

    // total staked amount
    uint256 public totalStaked;

    // annual total supply of rewards token.
    uint256 public annualTotalSupply;

    // map of amount that each user staked
    mapping(address => uint256) public stakingBalance;

    // map of amount that each user have to be award.
    mapping(address => uint256) public rewardsBalance;

    // flag that user is staker for now
    mapping(address => bool) public isStakingAtm;

    // map of time that staker  staked latest
    mapping(address => uint) public latestStakingTime;

    // event which is emitted whenever user stakes 
    event Staked( address indexed _from, uint256 _amount);
    // event which is emitted whenever user unstakes
    event UnStaked( address indexed _from, uint256 _amount);
    // event which is emitted whenever user withdraws rewards
    event Withdrawed( address indexed _from, uint256 _amount);


    constructor(ERC20 _reflectionTokenAddress, ERC20 _farmingTokenAddress) payable {

        reflectionToken = _reflectionTokenAddress;
        farmingToken = _farmingTokenAddress;
        annualTotalSupply = uint256(1000 * (10 ** reflectionToken.decimals()));
    }

    
    // @param _amount the amount that staker is going to stake
    // @dev user stake tokens
    function stakeTokens(uint256 _amount) public {

        //Staking amount must be more than 0
        require(_amount > 0);
        //User adding test tokens
        farmingToken.transferFrom(msg.sender, address(this), _amount);

        // calculate rewards for last staking and add to total rewards balance
        rewardsBalance[msg.sender] += getCurrentRewards();

        // add total staking amount
        totalStaked = totalStaked + _amount;

        //updating staking balance for user by mapping
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        //updating staking status
        isStakingAtm[msg.sender] = true;
        // set latest staking time
        latestStakingTime[msg.sender] = block.timestamp;
        emit Staked(msg.sender, _amount); //emit this user that you successfully staked.
    }


    // @param _amount the amount that staker is going to unstake
    // @dev user unstake tokens
    function unstakeTokens(uint256 _amount) public {

        //get staking balance for user
        uint256 balance = stakingBalance[msg.sender];
        //staked amount should be equal or more than unstaking amount
        require(balance >= _amount);
       
        //transfer staked tokens back to user
        farmingToken.transfer(msg.sender, _amount );
        rewardsBalance[msg.sender] += getCurrentRewards();

        totalStaked = totalStaked - _amount;
        //reseting users staking balance 
        stakingBalance[msg.sender] = balance - _amount;

        // set lastest staking time
        latestStakingTime[msg.sender] = block.timestamp;

        //updating staking status
        isStakingAtm[msg.sender] = false;
        emit UnStaked(msg.sender, _amount); //emit this user that you successfully unstaked.
    }

    // @dev stakers receive rewards
    function claimRewards() public {

        uint256 balance = stakingBalance[msg.sender];
        // user can  receive rewards only when he is staker
        require(balance > 0);
        // calculate total rewards
        uint256 rewards = rewardsBalance[msg.sender] + getCurrentRewards();
        rewardsBalance[msg.sender] = 0; // set total rewards balance as 0
        reflectionToken.transfer(msg.sender, rewards); // send user rewards tokens
        latestStakingTime[msg.sender] = block.timestamp; // update latest staking time
        emit Withdrawed(msg.sender, rewards); // emit user that you successfully received rewards
    }

    // @dev calculate rewards amount for latest staking time 
    function getCurrentRewards() public view returns(uint256) {

        if(totalStaked == 0){ // return 0 if anybody were not staked
            return uint256(0);
        }
        uint256 balance = stakingBalance[msg.sender]; // get staking balance
        uint256 passedTime = block.timestamp - latestStakingTime[msg.sender]; // claculate passed time
        // calculate rewards amount for passed time based on annual total supply and total staked amount
        uint256 rewards =  annualTotalSupply * (balance  / totalStaked) * (passedTime / uint256(365 days)) ;
        return rewards;
    }

    // function that calculate total rewards amount
    function getRewards() public view returns(uint256) {
        return rewardsBalance[msg.sender] + getCurrentRewards();
    }

}