import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [amount, setAmount] = useState(0);

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({method: 'eth_accounts'});

            if(accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log('No accounts found');
            }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    }

    const getCurrentAccount = () => {      
        if (currentAccount == '') return 'Connect Wallet';

        return currentAccount.slice(0,2) + "..." + currentAccount.slice(38).toUpperCase();
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]); 
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");

            const parsedAmount = ethers.utils.parseEther(amount.toString());

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: '0xe2a24Ced6d37a4E6e63D2CC95F017cEa9bF1D8C6',
                    gas: '0x5208', //21000 GWEI
                    value: parsedAmount._hex,
                }]
            });
        
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
    

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, sendTransaction, amount, setAmount, getCurrentAccount }}>
            { children }
        </TransactionContext.Provider>
    )
}