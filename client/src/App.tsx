import React, { useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

// ----- context imports -----
import { UserContext } from "./contexts/UserContext";
// ----- location imports -----
import { NextUIProvider } from "@nextui-org/react";

import Navbar from "./components/layout/Navbar";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import NewLogin from "./components/auth/NewLogin";

import UserPanel from "./components/user/UserPanel";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import AddAvatar from "./components/user/addAvatar/AddAvatar";
import ChangePassword from "./components/user/changePassword/ChangePassword";
import Page404 from "./components/error/Page404";
import PrivacyPolicy from "./components/policy/PrivacyPolicy";

import AddEvent from "./components/pages/addEvent/AddEvent";
import AddPlace from "./components/pages/addPlace/AddPlace";
import Events from "./components/pages/Events";
import Event from "./components/pages/Event";
import Chats from "./components/pages/chats/Chats";

import AdminPanel from "./components/admin/AdminPanel";
import UnverifiedPlace from "./components/admin/elements/verifyPlace/UnverifiedPlace";
import UnverifiedPlaceCard from "./components/admin/elements/verifyPlace/UnverifiedPlaceCard";

// ---- init global apollo server variable and initialize memory cache for queries, to speed up app ----
const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

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
    <div className="app">
      <Router>
        <NextUIProvider>
          <ChakraProvider>
          <ApolloProvider client={client}>
            {/* @ts-ignore */}
            <UserContext.Provider value={{ user, setUser }}>
              <Navbar logged={isLogged} />
              <div className="main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/newlogin" element={<NewLogin />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset/password" element={<ResetPassword />} />
                  <Route path="/user" element={<UserPanel />} />
                  <Route path="/user/add-avatar" element={<AddAvatar />} />
                  <Route
                    path="/user/change-password"
                    element={<ChangePassword />}
                  />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/add/event" element={<AddEvent />} />
                  <Route path="/add/place" element={<AddPlace />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/event/:eventId" element={<Event />} />
                  <Route path="/chats" element={<Chats />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin/unverifiedPlace/:placeId" element={<UnverifiedPlace />} />
                  <Route path="*" element={<Page404 />} />
                </Routes>
              </div>
            </UserContext.Provider>
          </ApolloProvider>
          </ChakraProvider>
        </NextUIProvider>
      </Router>
    </div>
  );
}

export default App;
// export default GoogleApiWrapper({
//   apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
// })(App);
