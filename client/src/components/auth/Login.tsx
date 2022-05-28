import React, { useState, useContext, useRef, MutableRefObject } from "react";
import { Navigate, NavLink } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";
import {login} from '../../api/auth/login'



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

    if (!passwordRef.current?.value) {
      setPasswordErr("Please enter password!")
      return
    }
    if (!emailRef.current?.value) {
      setEmailErr("Please enter name!")
      return
    }
      // --- login ---
      const resData = await login(passwordRef.current.value, emailRef.current.value)

      if (resData.errors) {
        setEmailErr(resData.errors.email);
        setPasswordErr(resData.errors.password);
      }
      setUser(resData.user);
   
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
      <br />
      <NavLink to="/forgot-password">forgot password</NavLink>
      <br />
      <NavLink to="/signup">Don't have an account</NavLink>
    </form>
  );
};

export default Login;
