import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { setServers } from "dns";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { email, token } = queryString.parse(search);

  const [verified, setVerified] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

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
        console.log(res.status);
        if (res.status !== 200) {
          console.log("blad");
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
      return setErr("Please enter new password and confirm it");
    }
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
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
        return setErr(res.data.err);
      }
      setMsg(res.data.msg);
      return setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
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
    <form onSubmit={submitHandler}>
      <input type="password" placeholder="New password: " ref={passwordRef} />
      <input
        type="password"
        placeholder="Confirm password: "
        ref={passwordConfirmRef}
      />
      <button type="submit">Change password</button>
      <p>{err}</p>
      <p>{msg}</p>
    </form>
  );
};

export default ResetPassword;
