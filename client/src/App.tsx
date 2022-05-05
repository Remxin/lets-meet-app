import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import { UserContext } from "./contexts/UserContext";
import { NextUIProvider } from "@nextui-org/react";

import Navbar from "./components/layout/Navbar";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import NewLogin from "./components/auth/NewLogin";

import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import AddAvatar from "./components/user/addAvatar/AddAvatar";
import Page404 from "./components/error/Page404";
import PrivacyPolicy from "./components/policy/PrivacyPolicy";

import AddEvent from "./components/pages/addEvent/AddEvent";

function App() {
  const [user, setUser] = useState<any>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // console.log("trying");
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_IP}/verifyuser`,
          {
            method: "GET",
            credentials: "include", // dołącza do zapytania cookiesy
            headers: {
              "Content-Type": "application/json",
              Cache: "no-cache",
            },
          }
        );
        const data = await res.json();
        await setUser(data);
      } catch (err) {
        console.log(err);
      }
    };
    verifyUser();
  }, []);

  useEffect(() => {
    // console.log(user);
    if (user) {
      // sprawdzenie, czy jest zalogowany, by potem ustawić odpowiedni navbar
      setIsLogged(true);
    }
  }, [user]);

  return (
    // @ts-ignore
    <Router>
      <NextUIProvider>
        <div className="app">
          {/* @ts-ignore */}
          <UserContext.Provider value={{ user, setUser }}>
            <Navbar logged={isLogged} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/newlogin" element={<NewLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset/password" element={<ResetPassword />} />
              <Route path="/user/add-avatar" element={<AddAvatar />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/add/event" element={<AddEvent />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </UserContext.Provider>
        </div>
      </NextUIProvider>
    </Router>
  );
}

export default App;
