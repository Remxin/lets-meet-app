import React, { useState, useContext, useRef, MutableRefObject } from "react";
import { Container, Card, Row, Text } from "@nextui-org/react";

const NewLogin = () => {
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
      <Card hoverable clickable css={{ width: "50%" }}>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            objectFit="cover"
            src={
              "https://www.barrowboysiw.co.uk/wp-content/uploads/2020/11/NAVELS-O.jpg"
            }
            width="100%"
            height={140}
            alt="signup"
          />
        </Card.Body>
        <Card.Footer>
          <Row wrap="wrap" justify="space-between">
            <Text b css={{ margin: "auto" }}>
              SingUp
            </Text>
          </Row>
        </Card.Footer>
      </Card>
      <Card hoverable clickable css={{ width: "43%" }}>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            objectFit="cover"
            src={
              "https://www.barrowboysiw.co.uk/wp-content/uploads/2020/11/NAVELS-O.jpg"
            }
            width="100%"
            height={140}
            alt="signup"
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
    </Container>
  );
};

export default NewLogin;
