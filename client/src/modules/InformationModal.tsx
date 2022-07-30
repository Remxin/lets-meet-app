import React from 'react'
import { Modal, Button} from "@nextui-org/react"

import { motion } from "framer-motion"
 
type ComponentType = {
    visible: boolean,
    setVisible: Function,
    errorText: string
}

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

const InformationModal = ({visible, setVisible, errorText}: ComponentType) => {
  return (
    <Modal
    closeButton
    aria-labelledby="modal-title"
    open={visible}
    // onClose={closeHandler}
  >
    <Modal.Header>
          <motion.p variants={textVariants} initial="initial" animate="animate" style={{ fontWeight: "bold", fontSize: "24px"}}>Error</motion.p>
    </Modal.Header>
    <Modal.Body>
        <motion.p variants={textVariants} initial="initial" animate="animate" style={{ textAlign: "center"}}>{errorText}</motion.p>
    </Modal.Body>
    <Modal.Footer>
      <Button auto onClick={() => setVisible(false)}>
        OK
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default InformationModal