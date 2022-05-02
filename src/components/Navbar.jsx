import { useState, useContext } from 'react';

import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import { TransactionContext } from '../context/TransactionContext';
import { Link } from 'react-router-dom';

import logo from '../../images/logo.png';
const navActive = (id) => {
    let nav = document.getElementsByClassName("nav-list");
    for (let i = 0; i<nav.length; i++) {
        nav[i].classList.remove("active")
    }
    document.getElementById(id).classList.add("active")
}
const NavbarItem = ({ title, classProps }) => {
    let link = title.toLowerCase();
    if (title == "Home") link="";
    return (
        <li className={`mx-4 cursor-pointer ${classProps} nav-list ${title}`} id={"nav" + title} onClick={() => {navActive("nav" + title)}}>
            <Link to={"/" + link}>{title}</Link>
        </li>
    );
}

const Navbar = () => {
    const { connectWallet, getCurrentAccount, setCurrentAccount } = useContext(TransactionContext);
    const [toggleMenu, setToggleMenu] = useState(false);

    const [walletAddress, setWalletAddress] = useState("Connect Wallet");

    const putWalletAddress = () => {
        if (walletAddress == "") return getCurrentAccount();
        else return walletAddress;
    }
    const toggleWallet = async () => {
        if (walletAddress == "Connect Wallet" ) {
            await connectWallet();
            // if(getCurrentAccount()!="Connect Wallet") setWalletAddress("");
            setWalletAddress("");
        }
        else {setWalletAddress("Connect Wallet"); setCurrentAccount("")}
    }

    return (
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <a href="https://kingdom-swap.com/" target="_blank"><img src={logo} alt="logo" className="w-32 cursor-pointer" /></a>
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
            {["Home", "Staking1", "Staking2", "Exchange", "Real Estate"].map((item, index) => (
                <NavbarItem key={item + index} title={item} classProps="my-2 text-lg" onClick={() => {navActive(navId)}}/>
            ))}
            
                <button
                        type="button"
                        onClick={toggleWallet}
                        onMouseOver={() => {if (walletAddress != "Connect Wallet") setWalletAddress("Disconnect")}}
                        onMouseOut={() => {if (walletAddress != "Connect Wallet") setWalletAddress(""); else setWalletAddress("Connect Wallet")}}
                        className="flex flex-row justify-center items-center my-5 bg-[#F7BE2F] p-3 rounded-full cursor-pointer hover:bg-[#BB6E01] wallet-btn"
                    >
                        <p className="text-black text-base font-semibold">
                            {putWalletAddress()}
                        </p>
                </button>
                    
            </ul>
            <div className='flex relative'>
                {toggleMenu
                    ? <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
                    : <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
                }
                {toggleMenu && (
                    <ul className='z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl 
                                   md:hidden list-none flex flex-col justify-start items-end 
                                   rounded-md blue-glassmorphism text-white animate-slide-in'>
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose onClick={() => setToggleMenu(false)} />
                        </li>
                        {["Home", "Staking1", "Staking2", "Exchange", "Real Estate"].map((item, index) => (
                            <NavbarItem key={item + index} title={item} classProps="my-2 text-lg"/>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar;