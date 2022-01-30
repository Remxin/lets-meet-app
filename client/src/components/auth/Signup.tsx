//@ts-nocheck
import React, { MutableRefObject, useContext, useRef, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Navigate, NavLink } from "react-router-dom";

const Signup = () => {
  //@ts-ignore
  const { user, setUser } = useContext(UserContext);
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [ageErr, setAgeErr] = useState("");
  const [licenceErr, setLicenceErr] = useState("");

  const [otherSex, setOtherSex] = useState(false);
  const [licenceAccepted, setLicenceAccepted] = useState(false);

  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const nameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const ageRef = useRef() as MutableRefObject<HTMLInputElement>;
  const sexRef = useRef() as MutableRefObject<HTMLSelectElement>;
  const advancedSexRef = useRef() as MutableRefObject<HTMLInputElement>;
  // const licenceAgreeRef = useRef() as MutableRefObject<HTMLInputElement>;

  const captureSex = () => {
    // sprawdzanie, czy nie występują zaawansowane płcie
    if (sexRef.current.value === "") {
      return setOtherSex(true);
    }
    return setOtherSex(false);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // --- reseting errors ---
    setNameErr("");
    setEmailErr("");
    setPasswordErr("");
    setAgeErr("");
    setLicenceErr("");
    // --- checking licence agrenment ---
    if (!licenceAccepted) {
      return setLicenceErr("You must agree to our licence!");
    }
    // --- setting properly sex ---
    let sex = "";
    if (advancedSexRef.current?.value) {
      sex = advancedSexRef.current.value;
    } else if (sexRef.current?.value) {
      sex = sexRef.current.value;
    }
    // --- birthdate convertion ---
    if (!ageRef.current?.value) {
      return setAgeErr("Chose your age");
    }
    let numAge = new Date(ageRef.current.value).getTime();
    // --- actuall server request ---
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/signup`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          name: nameRef.current.value,
          password: passwordRef.current.value,
          email: emailRef.current.value,
          sex,
          age: numAge,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const resData = await res.json();

      if (resData.errors) {
        setNameErr(resData.errors.name);
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
      <input type="text" placeholder="enter your name: " ref={nameRef} />
      <p>{nameErr}</p>
      <input
        type="password"
        placeholder="enter your password: "
        ref={passwordRef}
      />
      <p>{passwordErr}</p>
      <p>birth date: </p>
      <input type="date" ref={ageRef} />
      <p>{ageErr}</p>
      <p>sex:</p>
      <select ref={sexRef} onChange={captureSex}>
        <option value="male">male</option>
        <option value="female">female</option>
        <option value="">other</option>
      </select>
      {otherSex ? (
        <input
          type="text"
          ref={advancedSexRef}
          placeholder="enter your sex or leave this field blank"
        />
      ) : null}
      <p className="privacy-licence">
        I agree to <NavLink to="/privacy-policy">privacy policy</NavLink>
      </p>
      <input
        type="checkbox"
        onClick={() => setLicenceAccepted(!licenceAccepted)}
      />
      <p>{licenceErr}</p>
      <button type="submit">create account</button>
      <br />
      <NavLink to="/login">Already have an account</NavLink>
    </form>
  );
};

export default Signup;
