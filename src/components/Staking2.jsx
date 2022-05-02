import React, { useState, useEffect, useContext } from 'react';
import { gStakingContractABI, gStakingContractAddress, tokenContractABI, tokenContractAddress, reflectionTokenContractAddress } from '../utils/constants';
import { ethers } from 'ethers';
import { TransactionContext } from '../context/TransactionContext';
const { ethereum } = window;

const getStakingContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(gStakingContractAddress, gStakingContractABI, signer);
    return transactionContract;
}

const getTokenContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(tokenContractAddress, tokenContractABI, signer);
    return transactionContract;
}

const getGovernanceTokenContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(reflectionTokenContractAddress, tokenContractABI, signer);
    return transactionContract;
}

let stakingContract = {};
let tokenContract = {};
let governancetokenContract = {}






export default function Stanking2() {

    const OpenedPoll = (props) => {
        const { pollId, nbYesCnt, nbNoCnt, selfYesCnt, selfNoCnt, startTime, endTime } = props;

        return (<>
            <div className="vote-con-list">
                <div className="vote-des">
                    {pollId}
                </div>
                <div className='vote-btn-con'>
                    <div className="yes-con input-con">
                        <div className='font-normal'>
                            Total {nbYesCnt} $veKS2
                        </div>
                        <div className='font-small'>
                             You voted {selfYesCnt} $veKS2
                        </div>
                        <div>
                            <input value={yesVoteCnt[pollId]} onChange={(e) => { setYesVoteCnt({ ...yesVoteCnt, [pollId]: e.target.value }) }} type="number" placeholder='0' />
                            <button className='staking-btn' onClick={() => { submitYesVote(pollId) }}>Yes</button>
                        </div>

                    </div>
                    <div className="no-con input-con">
                        <div className='font-normal'>
                            Total {nbNoCnt} $veKS2
                        </div>
                        <div className='font-small'>
                            You voted {selfNoCnt} $veKS2
                        </div>
                        <div>
                            <input value={noVoteCnt[pollId]} onChange={(e) => { setNoVoteCnt({ ...noVoteCnt, [pollId]: e.target.value }) }} type="number" placeholder='0' />
                            <button className='staking-btn btn-no' onClick={() => { submitNoVote(pollId) }}>No</button>
                        </div>

                    </div>
                </div>
                <div className="vote-date-con">
                    <div>
                        <span className="_sp inline-block">Start date: </span> 2022.01.01
                    </div>
                    <div>
                        <span className="_sp inline-block">End date: </span> 2022.01.10
                    </div>
                </div>
            </div>
        </>)
    }

    const ClosedPoll = (props) => {
        const { pollId, nbYesCnt, nbNoCnt,  selfYesCnt, selfNoCnt } = props;
        return (
            <>
                <div className="vote-con-list closed-poll-con-list">
                    <div className="vote-des">
                        {pollId}
                    </div>
                    <div className='vote-btn-con'>
                        <div className="yes-con input-con">
                            <div className='font-normal'>
                                Total {nbYesCnt} $veKS2
                            </div>
                            <div className='font-small'>
                                You voted {selfYesCnt} $veKS2
                            </div>
                        </div>
                        <div className="no-con input-con">
                            <div className='font-normal'>
                                Total {nbNoCnt} $veKS2
                            </div>
                            <div className='font-small'>
                                You voted {selfNoCnt} $veKS2
                            </div>
                        </div>
                    </div>
                    <div className="vote-date-con">
                        <div>
                            <span className="_sp inline-block">Start date: </span> 2022.01.01
                        </div>
                        <div>
                            <span className="_sp inline-block">End date: </span> 2022.01.10
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const OnlyOwnerOpenedPoll = (props) => {
        const { pollId, nbYesCnt, nbNoCnt } = props;
        return (
            <>
                <div className="vote-con-list vote-edit-list">
                    <div className="vote-des">
                        {pollId}
                    </div>
                    <div className='vote-btn-con'>
                        <div className="yes-con input-con">
                            <div className='font-normal'>
                                {nbYesCnt} $veKS2
                            </div>
                        </div>
                        <div className="no-con input-con">
                            <div className='font-normal'>
                                {nbNoCnt} $veKS2
                            </div>
                        </div>
                        <div>
                            <button onClick={() => { closePoll(pollId) }} className='staking-btn'>Close</button>
                        </div>
                    </div>
                </div>
            </>)
    }






    const { currentAccount } = useContext(TransactionContext);
    const [stakeAmount, setStakeAmount] = useState("");
    const [unStakeAmount, setUnStakeAmount] = useState("");

    const [apy, setApy] = useState("");
    const [stakedBalance, setStakedBalance] = useState("");
    const [totalStakedBalance, setTotalStakedBalance] = useState("");
    const [rewards, setRewards] = useState("");

    const [addNewPollState, setAddNewPollState] = useState(false);

    const [newPollStartDate, setNewPollStartDate] = useState("");
    const [newPollEndDate, setNewPollEndDate] = useState("");
    const [newPollId, setNewPollId] = useState("");

    const [openedPollData, setOpenedPollData] = useState([])
    const [closedPollData, setClosedPollData] = useState([])

    const [yesVoteCnt, setYesVoteCnt] = useState([])
    const [noVoteCnt, setNoVoteCnt] = useState([])

    const [isOwner, setIsOwner] = useState(false);

    const GASS_LIMIT = 285000;







    const fetchData = async () => {
        const stakingBalance = ethers.utils.formatEther(await stakingContract.stakingBalance(currentAccount));
        const totalStakingBalance = ethers.utils.formatEther(await stakingContract.totalStaked());
        const annualTotalSupply = ethers.utils.formatEther(await stakingContract.annualTotalSupply());
        const rewardsAmount = ethers.utils.formatEther(await stakingContract.getRewards());

        if (totalStakingBalance > 0)
            setApy(annualTotalSupply / totalStakingBalance * 100);
        else
            setApy(0)
        setStakedBalance(stakingBalance)
        setTotalStakedBalance(totalStakingBalance)
        setRewards(rewardsAmount)
        setStakeAmount("")
        setUnStakeAmount("")

    }

    const fetchPollData = async () => {

        const _owner = (await stakingContract.owner());
        if (_owner.toUpperCase() == currentAccount.toUpperCase()) {
            console.log("you are owner")
            setIsOwner(true);
        }


        const pollCnt = (await stakingContract.getPollCnt());
        let _openedPollDataArray = [];
        let _closedPollDataArray = [];

        for (var i = 0; i < pollCnt; i++) {
            let pollData = {}
            const _pollId = (await stakingContract.pollIds(i));
            const _vote = (await stakingContract.votes(_pollId))
            const [_selfYesVoteCnt, _selfNoVoteCnt] = (await stakingContract.getSelfVoteCnt(_pollId));
            const _isPollClosed = (await stakingContract.isPollClosed(_pollId));

            pollData.pollId = _pollId;
            pollData.totalYesCnt = _vote[0].toString();
            pollData.totalNoCnt = _vote[1].toString();
            pollData.startTime = _vote[2].toString();
            pollData.endTime = _vote[3].toString();
            pollData.selfYesCnt = _selfYesVoteCnt.toString();
            pollData.selfNoCnt = _selfNoVoteCnt.toString();
            pollData.isPollClosed = _isPollClosed;
            if (_isPollClosed) {
                _closedPollDataArray.push(pollData)
            } else {
                _openedPollDataArray.push(pollData);
            }
        }
        console.log(_openedPollDataArray);
        console.log(_closedPollDataArray)
        setOpenedPollData(_openedPollDataArray);
        setClosedPollData(_closedPollDataArray);

    }


    const submitYesVote = async (_pollId) => {
        console.log(_pollId)
        console.log(yesVoteCnt[_pollId])

        let convertToWei = ethers.utils.parseEther(yesVoteCnt[_pollId]);
        console.log(convertToWei.toString())


        await governancetokenContract.approve(gStakingContractAddress, convertToWei).then((res) => {
            console.log(gStakingContractAddress);
        })


        await stakingContract.submitVote(_pollId, 1, yesVoteCnt[_pollId], {
            gasLimit: GASS_LIMIT,
        })
            .then((res) => {
                console.log(res);
            })

    }

    const submitNoVote = async (_pollId) => {
        console.log(_pollId)
        console.log(noVoteCnt[_pollId])

        let convertToWei = ethers.utils.parseEther(noVoteCnt[_pollId]);
        console.log(convertToWei.toString())


        await governancetokenContract.approve(gStakingContractAddress, convertToWei).then((res) => {
            console.log(gStakingContractAddress);
        })


        await stakingContract.submitVote(_pollId, 2, noVoteCnt[_pollId], {
            gasLimit: GASS_LIMIT,
        })
            .then((res) => {
                console.log(res);
            })

    }

    const proposePoll = async () => {
        if ( newPollStartDate == "" || newPollId == "") {
            alert("input error")
            return;
        }
       
        const newPollStartDateSeconds = Date.parse((new Date(newPollStartDate)).toUTCString()) / 1000
        let newPollEndDateSeconds;
        if(newPollEndDate == ""){
            newPollEndDateSeconds = 0;
        }else{
            newPollEndDateSeconds = Date.parse((new Date(newPollEndDate)).toUTCString()) / 1000
        }
         
        console.log(newPollId)
        console.log(newPollStartDateSeconds)
        console.log(newPollEndDateSeconds)

        await stakingContract.proposePoll(newPollId, ethers.BigNumber.from(newPollStartDateSeconds), ethers.BigNumber.from(newPollEndDateSeconds), {
            gasLimit: GASS_LIMIT,
        })

        setNewPollId("")
        setNewPollStartDate("")
        setNewPollEndDate("")
    }

    const closePoll = async (pollId) => {
        await stakingContract.closePoll(pollId,
            {
                gasLimit: GASS_LIMIT,
            })
    }




    useEffect(() => {
        stakingContract = getStakingContract();
        tokenContract = getTokenContract();
        governancetokenContract = getGovernanceTokenContract()



        if (currentAccount !== "") {
            stakingContract.on("Staked", (address, amount) => {
                fetchData();
            });

            stakingContract.on("UnStaked", (address, amount) => {
                fetchData();
            });

            stakingContract.on("Withdrawed", (address, amount) => {
                fetchData();
            });
            stakingContract.on("Voted", (address, pollId, voteType, voteNumber) => {
                fetchPollData();
            });
            stakingContract.on("PollCreated", (pollId, startTime, endTime) => {
                fetchPollData();
            });
            stakingContract.on("PollClosed", (pollId) => {
                fetchPollData();
                console.log("poll closed")
            });

            fetchData();
            fetchPollData();
        }
    }, [currentAccount])


    const toggleAddNewPoll = () => {
        setAddNewPollState(!addNewPollState);
    }


    const confirmStaking = async () => {
        let convertToWei = ethers.utils.parseEther(stakeAmount);
        console.log(convertToWei.toString())


        await tokenContract.approve(gStakingContractAddress, convertToWei).then((res) => {
            console.log(gStakingContractAddress);
        })


        await stakingContract.stakeTokens(convertToWei, {
            gasLimit: GASS_LIMIT,
        })
            .then((res) => {
                console.log(res);
            })
    }



    const confirmUnStaking = async () => {
        let convertToWei = ethers.utils.parseEther(unStakeAmount);

        await stakingContract.unstakeTokens(convertToWei, {
            gasLimit: GASS_LIMIT,
        })
            .then((res) => {
                console.log(res);
            })
    }

    const confirmWithdraw = async () => {
        await stakingContract.claimRewards({
            gasLimit: GASS_LIMIT,
        })
            .then((res) => {
                console.log(res);
            })
    }


    return (
        <>
            <div className="staking section-padding-top">
                <div className="content">
                    <div className="staking-main">
                        <div className="staking-con">
                            <div className="staking-con-main">
                                <div className='sec1'>
                                    <div>
                                        <div className='staking-con-main-sec'>
                                            <span className='staking-main-text'>Total Staking Amount</span>
                                            <span className='staking-sub-text'>{totalStakedBalance}  $KS2</span>
                                        </div>
                                        <div className='staking-con-main-sec'>
                                            <span className='staking-main-text'>APY</span>
                                            <span className='staking-sub-text'>{apy}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='staking-con-main-sec'>
                                            <span className='staking-main-text'>Your Staking Amount</span>
                                            <span className='staking-sub-text'>{stakedBalance}  $KS2</span>
                                        </div>
                                        <div className='staking-con-main-sec'>
                                            <span className='staking-main-text'>Your Reward Amount</span>
                                            <span className='staking-sub-text'>{rewards}  $veKS2</span>
                                        </div>
                                    </div>

                                </div>
                                <div className='sec3'>
                                    <div>
                                        <div>
                                            <input type="number" onChange={(e) => { setStakeAmount(e.target.value); }} name="stake" id="" placeholder='0' />
                                            <button className='staking-btn' onClick={confirmStaking}>Stake</button>
                                        </div>
                                        <div>
                                            <input type="number" onChange={(e) => { setUnStakeAmount(e.target.value); }} name="unstake" id="" placeholder='0' />
                                            <button className='staking-btn' onClick={confirmUnStaking}>Unstake</button>
                                        </div>
                                    </div>
                                    <div>
                                        <button className='staking-btn' onClick={confirmWithdraw}>Withdraw</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="vote-container user-vote">
                <div className="vote-header">
                    Welcome! Please vote here
                </div>
                <div className="vote-con-main">
                    <div className="vote-con-header">
                        <div>
                            Poll
                        </div>
                        <div>
                            <div>
                                YES
                            </div>
                            <div>
                                NO
                            </div>
                        </div>
                        <div>
                            <div>
                                Start Date
                            </div>
                            <div>
                                End Date
                            </div>
                        </div>
                    </div>
                    {openedPollData.map((pollData) => (
                        <OpenedPoll pollId={pollData.pollId} nbYesCnt={pollData.totalYesCnt} nbNoCnt={pollData.totalNoCnt} selfYesCnt = {pollData.selfYesCnt} selfNoCnt ={pollData.selfNoCnt} startTime = {pollData.startTime} endTime={pollData.endTime} key={pollData.pollId} />
                    ))}

                    <div className="vote-header vote-sub-title font-subtitle">
                        Closed Poll
                    </div>

                    {closedPollData.map((pollData) => (
                        <ClosedPoll pollId={pollData.pollId} nbYesCnt={pollData.totalYesCnt} nbNoCnt={pollData.totalNoCnt}  selfYesCnt = {pollData.selfYesCnt} selfNoCnt ={pollData.selfNoCnt} key={pollData.pollId} />
                    ))}

                </div>
            </div>
            {
                isOwner ? (
                    <div className="vote-container user-vote">
                        <div className="vote-header">
                            Please Edit Poll
                        </div>
                        <div className="add-new-btn">
                            <button className='staking-btn' onClick={toggleAddNewPoll}>{addNewPollState ? "Close" : "Add New"}</button>
                        </div>
                        <div className={`add-new-con ${addNewPollState ? "active" : ""}`}>
                            <div className="vote-con-list vote-add-new-con">
                                <textarea placeholder='Type Poll here' value={newPollId} onChange={(e) => { setNewPollId(e.target.value) }}></textarea>
                                <div className='vote-add-new-input-con'>
                                    <div>
                                        <span htmlFor="" >Start Date</span>
                                        <input type="date" value={newPollStartDate} onChange={(e) => { setNewPollStartDate(e.target.value) }} name="" id="" />
                                    </div>
                                    <div>
                                        <span htmlFor="">Close Date</span>
                                        <input type="date" value={newPollEndDate} onChange={(e) => { setNewPollEndDate(e.target.value) }} name="" id="" />
                                    </div>
                                    <div>
                                        <button onClick={proposePoll} className='staking-btn'>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="vote-con-header vote-edit-header">
                            <div>
                                Poll
                            </div>
                            <div>
                                YES
                            </div>
                            <div>
                                NO
                            </div>
                            <div>
                                Edit
                            </div>
                        </div>
                        {openedPollData.map((pollData) => (
                            <OnlyOwnerOpenedPoll pollId={pollData.pollId} nbYesCnt={pollData.totalYesCnt} nbNoCnt={pollData.totalNoCnt} key={pollData.pollId} />
                        ))}
                    </div>
                ) : (<></>)
            }

        </>
    )
}