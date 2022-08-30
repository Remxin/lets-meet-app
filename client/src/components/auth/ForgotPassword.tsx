import React, { MutableRefObject, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@nextui-org/react";
import InformationModal from "../../modules/InformationModal";

import "../../styles/scss/auth/forgotPassword.scss"
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [visibleModal, setVisibleModal] = useState(false)

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!emailRef.current?.value) {
      setVisibleModal(true)
      return setErr("Please enter your email");
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_IP}/forgot-password`,
        {
          secret: process.env.REACT_APP_FORGOT_PASSWORD_SECRET,
          email: emailRef.current.value,
        }
      );
      
      if (res.data.err) {
        setVisibleModal(true)
        return setErr(res.data.err);
      }

      setMsg(res.data.msg);
      setVisibleModal(true)
      return setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {    
      setErr("Cannot send request");
      setVisibleModal(true)
    }
  };

  return (
    <form onSubmit={submitHandler} className="reset-page-form">
      <h2>Reset your password</h2>
      <Input color="warning" type="email" placeholder="Enter your email" ref={emailRef} />
      <button type="submit" className="confirm-btn">Send reset email</button>
      <Link to="/login">login</Link>
      <InformationModal visible={visibleModal} setVisible={setVisibleModal} errorText={err} successText={msg}/>
    </form>
  );
};

export default ForgotPassword;
