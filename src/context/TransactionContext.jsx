import React, { useEffect, useState } from 'react';

export const TransactionContext = React.createContext();

const { ethereum } = window;


export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");

            // const accounts = await ethereum.request({method: 'eth_accounts'});

            // if(accounts.length) {
            //     setCurrentAccount(accounts[0]);
            // } else {
            //     console.log('No accounts found');
            // }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    }

    const getCurrentAccount = () => {      
        if (currentAccount == '') return 'Connect Wallet';

        return currentAccount.slice(0,5) + "..." + currentAccount.slice(38).toUpperCase();
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");
          
            const networkId = await ethereum.request({method: "net_version"});
            console.log(networkId);
            if (networkId != 56) {
                alert("Change to BSC network!");
            }
            else {
                const accounts = await ethereum.request({method: 'eth_requestAccounts'});
                await setCurrentAccount(accounts[0]); 
                console.log(currentAccount);
            }
            
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
    

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, setCurrentAccount,  getCurrentAccount, checkIfWalletIsConnected }}>
            { children }
        </TransactionContext.Provider>
    )
}