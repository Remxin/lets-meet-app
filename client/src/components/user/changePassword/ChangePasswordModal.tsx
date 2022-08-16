import React, { MutableRefObject, useRef, useState } from "react";
import { Modal, Input } from "@nextui-org/react"

import { updatePassword } from "../../../api/user/updatePassword"

type componentType = {
  isOpen: boolean,
  setOpen: Function
}

const ChangePasswordModal = ({isOpen, setOpen}: componentType) => {
  const [err, setErr] = useState("")
  const prevPassRef = useRef() as MutableRefObject<HTMLInputElement>
  const newPassRef = useRef() as MutableRefObject<HTMLInputElement>
  const retypeNewPassRef = useRef() as MutableRefObject<HTMLInputElement>
    
  async function submitHandler() {
    if (!prevPassRef.current?.value) return setErr("Please enter previous password")
    if (!newPassRef.current?.value) return setErr("Please enter new password")
    if (!retypeNewPassRef.current?.value) return setErr("Please retype new password")

    if (newPassRef.current.value !== retypeNewPassRef.current.value) return setErr("Passwords not match")

    const res = await updatePassword(prevPassRef.current.value ,newPassRef.current.value)
    //@ts-ignore
    if (res.err) return setErr(res.err)
    window.location.reload()
  }

return (
  <Modal
  open={isOpen}
  onClose={() => setOpen(false)}
  aria-labelledby="modal-title"
  >
      <Modal.Header>
          <p style={{ fontWeight: "bold", fontSize: "24px"}}>Edit your profile data</p>
      </Modal.Header>
      <Modal.Body>
      <Input.Password
          clearable
          color="warning"
          type="password"
          label="Previous password"
          placeholder="Enter previous password"
          ref={prevPassRef}
      />
      <Input.Password
          clearable
          color="warning"
          helperText={err}
          type="password"
          label="New password"
          placeholder="Enter new password"
          ref={newPassRef}
        />
        <Input.Password
          clearable
          color="warning"
          type="password"
          label="Retype new password"
          placeholder="Retype your password"
          ref={retypeNewPassRef}
        />
      </Modal.Body>
      <Modal.Footer>
      {/* @ts-ignore */}
      <button onClick={submitHandler} className="modal-button">
          Update
      </button>
      </Modal.Footer>

  </Modal>
)
};

export default ChangePasswordModal;
