import React, { MutableRefObject, ReactNode, useEffect, useRef } from 'react'

import { Modal, Text, Row, Checkbox, Button } from "@nextui-org/react"
import { motion } from 'framer-motion'

const textVariants = {
    initial: {
        opacity: 0,
        scale: 0.9
    },

    animate: {
        opacity: 1,
        scale: 1,
        transition: {delay: .3}
    }
}

type ModuleType = {
    visible: boolean,
    setVisible: Function,
    confirmHandler: Function,
    text: string
    title: string
}

const ConfirmationModal = ({ visible, setVisible, confirmHandler, text, title }:ModuleType) => {

    
    function closeFUnction () {
        confirmHandler()
        setVisible(false)
    }
  return (
    <Modal
    closeButton
    aria-labelledby="modal-title"
    open={visible}
    // onClose={closeHandler}
  >
    <Modal.Header>
          <motion.p variants={textVariants} initial="initial" animate="animate" style={{ fontWeight: "bold", fontSize: "24px"}}>{title}</motion.p>
    </Modal.Header>
    <Modal.Body>
        <motion.p variants={textVariants} initial="initial" animate="animate" style={{ textAlign: "center"}}>{text}</motion.p>
    </Modal.Body>
    <Modal.Footer>
      <Button auto flat color="error" onClick={() => setVisible(false)}>
        No
      </Button>
      {/* @ts-ignore */}
      <Button auto onClick={closeFUnction}>
        Yes
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default ConfirmationModal