import React, { useState, useRef, useContext } from "react";
import { Container, Card, Row, Text } from "@nextui-org/react";
import { Modal, Button, Input, Checkbox } from "@nextui-org/react";
import { FaEnvelope, FaLock } from "react-icons/fa" 
import { NavLink } from "react-router-dom";

import { UserContext } from '../../contexts/UserContext'
import { login } from "../../api/auth/login";

export const LoginModal = ({ visible, setVisible, openRegister }) => {
  const { setUser } = useContext(UserContext)
  const [nameErr, setNameErr] = useState("")
  const [emailErr, setEmailErr] = useState("")
  const [passwordErr, setPasswordErr] = useState("")

  const passwordRef = useRef()
  const emailRef = useRef()

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };


  const submitHandler = async (e) => {
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
      window.location.reload()
   
  };




  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Welcome again&nbsp;
          <Text b size={18}>
            Lets login!
          </Text>
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Email"
          contentLeft={<FaEnvelope/>}
          ref={emailRef}
        />
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          type="password"
          placeholder="Password"
          contentLeft={<FaLock/>}
          ref={passwordRef}
        />
        <Row justify="space-between">
          <Text size={14} onClick={() => {
            setVisible(false)
            openRegister(true)
          }}>Create account</Text>
          <NavLink to="/forgot-password"><Text size={14}>Forgot password?</Text></NavLink>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={closeHandler}>
          Close
        </Button>
        <Button auto onClick={submitHandler}>
          Sign in
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
