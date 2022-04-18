import React, { useState } from 'react';
import cup1 from '../../images/staking/cup-gold.png';

export default function Stanking2() {
    const [stakeAmount, setStakeAmount] = useState("");
    const [unStakeAmount, setUnStakeAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("")

    const stakeInput = (e) => {
        setStakeAmount(e.target.value);
    }

    const confirmStaking = () => {
        console.log(stakeAmount);
    }

    const unStakeInput = (e) => {
        setUnStakeAmount(e.target.value);
    }

    const confirmUnStaking = () => {
        console.log(unStakeAmount);
    }

    const withdrawInput = (e) => {
        setWithdrawAmount(e.target.value);
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
                                        <span className='staking-sub-text'>10,000 KST</span>
                                    </div>
                                    <div className='staking-con-main-sec'>
                                        <span className='staking-main-text'>APY</span>
                                        <span className='staking-sub-text'>12%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className='staking-con-main-sec'>
                                        <span className='staking-main-text'>Your Staking Amount</span>
                                        <span className='staking-sub-text'>100 KST</span>
                                    </div>
                                    <div className='staking-con-main-sec'>
                                        <span className='staking-main-text'>Your Reward Amount</span>
                                        <span className='staking-sub-text'>100 KST</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div className='sec3'>
                                <div>
                                    <div>
                                        <input type="number" onChange={stakeInput} name="stake" id="" placeholder='0'/>
                                        <button className='staking-btn' onClick={confirmStaking}>Stake</button>
                                    </div>
                                    <div>
                                        <input type="number" onChange={unStakeInput} name="unstake" id="" placeholder='0'/>
                                        <button className='staking-btn' onClick={confirmUnStaking}>Unstake</button>
                                    </div>
                                </div>
                                <div>
                                    <input type="number" name="withdraw" onChange={withdrawInput} id="withdraw" placeholder='0'/>
                                    <button className='staking-btn' onClick={confirmWithdraw}>Withdraw</button>
                                </div>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}