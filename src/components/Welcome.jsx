import React, { useContext, useState, useEffect } from 'react';
import { AiFillPlayCircle } from "react-icons/ai";
import { SiBinance } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { TransactionContext } from '../context/TransactionContext';
import { Loader } from "./";

import starterpackimage from '../../images/starterpack.jpg';

const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";


const Welcome = () => {
    const { connectWallet, currentAccount, sendTransaction, setAmount, amount, getCurrentAccount } = useContext(TransactionContext);
    const [cardBackgroundColor, setCardBackgroundColor] = useState('');
    const [price, setPrice] = useState(0);

    const [cardContent, setCardContent] = useState("Select your pack");

    const handleSubmit = (e) => {
        e.preventDefault();

        if(amount > 0) return sendTransaction();

        return
    }

    const handleSelectPlatinum = async (e) => {
        e.preventDefault();

        setCardContent("Platinum Starter Pack");

        setCardBackgroundColor('#e5e4e2');

        document.getElementById("buy-now").style.backgroundColor = "#e5e4e2";
        document.getElementById("buy-now").style.color = "black";

        document.getElementById("card").style.backgroundColor = "#e5e4e2";
        document.getElementById("font-card").style.color = "black";

        const response = await fetch('https://api.pancakeswap.info/api/v2/tokens/0xe9e7cea3dedca5984780bafc599bd69add087d56');
        const myJson = await response.json(); //extract JSON from the http response;

        setAmount(100 * myJson.data.price_BNB);
        setPrice(100);
    }

    const handleSelectBlack = async (e) => {
        e.preventDefault();

        setCardContent("Black Starter Pack");

        setCardBackgroundColor('#000');

        document.getElementById("buy-now").style.backgroundColor = "#000";
        document.getElementById("buy-now").style.color = "white";

        document.getElementById("card").style.backgroundColor = "#000";
        document.getElementById("font-card").style.color = "white";

        const response = await fetch('https://api.pancakeswap.info/api/v2/tokens/0xe9e7cea3dedca5984780bafc599bd69add087d56');
        const myJson = await response.json(); //extract JSON from the http response;

        setAmount(150 * myJson.data.price_BNB);
        setPrice(150);
    }

    const handleSelectBronze = async (e) => {
        e.preventDefault();

        setCardContent("Bronze Starter Pack");

        setCardBackgroundColor('#cd7f32');

        document.getElementById("buy-now").style.backgroundColor = "#cd7f32";
        document.getElementById("buy-now").style.color = "black";

        document.getElementById("card").style.backgroundColor = "#cd7f32";
        document.getElementById("font-card").style.color = "black";

        const response = await fetch('https://api.pancakeswap.info/api/v2/tokens/0xe9e7cea3dedca5984780bafc599bd69add087d56');
        const myJson = await response.json(); //extract JSON from the http response;

        setAmount(35 * myJson.data.price_BNB);
        setPrice(35);
    }

    const handleSelectSilver = async (e) => {
        e.preventDefault();

        setCardContent("Silver Starter Pack");

        setCardBackgroundColor('#c0c0c0');

        document.getElementById("buy-now").style.backgroundColor = "#c0c0c0";
        document.getElementById("buy-now").style.color = "black";

        document.getElementById("card").style.backgroundColor = "#c0c0c0";
        document.getElementById("font-card").style.color = "black";

        const response = await fetch('https://api.pancakeswap.info/api/v2/tokens/0xe9e7cea3dedca5984780bafc599bd69add087d56');
        const myJson = await response.json(); //extract JSON from the http response;

        setAmount(45 * myJson.data.price_BNB);
        setPrice(45);
    }

    const handleSelectGold = async (e) => {
        e.preventDefault();

        setCardContent("Gold Starter Pack");

        setCardBackgroundColor('#ffd700');

        document.getElementById("buy-now").style.backgroundColor = "#ffd700";
        document.getElementById("buy-now").style.color = "black";

        document.getElementById("card").style.backgroundColor = "#ffd700";
        document.getElementById("font-card").style.color = "black";

        const response = await fetch('https://api.pancakeswap.info/api/v2/tokens/0xe9e7cea3dedca5984780bafc599bd69add087d56');
        const myJson = await response.json(); //extract JSON from the http response;

        setAmount(60 * myJson.data.price_BNB);
        setPrice(60);
    }

    useEffect(() => {
        document.getElementById("navHome").classList.add("active");
    }, [])

    return (
        <div>
            <div className="flex w-full justify-center items-center h-screen">
                <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                    <div className="flex flex-1 justify-start flex-col mf:mr-10">
                        <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                            Buy your <br/> starter pack!
                        </h1>
                        <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                            Choose between five different starter pack options
                        </p>
                        {!currentAccount && <button
                            type="button"
                            onClick={connectWallet}
                            className="flex flex-row justify-center items-center my-5 bg-[#F7BE2F] p-3 rounded-full cursor-pointer hover:bg-[#BB6E01]"
                        >
                            <p className="text-black text-base font-semibold">
                                Connect Wallet
                            </p>
                        </button>}

                        <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                            <div className={`rounded-tl-2xl ${commonStyles}`}>
                                Starter Packs
                            </div>
                            <div 
                                className={`${commonStyles} platinum`}
                                onClick={handleSelectPlatinum}
                            >
                                Platinum
                            </div>
                            <div 
                                className={`rounded-tr-2xl ${commonStyles} black`}
                                onClick={handleSelectBlack}
                            >
                                Black
                            </div>
                            <div 
                                className={`rounded-bl-2xl ${commonStyles} bronze`}
                                onClick={handleSelectBronze}
                            >
                                Bronze
                            </div>
                            <div 
                                className={`${commonStyles} silver`}
                                onClick={handleSelectSilver}
                            >
                                Silver
                            </div>
                            <div 
                                className={`rounded-br-2xl ${commonStyles} gold`}
                                onClick={handleSelectGold}
                            >
                                Gold
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                        <div id="card" className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card">
                            <div id="font-card" className="flex justify-between flex-col w-full h-full">
                                <div className="flex justify-between items-start">
                                    <SiBinance fontSize={21} />
                                    <p className="font-bold text-sm">
                                        USD ${price}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-light text-sm">
                                        {getCurrentAccount()}
                                    </p>
                                    <p className="font-semibold text-lg mt-1" id="card-content">
                                        {cardContent}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center">
                        {false ? (
                                <Loader />
                            ) : (
                                <button
                                    id="buy-now"
                                    type="button"
                                    onClick={handleSubmit}
                                    className="text-black w-full mt-2 border-[1px] p-2 border-none rounded-full cursor-pointer bg-[#F7BE2F] hover:bg-[#BB6E01]"
                                >
                                    {cardBackgroundColor == '' ? "Select your pack" : "Buy now"}
                                </button>
                            )
                        }
                        <p className="text-red-600"><strong>The wallet you are using must be same</strong></p>
                        <p className="text-red-600"><strong>registered in the Kingdom Swap.</strong></p>
                        <p className="text-red-600">Payment is calculated from dollars to BNB.</p>
                        <p className="text-red-600">Make sure you are at the BSC network.</p>
                        </div>                    
                    </div>
                </div>
            </div>
            
            <div className="text-center">
                <img src={starterpackimage} alt="Starter Packs" />                
            </div>
        </div>
        
    );
}

export default Welcome;