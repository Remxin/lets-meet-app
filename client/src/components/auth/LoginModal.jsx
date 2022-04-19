import React, { useState } from "react";
import { Container, Card, Row, Text } from "@nextui-org/react";
import { Modal, Button, Input, Checkbox } from "@nextui-org/react";
import { Mail } from "../icons/Mail";
import { Password } from "../icons/Password";

export const LoginModal = ({ visible, setVisible }) => {
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
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
          Welcome&nbsp;
          <Text b size={18}>
            Login Here!
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
          contentLeft={<Mail fill="currentColor" />}
        />
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Password"
          contentLeft={<Password fill="currentColor" />}
        />
        <Row justify="space-between">
          <Checkbox>
            <Text size={14}>Remember me</Text>
          </Checkbox>
          <Text size={14}>Forgot password?</Text>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={closeHandler}>
          Close
        </Button>
        <Button auto onClick={closeHandler}>
          Sign in
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
