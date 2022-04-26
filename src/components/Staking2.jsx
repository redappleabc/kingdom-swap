import React, { useState } from 'react';
import cup1 from '../../images/staking/cup-gold.png';

export default function Stanking2() {
    const [stakeAmount, setStakeAmount] = useState("");
    const [unStakeAmount, setUnStakeAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [addNewPollState, setAddNewPollState ] = useState(false);


    const toggleAddNewPoll = () => {
        setAddNewPollState(!addNewPollState);
    }
    

    const confirmStaking = () => {
        console.log(stakeAmount);
    }

    const confirmUnStaking = () => {
        console.log(unStakeAmount);
    }

    const confirmWithdraw = () => {
        console.log(withdrawAmount);
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
                                        <span className='staking-sub-text'>10,000  $KS2</span>
                                    </div>
                                    <div className='staking-con-main-sec'>
                                        <span className='staking-main-text'>APY</span>
                                        <span className='staking-sub-text'>12%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className='staking-con-main-sec'>
                                        <span className='staking-main-text'>Your Staking Amount</span>
                                        <span className='staking-sub-text'>100  $KS2</span>
                                    </div>
                                    <div className='staking-con-main-sec'>
                                        <span className='staking-main-text'>Your Reward Amount</span>
                                        <span className='staking-sub-text'>100  $veKS2</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div className='sec3'>
                                <div>
                                    <div>
                                        <input type="number" onChange={(e)=>{setStakeAmount(e.target.value);}} name="stake" id="" placeholder='0'/>
                                        <button className='staking-btn' onClick={confirmStaking}>Stake</button>
                                    </div>
                                    <div>
                                        <input type="number" onChange={(e)=>{setUnStakeAmount(e.target.value);}} name="unstake" id="" placeholder='0'/>
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
                        YES
                    </div>
                    <div>
                        NO
                    </div>
                </div>
                <div className="vote-con-list">
                    <div className="vote-des">
                        You guys want to increase the experience per monster to 40?
                    </div>
                    <div className='vote-btn-con'>
                        <div className="yes-con input-con">
                            <div className='font-normal'>
                                293 $veKS2
                            </div>
                            <div>
                                <input type="number" placeholder='0'/>
                                <button className='staking-btn'>Yes</button>
                            </div>
                        </div>
                        <div className="no-con input-con">
                            <div className='font-normal'>
                                132 $veKS2
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
                        You guys want to increase the experience per monster to 40?
                    </div>
                    <div className='vote-btn-con'>
                        <div className="yes-con input-con">
                            <div className='font-normal'>
                                293 $veKS2
                            </div>
                            <div>
                                <input type="number" placeholder='0'/>
                                <button className='staking-btn'>Yes</button>
                            </div>
                        </div>
                        <div className="no-con input-con">
                            <div className='font-normal'>
                                132 $veKS2
                            </div>
                            <div>
                                <input type="number" placeholder='0' />
                                <button className='staking-btn btn-no'>No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="vote-header vote-sub-title font-subtitle">
                  Closed Poll
                </div>
                <div className="vote-con-list">
                    <div className="vote-des closed-des">
                        You guys want to increase the experience per monster to 20?
                    </div>
                    <div className='vote-btn-con font-normal'>
                        Yes: 132 $veKS2, No: 132 $veKS2
                    </div>
                </div>

            </div>
        </div>
        <div className="vote-container user-vote">
            <div className="vote-header">
                Please Edit Poll
            </div>
            <div className="add-new-btn">
                <button className='staking-btn' onClick={toggleAddNewPoll}>{addNewPollState?"Close":"Add New"}</button>
            </div>
            <div className={`add-new-con ${addNewPollState ? "active":""}`}>
                <div className="vote-con-list vote-add-new-con">
                    <textarea placeholder='Type Poll here'></textarea>
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
            <div className="vote-con-list vote-edit-list">
                <div className="vote-des">
                    You guys want to increase the experience per monster to 40?
                </div>
                <div className='vote-btn-con'>
                    <div className="yes-con input-con">
                        <div className='font-normal'>
                            293 $veKS2
                        </div>
                    </div>
                    <div className="no-con input-con">
                        <div className='font-normal'>
                            132 $veKS2
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