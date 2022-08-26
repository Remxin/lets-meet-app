import React, { useState, useContext, useRef, MutableRefObject } from "react";
import { Container, Card, Row, Text, User } from "@nextui-org/react";
import { LoginModal } from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { Navigate } from "react-router-dom"

import { UserContext } from "../../contexts/UserContext";

import "../../styles/scss/auth/loginPage.scss"

const NewLogin = () => {
  const { user } = useContext(UserContext)
  const [loginVisible, setloginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false)
  const handler = () => setloginVisible(true);

  const closeHandler = () => {
    setloginVisible(false);
    setRegisterVisible(false)
    console.log("closed");
  };

  if (user) {
    return <Navigate to="/"/>
  }


  return (
    <Container
      display="flex"
      justify="center"
      alignContent="flex-start"
      alignItems="center"
      direction="row"
      wrap="nowrap"
      className="login-page"
      css={{
        height: "100vh",
      }}
    >
      <Card hoverable clickable onClick={() => setRegisterVisible(true)} css={{ width: "15rem" }} className="action-card">
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            objectFit="cover"
            src={
              "/signup.jpeg"
            }
            alt="signup"
          />
        </Card.Body>
        <Card.Footer>
          <Row wrap="wrap" justify="space-between">
            <Text b css={{ margin: "auto" }}>
              Signup
            </Text>
          </Row>
        </Card.Footer>
      </Card>
      <Card hoverable clickable onClick={() => setloginVisible(true)} css={{ width: "15rem" }} className="action-card">
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            objectFit="cover"
            src={"/login.png"}
            alt="login"
          />
        </Card.Body>
        <Card.Footer>
          <Row wrap="wrap" justify="space-between">
            <Text b css={{ margin: "auto" }}>
              Login
            </Text>
          </Row>
        </Card.Footer>
      </Card>
      <LoginModal
        openRegister={setRegisterVisible}
        visible={loginVisible}
        setVisible={setloginVisible}
      />
      <RegisterModal openLogin={setloginVisible} open={registerVisible} setVisible={setRegisterVisible} visible={registerVisible} onClose={() => setRegisterVisible(false)}/>
    </Container>
  );
};

export default NewLogin;
