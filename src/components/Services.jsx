import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({ color, title, icon, subtitle, link }) => (
    <a href={link} target="_blank"  className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl w-full">
            <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
            {icon}
            </div>
            <div className="ml-5 flex flex-col flex-1">
            <h3 className="mt-2 text-white text-lg">{title}</h3>
            <p className="mt-1 text-white text-sm">
                {subtitle}
            </p>
            </div>
    </a>
);

const Services = () => (
  <div className="flex w-full justify-center items-center bg-welcome h-screen">
    <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
      <div className="flex-1 flex flex-col justify-start items-start">
        <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient">
          Fully working MMORPG game
          <br />
          on Binance Smart Chain
        </h1>
        <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
          Contrary to many gaming projects that are only promises, Kingdom Swap is already a functional game.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-start items-center">
        <ServiceCard
          color="bg-[#2952E3]"
          title="Documentation"
          icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
          subtitle="Check our whitepaper for detailed information about the project."
          link="https://docs.kingdom-swap.com/"
        />
        <ServiceCard
          color="bg-[#8945F8]"
          title="Kingdom Swap Wikipedia"
          icon={<BiSearchAlt fontSize={21} className="text-white" />}
          subtitle="For in-game depth knowledge, check our official Wikipedia."
          link="https://wiki.kingdom-swap.com/"
        />
        <ServiceCard
          color="bg-[#F84550]"
          title="Socials"
          icon={<RiHeart2Fill fontSize={21} className="text-white" />}
          subtitle="On our Linktree you can find all of our socials. Follow us to keep yourself up-to-date."
          link="https://linktr.ee/kingdomswap"
        />
      </div>
    </div>
  </div>
);

export default Services;