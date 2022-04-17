import { useState, useContext } from 'react';

import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import { TransactionContext } from '../context/TransactionContext';
import { Link } from 'react-router-dom';

import logo from '../../images/logo.png';

const NavbarItem = ({ title, classProps }) => {
    let link = title.toLowerCase();
    if (title == "Home") link="";
    return (
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            <a href={"/" + link}>{title}</a>
        </li>
    );
}

const Navbar = () => {
    const { getCurrentAccount, connectWallet } = useContext(TransactionContext);
    const [toggleMenu, setToggleMenu] = useState(false);

    return (
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <a href="https://kingdom-swap.com/" target="_blank"><img src={logo} alt="logo" className="w-32 cursor-pointer" /></a>
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                {["Home","Staking1", "Staking2", "Exchange", "Real Estate"].map((item, index) => (
                    <NavbarItem key={item + index} title={item} />
                ))}
                <button
                        type="button"
                        onClick={connectWallet}
                        className="flex flex-row justify-center items-center my-5 bg-[#F7BE2F] p-3 rounded-full cursor-pointer hover:bg-[#BB6E01]"
                    >
                        <p className="text-black text-base font-semibold">
                            {getCurrentAccount()}
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