import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

type navbarProps = {
  logged: boolean;
};
const Navbar = ({ logged }: navbarProps) => {
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
    <ul>
      <li>
        <NavLink to="/" className="navbar__link">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/login" className="navbar__link" onClick={logout}>
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
