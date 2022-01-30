import React, { MutableRefObject, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!emailRef.current?.value) {
      return setErr("Please enter your email");
    }
    console.log(process.env.REACT_APP_FORGOT_PASSWORD_SECRET);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_IP}/forgot-password`,
        {
          secret: process.env.REACT_APP_FORGOT_PASSWORD_SECRET,
          email: emailRef.current.value,
        }
      );
      if (res.data.err) {
        return setErr(res.data.err);
      }

      setMsg(res.data.msg);
      return setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErr("Cannot send server request");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <input type="email" placeholder="Enter your email" ref={emailRef} />
      <button type="submit">Send reset password email</button>
      <p>{err}</p>
      <p>{msg}</p>
    </form>
  );
};

export default ForgotPassword;
