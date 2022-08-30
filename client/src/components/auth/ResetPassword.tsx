import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

import "../../styles/scss/auth/resetPassword.scss"
import { Input } from "@nextui-org/react";
import InformationModal from "../../modules/InformationModal";


const ResetPassword = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { email, token } = queryString.parse(search);

  const [verified, setVerified] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [showInformationModal, setShowInformationModal] = useState(false)

  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordConfirmRef = useRef() as MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (!email || !token) {
      return navigate("/login");
    }
    const verifyUser = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_IP}/email/verifyuser`,
          {
            resetToken: token,
          }
        );
        if (res.status !== 200) {
          setShowInformationModal(true)
          setErr("Cannot verify user");
          return setTimeout(() => navigate("/login"), 3000);
        }
        setMsg("User Verified");
        return setVerified(true);
      } catch (err) {
        setErr("user not verified");
        return setTimeout(() => navigate("/login"), 3000);
      }
    };
    verifyUser();
  }, []);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!passwordRef.current?.value || !passwordConfirmRef.current?.value) {
      setShowInformationModal(true)
      return setErr("Please enter new password and confirm it");
    }
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setShowInformationModal(true)
      return setErr("Passwords do not match");
    }
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_IP}/update/user/password`,
        {
          emailToken: token,
          newPassword: passwordRef.current.value,
        }
      );
      if (res.status !== 200) {
        setShowInformationModal(true)
        return setErr(res.data.err);
      }
      setShowInformationModal(true)
      setMsg(res.data.msg);
      return setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setShowInformationModal(true)
      setErr("Cannot fetch server");
    }
  };

  if (!verified) {
    return (
      <div>
        <p>{err}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submitHandler} className="reset-password-form">
      <h2>Reset password</h2>
      <Input type="password" placeholder="New password: " ref={passwordRef} />
      <Input
        type="password"
        placeholder="Confirm password: "
        ref={passwordConfirmRef}
      />
      <button type="submit">Change password</button>
      {/* <p>{err}</p>
      <p>{msg}</p> */}
      <InformationModal visible={showInformationModal} setVisible={setShowInformationModal} errorText={err} successText={msg}/>
    </form>
  );
};

export default ResetPassword;
