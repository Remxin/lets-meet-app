import React, { useState, useContext, useRef, MutableRefObject } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";

const Login = () => {
  //@ts-ignore
  const { user, setUser } = useContext(UserContext);
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNameErr("");
    setEmailErr("");
    setPasswordErr("");
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          password: passwordRef.current.value,
          email: emailRef.current.value,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const resData = await res.json();

      if (resData.errors) {
        setEmailErr(resData.errors.email);
        setPasswordErr(resData.errors.password);
      }
      setUser(resData.user);
    } catch (err) {
      console.log(err);
    }
  };

  if (user) {
    return <Navigate replace to="/" />;
  }

  return (
    <form onSubmit={submitHandler}>
      <input type="text" placeholder="enter email: " ref={emailRef} />
      <p>{emailErr}</p>
      <input
        type="password"
        placeholder="enter your password: "
        ref={passwordRef}
      />
      <p>{passwordErr}</p>
      <button type="submit">login</button>
    </form>
  );
};

export default Login;
