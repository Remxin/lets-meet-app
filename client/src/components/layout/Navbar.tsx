import React from "react";
import { useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { Tab } from "@headlessui/react";
import { Switch } from "@headlessui/react";
import { IoIosMenu } from "react-icons/io";
import { FcLandscape} from "react-icons/fc";
import { FaGlassCheers, FaDoorOpen, FaDoorClosed, FaWeixin } from 'react-icons/fa'

import { FaHome } from "react-icons/fa";

import NavbarLink from "./NavbarLink";

import "./Navbar.css";

type navbarProps = {
  logged: boolean;
};
const Navbar = ({ logged }: navbarProps) => {
  const [enabled, setEnabled] = useState(false);
  let [open, setOpen] = useState(false);

  // console.log(logged);
  const logout = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cache: "no-cache",
        },
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const navLinks = logged ? (
  // change to fixed and add margin bottom
  <div className="shadow-md w-full fixed top-0 left-0 s nav-content">
  <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
    <div
      className="font-bold text-2xl cursor-pointer flex content-center items-center font-[Poppins] 
  text-gray-800"
    >
      <span className="text-2xl text-indigo-700 mr-3 ">
        <FcLandscape name="logo-ionic"></FcLandscape>
      </span>
      <h1>Lets Meet Up </h1>
    </div>

    <div
      onClick={() => setOpen(!open)}
      className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
    >
      <IoIosMenu name={open ? "close" : "menu"}></IoIosMenu>
    </div>
    <ul
      className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
        open ? "top-18 opacity-100" : "top-[-490px]"
      } md:opacity-100 opacity-100`}
    >
      <NavbarLink path="/" text="Home" Icon={FaHome}/>
      <NavbarLink path="/events" text="My Events" Icon={FaGlassCheers}/>
      <NavbarLink path="/chats" text="Chats" Icon={FaWeixin}/>

      <NavbarLink path="" text="Logout" Icon={FaDoorOpen} func={logout}/>
    </ul>
  </div>
</div>
  ) : (
    // change to fixed and add margin bottom
    <div className="shadow-md w-full fixed top-0 left-0 s nav-content">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
        <div
          className="font-bold text-2xl cursor-pointer flex content-center items-center font-[Poppins] 
      text-gray-800"
        >
          <span className="text-2xl text-indigo-700 mr-3 ">
            <FcLandscape name="logo-ionic"></FcLandscape>
          </span>
          <h1>Lets Meet Up </h1>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          <IoIosMenu name={open ? "close" : "menu"}></IoIosMenu>
        </div>
        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-18 opacity-100" : "top-[-490px]"
          } md:opacity-100 opacity-100`}
        >
          <NavbarLink path="/" text="Home" Icon={FaHome}/>
          <NavbarLink path="/login" text="Login" Icon={FaDoorClosed}/>
          <NavbarLink path="/signup" text="Signup" Icon={FaDoorClosed}/>
          <NavbarLink path="/newlogin" text="New Login" Icon={FaDoorClosed}/>
        </ul>
      </div>
    </div>
  );

  return <div className="navbar">{navLinks}</div>;
};

export default Navbar;
