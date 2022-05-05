import React, { useState, useContext, useRef, MutableRefObject } from "react";
import { Container, Card, Row, Text } from "@nextui-org/react";
import { Modal, Button, Input, Checkbox } from "@nextui-org/react";
import { Mail } from "../icons/Mail";
import { Password } from "../icons/Password";
import { LoginModal } from "./LoginModal";

const NewLogin = () => {
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  return (
    <Container
      display="flex"
      justify="center"
      alignContent="flex-start"
      alignItems="center"
      direction="row"
      wrap="nowrap"
      css={{
        height: "100vh",
      }}
    >
      <Card hoverable clickable css={{ width: "15rem" }}>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            objectFit="cover"
            src={
              "https://icon-library.com/images/sign-in-icon/sign-in-icon-26.jpg"
            }
            width="100%"
            height={220}
            alt="signup"
          />
        </Card.Body>
        <Card.Footer>
          <Row wrap="wrap" justify="space-between">
            <Text b css={{ margin: "auto" }}>
              Sing up
            </Text>
          </Row>
        </Card.Footer>
      </Card>
      <Card hoverable clickable onClick={handler} css={{ width: "15rem" }}>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            objectFit="cover"
            src={"https://cdn-icons-png.flaticon.com/512/152/152533.png"}
            width="626px"
            height={220}
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
        open={visible}
        onClose={closeHandler}
        visible={visible}
        setVisible={setVisible}
      ></LoginModal>
    </Container>
  );
};

export default NewLogin;
