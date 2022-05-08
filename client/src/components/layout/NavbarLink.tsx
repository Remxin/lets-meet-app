import React from 'react'
import { NavLink } from 'react-router-dom'

import "./NavbarLink.css"


type linkProps = {
    text: String,
    path: String,
    Icon: any,
    func?: any
}
const NavbarLink = ({text, path, Icon, func}: linkProps) => {
  return (
    <li className="md:ml-8 text-xl md:my-0 my-7 navlink_container">
        {/* @ts-ignore */}
        <NavLink to={func ? "" : path} className="navbar__link" onClick={func ? func : ""}>
        {/* @ts-ignore */}
        <Icon className="navlink__icon"/>
        <p className="text-gray-800 duration-500 navlink__text">
            {text}
        </p>
        </NavLink>
  </li>
  )
}

export default NavbarLink