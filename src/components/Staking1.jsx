import React, { useState, useEffect, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { stakingContractABI, stakingContractAddress, tokenContractABI, tokenContractAddress } from '../utils/constants';

import { ethers } from 'ethers';

// import cup1 from '../../images/staking/cup-gold.png';

const {ethereum} = window;

const getStakingContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(stakingContractAddress, stakingContractABI, signer);
    return transactionContract;
}

const getTokenContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(tokenContractAddress, tokenContractABI, signer);
    return transactionContract;
}

let stakingContract = {};
let tokenContract = {};

export default function Stanking1() {
    const {currentAccount} = useContext(TransactionContext);
    
    const [stakeAmount, setStakeAmount] = useState("");
    const [unStakeAmount, setUnStakeAmount] = useState("");


    const [apy, setApy] = useState("");
    const [stakedBalance, setStakedBalance] = useState("");
    const [totalStakedBalance, setTotalStakedBalance] = useState("");
    const [rewards, setRewards] = useState("");

    const [addNewAnnouncementState, setAddNewAnnouncementState ] = useState(false);
    const GASS_LIMIT = 285000;
    

    const toggleAddNewAnnouncement = () => {
        setAddNewAnnouncementState(!addNewAnnouncementState);
    }
  
    const fetchData = async () => {
        const stakingBalance = ethers.utils.formatEther(await stakingContract.stakingBalance(currentAccount));
        const totalStakingBalance = ethers.utils.formatEther(await stakingContract.totalStaked());
        const annualTotalSupply = ethers.utils.formatEther(await stakingContract.annualTotalSupply());
        const rewardsAmount = ethers.utils.formatEther(await stakingContract.getRewards());
        
        if(totalStakingBalance>0)
            setApy(annualTotalSupply/totalStakingBalance*100);
        else
            setApy(0)
        setStakedBalance(stakingBalance)
        setTotalStakedBalance(totalStakingBalance)
        setRewards(rewardsAmount)
        setStakeAmount("")
        setUnStakeAmount("")

    }

    useEffect(() => {
        stakingContract = getStakingContract();
        tokenContract = getTokenContract();
        


        if(currentAccount !== ""){
            stakingContract.on("Staked", (address, amount) => {
                fetchData();
            });
        
            stakingContract.on("UnStaked", (address, amount) => {
                fetchData();
            });
        
            stakingContract.on("Withdrawed", (address, amount) => {
                fetchData();
            });
            fetchData();
        }
    },[currentAccount])

   

    const confirmStaking = async () => {

        let convertToWei = ethers.utils.parseEther(stakeAmount);
        console.log(convertToWei.toString())


        await tokenContract.approve(stakingContractAddress, convertToWei).then((res) =>{
            console.log(stakingContractAddress);
        })

        
        await stakingContract.stakeTokens(convertToWei, {
            gasLimit: GASS_LIMIT,
          })
          .then((res) => {
            console.log(res);
        })

        // await stakingContract.getAPY().then((res) => {
        //     console.log(res._hex)
        // })
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
    
    return(
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
                                        <span className='staking-sub-text'>{totalStakedBalance} STRG</span>
                                    </div>
                                    <div className='staking-con-main-sec'>
                                        <span className='staking-main-text'>APY</span>
                                        <span className='staking-sub-text'>{apy}%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className='staking-con-main-sec'>
                                        <span className='staking-main-text'>Your Staking Amount</span>
                                        <span className='staking-sub-text'>{stakedBalance} STRG</span>
                                    </div>
                                    <div className='staking-con-main-sec'>
                                        <span className='staking-main-text'>Your Reward Amount</span>
                                        <span className='staking-sub-text'>{rewards} KST</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div className='sec3'>
                                <div>
                                    <div>
                                        <input type="number" value={stakeAmount}  onChange={(e)=>{setStakeAmount(e.target.value)}} name="stake" id="" placeholder='0'/>
                                        <button className='staking-btn' onClick={confirmStaking}>Stake</button>
                                    </div>
                                    <div>
                                        <input type="number" value={unStakeAmount } onChange={(e)=>{ setUnStakeAmount(e.target.value)}} name="unstake" id="" placeholder='0'/>
                                        <button className='staking-btn' onClick={confirmUnStaking}>Unstake</button>
                                    </div>
                                </div>
                                <div>
                                    {/* <input type="number" name="withdraw" onChange={withdrawInput} id="withdraw" placeholder='0'/> */}
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
                Welcome! Please vote here.
            </div>
            <div className="vote-con-main">
                <div className="vote-con-header">
                    <div>
                        Announcement
                    </div>
                    <div>
                        YES
                    </div>
                    <div>
                        NO
                    </div>
                </div>
                <div className="vote-con-list">
                    <div className="vote-des">
                      test test test test test test test test test test test test test test test test test test test test test test test
                    </div>
                    <div className='vote-btn-con'>
                        <div className="yes-con input-con">
                            <div className='font-normal'>
                                293 KST
                            </div>
                            <div>
                                <input type="number" placeholder='0'/>
                                <button className='staking-btn'>Yes</button>
                            </div>
                        </div>
                        <div className="no-con input-con">
                            <div className='font-normal'>
                                132 KST
                            </div>
                            <div>
                                <input type="number" placeholder='0' />
                                <button className='staking-btn btn-no'>No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="vote-con-list">
                    <div className="vote-des">
                      test test test test test test test test test test test test test test test test test test test test test test test
                    </div>
                    <div className='vote-btn-con'>
                        <div className="yes-con input-con">
                            <div className='font-normal'>
                                293 KST
                            </div>
                            <div>
                                <input type="number" placeholder='0'/>
                                <button className='staking-btn'>Yes</button>
                            </div>
                        </div>
                        <div className="no-con input-con">
                            <div className='font-normal'>
                                132 KST
                            </div>
                            <div>
                                <input type="number" placeholder='0' />
                                <button className='staking-btn btn-no'>No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="vote-header vote-sub-title font-subtitle">
                  Closed Announcement
                </div>
                <div className="vote-con-list">
                    <div className="vote-des closed-des">
                      test test test test test test test test test test test test test test test test test test test test test test test
                    </div>
                    <div className='vote-btn-con font-normal'>
                        2022.03.22 closed.
                    </div>
                </div>

            </div>
        </div>
        <div className="vote-container user-vote">
            <div className="vote-header">
                Please Edit Announcement.
            </div>
            <div className="add-new-btn">
                <button className='staking-btn' onClick={toggleAddNewAnnouncement}>{addNewAnnouncementState?"Close":"Add New"}</button>
            </div>
            <div className={`add-new-con ${addNewAnnouncementState ? "active":""}`}>
                <div className="vote-con-list vote-add-new-con">
                    <textarea placeholder='Type announcement here'></textarea>
                    <div className='vote-add-new-input-con'>
                        <div>
                            <span htmlFor="">Start Date</span>
                            <input type="date" name="" id="" />
                        </div>
                        <div>
                            <span htmlFor="">Close Date</span>
                                <input type="date" name="" id="" />
                            </div>
                        <div>
                            <button className='staking-btn'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="vote-con-header vote-edit-header">
                    <div>
                        Announcement
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
            <div className="vote-con-list vote-edit-list">
                <div className="vote-des">
                    test test test test test test test test test test test test test test test test test test test test test test test
                </div>
                <div className='vote-btn-con'>
                    <div className="yes-con input-con">
                        <div className='font-normal'>
                            293 KST
                        </div>
                    </div>
                    <div className="no-con input-con">
                        <div className='font-normal'>
                            132 KST
                        </div>
                    </div>
                    <div>
                        <button className='staking-btn'>Close</button>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}