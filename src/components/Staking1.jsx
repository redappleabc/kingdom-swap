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

    const GASS_LIMIT = 285000;

    
  
    const fetchData = async () => {
        const apy = (await stakingContract.getAPY()).toString()
        const stakingBalance = ethers.utils.formatEther(await stakingContract.stakingBalance(currentAccount))
        const totalStakingBalance = ethers.utils.formatEther(await stakingContract.stakingBalance(currentAccount))
        const rewardsAmount = ethers.utils.formatEther(await stakingContract.getRewards());
        setApy(apy);
        setStakedBalance(stakingBalance)
        setTotalStakedBalance(totalStakingBalance)
        setRewards(rewardsAmount)
    }

    useEffect(() => {
        stakingContract = getStakingContract();
        tokenContract = getTokenContract();
        stakingContract.on("Staked", (address, amount) => {
            fetchData();
        });
    
        stakingContract.on("UnStaked", (address, amount) => {
            fetchData();
        });
    
        stakingContract.on("Withdrawed", (address, amount) => {
            fetchData();
        });

        
        if(currentAccount !== ""){
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
    </>
    )
}