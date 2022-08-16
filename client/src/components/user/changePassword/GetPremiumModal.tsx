import React from 'react'

import { Modal, Input } from "@nextui-org/react"

type modalType = {
    isOpen: boolean,
    setOpen: Function
}

const GetPremiumModal = ({isOpen, setOpen}: modalType) => {
  return (
    <Modal
    open={isOpen}
    onClose={() => setOpen(false)}
    aria-labelledby="modal-title"
    >
        <Modal.Header>
            <p style={{ fontWeight: "bold", fontSize: "24px"}}>Get premium</p>
        </Modal.Header>
        <Modal.Body>
            This page is comming soon
        </Modal.Body>
        <Modal.Footer>
        {/* @ts-ignore */}
        <button className="modal-button">
            Get premium
        </button>
        </Modal.Footer>
  
    </Modal>
  )
}

export default GetPremiumModal