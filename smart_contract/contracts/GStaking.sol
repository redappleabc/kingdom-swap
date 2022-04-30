//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPFarming is Ownable {
    //contract name
    string public name = "Governance Token Staking";

    ERC20 public governanceToken;

    ERC20 public farmingToken;


    uint256 public totalStaked;

    uint256 public annualTotalSupply;

    mapping(address => uint256) public stakingBalance;

    mapping(address => uint256) public rewardsBalance;

    mapping(address => bool) public isStakingAtm;

    mapping(address => uint) public latestStakingTime;

    event Staked( address indexed _from ,uint256 _amount);
    event UnStaked( address indexed _from ,uint256 _amount);
    event Withdrawed( address indexed _from ,uint256 _amount);


    event Voted(address _from ,string _poll, uint256 _voteType, uint256 _voteNumber);
    event PollCreated(string _poll, uint256 _startTime, uint256 _endTime);
    event PollClosed(string _poll);



    string[] public pollIds;

    struct Votes{
        uint256 totalYes;
        uint256 totalNo;
        uint256 startingTime;
        uint256 endTime;
        mapping(address => uint256) nbYesCnt;
        mapping(address => uint256) nbNoCnt;
    }

    mapping(string => Votes) public votes;
    mapping(string => bool) public proposedPolls;




    constructor(ERC20 _governanceTokenAddress, ERC20 _farmingTokenAddress) payable {
        governanceToken = _governanceTokenAddress;
        farmingToken = _farmingTokenAddress;
        annualTotalSupply = uint256(1000 * (10 ** governanceToken.decimals()));
    }


    function submitVote(string calldata _pollId, uint256 _voteType, uint256 _voteNumber) external{
        require(proposedPolls[_pollId], "not proposed poll");
        require(_voteNumber >= 1, "vote number must be bigger than 1");
        require((block.timestamp <= votes[_pollId].endTime || votes[_pollId].endTime == 0) && (block.timestamp >= votes[_pollId].startingTime && votes[_pollId].startingTime > 0), "not voting period");
        if (_voteType == 1){
            votes[_pollId].totalYes += _voteNumber;
            votes[_pollId].nbYesCnt[msg.sender] += _voteNumber;

        }else if(_voteType ==2){
            votes[_pollId].totalNo += _voteNumber;
            votes[_pollId].nbNoCnt[msg.sender] += _voteNumber;
        }
        governanceToken.transferFrom(msg.sender, address(this), _voteNumber * (10** governanceToken.decimals()));
        emit Voted(msg.sender, _pollId, _voteType, _voteNumber);
    }

    function proposePoll(string calldata _pollId, uint256 _startTime, uint256 _endTime) external onlyOwner{
        require(proposedPolls[_pollId] == false, "proposed poll");
        require(_startTime >= block.timestamp - 1 days, "start time error");
        require(_endTime == 0 || (_endTime >= block.timestamp && _endTime > _startTime), "end time error");

        pollIds.push(_pollId);
        proposedPolls[_pollId] = true;
        votes[_pollId].startingTime = _startTime;
        votes[_pollId].endTime = _endTime;
        emit PollCreated(_pollId, _startTime, _endTime);
    }

    function closePoll(string calldata _pollId) external onlyOwner{
        require(proposedPolls[_pollId], "not proposed poll");
        votes[_pollId].endTime = block.timestamp;
        emit PollClosed(_pollId);
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
        governanceToken.transfer(msg.sender, rewards);
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

    function getPollCnt() public view returns(uint256){
        return pollIds.length;
    }

    function getSelfVoteCnt(string calldata _pollId) public view returns(uint256, uint256){
        uint256 _nbYesCnt = votes[_pollId].nbYesCnt[msg.sender];
        uint256 _nbNoCnt = votes[_pollId].nbNoCnt[msg.sender];
        return(_nbYesCnt, _nbNoCnt);
    }

    function isPollClosed(string calldata _pollId) public view returns(bool){
        return (votes[_pollId].endTime != 0 && votes[_pollId].endTime <= block.timestamp);
    }

}