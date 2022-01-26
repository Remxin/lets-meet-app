import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import { UserContext } from "./contexts/UserContext";

import Navbar from "./components/layout/Navbar";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Page404 from "./components/error/Page404";
import PrivacyPolicy from "./components/policy/PrivacyPolicy";

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
      <div className="app">
        {/* @ts-ignore */}
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar logged={isLogged} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
