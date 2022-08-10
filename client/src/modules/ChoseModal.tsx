import React, { useState } from 'react'

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

const listVariants = {
    hidden: {
        opacity: 0.9
    },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.5
        }
    }
}

const listItemVariants = {
    hidden: {
        opacity: 0
    },
    show: {
        opacity: 1
    }
}

type ModuleType = {
    visible: boolean,
    setVisible: Function,
    confirmHandler: Function,
    title: string
    optionArr: string[],
}

const ChoseModal = ({ visible, setVisible, confirmHandler, title, optionArr }:ModuleType) => {

    const [selected, setSelected] = useState<null | string>(null)
    function closeFunction () {
        confirmHandler()
        setVisible(false)
    }
  return (
    <Modal
    className="modal"
    closeButton
    aria-labelledby="modal-title"
    open={visible}
    onClose={() => setVisible(false)}
  >
    <Modal.Header>
          <motion.p variants={textVariants} initial="initial" animate="animate" style={{ fontWeight: "bold", fontSize: "24px"}}>{title}</motion.p>
    </Modal.Header>
    <Modal.Body>
        <motion.ul variants={listVariants} initial="hidden" animate="show">
            {optionArr.map(option => {
                return <motion.li variants={listItemVariants} initial="hidden" animate="show" onClick={() => setSelected(option)} style={{
                    background: selected === option ? "#dcdcdc" : "none"
                }}>{option}</motion.li>
            })}
        </motion.ul>
    </Modal.Body>
    <Modal.Footer>
      <Button auto flat color="error" onClick={() => setVisible(false)}>
             Back
      </Button>
       {/* @ts-ignore */}
       <Button auto onClick={closeFunction}>
         Proceed
       </Button>
     </Modal.Footer>
  </Modal>
  )
}

export default ChoseModal