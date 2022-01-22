import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

type navbarProps = {
  logged: boolean;
};
const Navbar = ({ logged }: navbarProps) => {
  const navLinks = logged ? (
    <ul>
      <li>
        <NavLink to="/" className="navbar__link">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/logout" className="navbar__link">
          Logout
        </NavLink>
      </li>
    </ul>
  ) : (
    <ul>
      <li>
        <NavLink to="/" className="navbar__link">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/login" className="navbar__link">
          Login
        </NavLink>
      </li>
      <li>
        <NavLink to="/signup" className="navbar__link">
          Signup
        </NavLink>
      </li>
    </ul>
  );

  return <div className="navbar">{navLinks}</div>;
};

export default Navbar;
