import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { UserContext } from "./contexts/UserContext";

import Navbar from "./components/layout/Navbar";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

function App() {
  const [user, setUser] = useState<any>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setIsLogged(true);
    }
  }, []);

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
          </Routes>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
