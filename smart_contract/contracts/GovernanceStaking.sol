//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";



/// @author Okura
/// @title Governance Staking
contract GovernanceStaking is Ownable {

    //contract name
    string public name = "Governance Token Staking";
    // The stakers will receive this governance token as rewards.
    ERC20 public governanceToken;

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

    event Staked( address indexed _from ,uint256 _amount);
    event UnStaked( address indexed _from ,uint256 _amount);
    event Withdrawed( address indexed _from ,uint256 _amount);

    // event which is emitted whenever user stakes 
    event Voted(address _from ,string _poll, uint256 _voteType, uint256 _voteNumber);
    // event which is emitted whenever user unstakes
    event PollCreated(string _poll, uint256 _startTime, uint256 _endTime);
    // event which is emitted whenever user withdraws rewards
    event PollClosed(string _poll);


    // index array of polls which owner submitted
    string[] public pollIds;

    // struct of Votes
    struct Votes{
        // total votes number that stakers vote with yes.
        uint256 totalYes;
        // total votes number that stakers votes with no.
        uint256 totalNo;
        // the time that poll is started
        uint256 startingTime;
        // the time that poll is closed
        uint256 endTime;
        // map of votes number that each staker votes with yes
        mapping(address => uint256) nbYesCnt;
        // map of votes number that each staker votes with no
        mapping(address => uint256) nbNoCnt;
    }

    
    // map of polls that owner submitted.
    //this contains all information of polls
    mapping(string => Votes) public votes;

    //flag whether the poll is proposed or not
    mapping(string => bool) public proposedPolls;




    constructor(ERC20 _governanceTokenAddress, ERC20 _farmingTokenAddress) payable {
        governanceToken = _governanceTokenAddress;
        farmingToken = _farmingTokenAddress;
        annualTotalSupply = uint256(10000000 * (10 ** governanceToken.decimals()));
    }


    
    // @param _pollId the name of poll
    // @param _voteType the vote type which point to Yes(1) or No(2).
    // @param _voteNumber the number of vote that staker votes.
    // @dev staker sumbit vote
    
    function submitVote(string calldata _pollId, uint256 _voteType, uint256 _voteNumber) external{
        // The stakers can only vote for proposed poll
        require(proposedPolls[_pollId], "not proposed poll");
        // the staker can only vote with equal or bigger than 1 vote number
        require(_voteNumber >= 1, "vote number must be bigger than 1");
        // the stakers can only vote for living poll
        require((block.timestamp <= votes[_pollId].endTime || votes[_pollId].endTime == 0) && (block.timestamp >= votes[_pollId].startingTime && votes[_pollId].startingTime > 0), "not voting period");

        // for yes vote
        if (_voteType == 1){
            votes[_pollId].totalYes += _voteNumber;
            votes[_pollId].nbYesCnt[msg.sender] += _voteNumber;

        }else if(_voteType ==2){    // for no vote
            votes[_pollId].totalNo += _voteNumber;
            votes[_pollId].nbNoCnt[msg.sender] += _voteNumber;
        }
        governanceToken.transferFrom(msg.sender, address(this), _voteNumber * (10** governanceToken.decimals()));
        emit Voted(msg.sender, _pollId, _voteType, _voteNumber);
    }




    // Only owner can call this
    // @param _pollId the name of poll
    // @param _startTime the time when poll is started
    // @param _endTime the time when poll is closed
    // @dev owner prose poll
    function proposePoll(string calldata _pollId, uint256 _startTime, uint256 _endTime) external onlyOwner{
        // Owner can not propose same poll as one proposed
        require(proposedPolls[_pollId] == false, "proposed poll");
        // start time must be after than today
        require(_startTime >= block.timestamp - 1 days, "start time error");
        // end time must be after than start time. Or owner don't need to set end time when proposing
        require(_endTime == 0 || (_endTime >= block.timestamp && _endTime > _startTime), "end time error");

        pollIds.push(_pollId); // add this poll to polls array.
        proposedPolls[_pollId] = true; // set this poll as proposed.
        votes[_pollId].startingTime = _startTime; // set start time of this poll
        votes[_pollId].endTime = _endTime; // set end time of this poll
        emit PollCreated(_pollId, _startTime, _endTime); // emit you that this poll was created.
    }


    // Only owner can call this
    // @param _pollId the poll name which should be closed
    // @dev close this poll
    function closePoll(string calldata _pollId) external onlyOwner{
        // Owner can close only proposed poll
        require(proposedPolls[_pollId], "not proposed poll");
        votes[_pollId].endTime = block.timestamp; // set end time of this poll
        emit PollClosed(_pollId); // emit stakers that this poll was closed.
    }


    // @param _amount the amount that staker is going to stake
    // @dev user stake tokens
    function stakeTokens(uint256 _amount) public {
        //Staking amount must be more than 0
        require(_amount > 0);
        //User adding this farming tokens
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

        // calculate rewards for last staking and add to total rewards balance
        rewardsBalance[msg.sender] += getCurrentRewards();

        // subtract amount from total staking amount
        totalStaked = totalStaked - _amount;
        // reseting users staking balance 
        stakingBalance[msg.sender] = balance - _amount;

        // set lastest staking time
        latestStakingTime[msg.sender] = block.timestamp;

        if(stakingBalance[msg.sender] == 0){    // set this user as  not staking 
            //updating staking status
            isStakingAtm[msg.sender] = false;
            if(governanceToken.balanceOf(msg.sender) > 0)
            {
                // all governance token comes back to owner(this contract).
                governanceToken.transferFrom(msg.sender, address(this), governanceToken.balanceOf(msg.sender));
                rewardsBalance[msg.sender] += 0;
            }
        }
        
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
        governanceToken.transfer(msg.sender, rewards);  // send user rewards tokens  
        latestStakingTime[msg.sender] = block.timestamp; // update latest staking time
        emit Withdrawed(msg.sender, rewards); // emit user that you successfully received rewards
    }


    // @dev calculate rewards amount for latest staking time
    function getCurrentRewards() public view returns(uint256) {
        if(totalStaked == 0){ // return 0 if anybody were not staked
            return uint256(0);
        }

        uint256 balance = stakingBalance[msg.sender];   // get staking balance
        uint256 passedTime = block.timestamp - latestStakingTime[msg.sender];   // claculate passed time
        // calculate rewards amount for passed time based on annual total supply and total staked amount
        uint256 rewards = annualTotalSupply * (balance / totalStaked) * (passedTime / uint256(365 days)) ;
        return rewards;
    }


    // @dev get total rewards
    function getRewards() public view returns(uint256) {
        return rewardsBalance[msg.sender] + getCurrentRewards();
    }

    // @dev get total count of proposed poll
    function getPollCnt() public view returns(uint256){
        return pollIds.length;
    }


    // @param _pollId the name(index) of poll
    // @dev get vote number that user voted for poll
    function getSelfVoteCnt(string calldata _pollId) public view returns(uint256, uint256){
        uint256 _nbYesCnt = votes[_pollId].nbYesCnt[msg.sender];
        uint256 _nbNoCnt = votes[_pollId].nbNoCnt[msg.sender];
        return(_nbYesCnt, _nbNoCnt);
    }


    // @dev whether poll is closed or not
    function isPollClosed(string calldata _pollId) public view returns(bool){
        return (votes[_pollId].endTime != 0 && votes[_pollId].endTime <= block.timestamp);
    }

}