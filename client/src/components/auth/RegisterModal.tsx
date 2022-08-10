
import React, { MutableRefObject, useState, useRef, useContext } from "react";
import { Container, Card, Row, Text } from "@nextui-org/react";
import { Modal, Button, Input, Checkbox } from "@nextui-org/react";
import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa" 
import { Select } from "@chakra-ui/react"
import { signup } from "../../api/auth/signup"
import { UserContext } from "../../contexts/UserContext";

 const RegisterModal = ({ visible, setVisible, openLogin }:any) => {
     //@ts-ignore
    const { setUser } = useContext(UserContext)

     const sexRef = useRef() as MutableRefObject<HTMLSelectElement>
     const advancedSexRef = useRef() as MutableRefObject<HTMLInputElement>
     const ageRef = useRef() as MutableRefObject<HTMLInputElement>
     const nameRef = useRef() as MutableRefObject<HTMLInputElement>
     const passwordRef = useRef() as MutableRefObject<HTMLInputElement>
     const emailRef = useRef() as MutableRefObject<HTMLInputElement>

    const [nameErr, setNameErr] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [passwordErr, setPasswordErr] = useState("")
    const [ageErr, setAgeErr] = useState("")
    const [licenceErr, setLicenceErr] = useState("")
    
     const [otherSex, setOtherSex] = useState(false)
     const [licenceAccepted, setLicenceAccepted] = useState(false)

    const captureSex = () => {
        // sprawdzanie, czy nie występują zaawansowane płcie
        if (sexRef.current.value === "") {
          return setOtherSex(true);
        }
        return setOtherSex(false);
      };
  
      const submitHandler = async (e: React.TouchEvent) => {
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
          const resData = await signup(nameRef.current.value, passwordRef.current.value, emailRef.current.value, sex, numAge)
    
          if (resData.errors) {
              //@ts-ignore
              setNameErr(resData.errors.name);
              //@ts-ignore
              setEmailErr(resData.errors.email);
              //@ts-ignore
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
      onClose={() => setVisible(false)}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
        Signup in&nbsp;
          <Text b size={18}>
             Lets meet app
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
          placeholder="Name"
          contentLeft={<FaUserAlt/>}
          ref={nameRef}
        />
        <Text size={12} color="tomato" style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "-10px 0 5px 0"}}>{nameErr}</Text>
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          type="email"
          placeholder="Email"
          contentLeft={<FaEnvelope/>}
          ref={emailRef}
        />
        <Text size={12} color="tomato" style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "-10px 0 5px 0"}}>{emailErr}</Text>
        <Input
          clearable
          bordered
          type="password"
          fullWidth
          color="primary"
          size="lg"
          placeholder="Password"
          contentLeft={<FaLock/>}
          ref={passwordRef}
        />
        <Text size={12} color="tomato" style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "-10px 0 5px 0"}}>{passwordErr}</Text>
        <Text>Your birth date</Text>
        <Input
          clearable
          bordered
          type="date"
          fullWidth
          color="primary"
          size="lg"
          ref={ageRef}

        />
        <Text size={12} color="tomato" style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "-10px 0 5px 0"}}>{ageErr}</Text>
        <Select ref={sexRef} onChange={captureSex}>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="">other</option>
        </Select>
        {otherSex ? (
            <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            type="text"
            ref={advancedSexRef}
            placeholder="Enter your gender or leave this field blank"
            />
            ) : null}
      <Checkbox
      size="sm"
        type="checkbox"
        onClick={() => setLicenceAccepted(prev => !prev)}
      >   I agree to privacy policy</Checkbox>
        <Text size={12} color="tomato" style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "-10px 0 5px 0"}}>{licenceErr}</Text>
        <Row justify="space-between">
          <Text size={14} onClick={() => {
              setVisible(false)
              openLogin(true)
          }}>Already have an account?</Text>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={() => setVisible(false)}>
          Close
        </Button>
        {/* @ts-ignore */}
        <Button auto onClick={submitHandler}>
          Register
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterModal