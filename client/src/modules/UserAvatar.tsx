import React, { useEffect, useState, useCallback } from 'react'
import "../styles/scss/modules/UserAvatar.scss"

import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Modal, Text } from "@nextui-org/react"
import FileInput from "../modules/FileInput"
import ConfirmationModal from '../modules/ConfirmationModal'

import { addAvatar } from "../api/user/addAvatar"

type userAvatarType = {
    userId: string,
    premium: boolean
    canChange?: boolean,
    className: string
}

const changeAvatarBoxVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            duration: .3
        }
    },
    exit: {
        opacity: 0
    }
}

const UserAvatar = ({userId, premium, canChange = false, className = ""}: userAvatarType) => {
    const [isHovered, setIsHovered] = useState(false)
    const [openChangeMenu, setOpenChangeMenu] = useState(false)
    const [file, setFile] = useState(null)
    const [fileError, setFileError] = useState("")
    const changeAvatarBoxController = useAnimation()

    const addAvatarFun = useCallback(() => {
        if (!file) return setFileError("Selected the same file")
        addAvatar(file)
    }, [file])

    useEffect(() => {
        if (!canChange) return
        if (isHovered) {
            changeAvatarBoxController.start("animate")
        } else {
            changeAvatarBoxController.start("initial")
        }
    }, [isHovered])
    

if (canChange) {
    return (
      <div className={`avatar-content ${className}`} style={{
          boxShadow: "0 0 5px black"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
          <img src={`${process.env.REACT_APP_SERVER_IP}/get/user/avatar?userId=${userId}`} alt="user avatar" className="user-avatar" />
          { premium ? <img src="premiumBorder.png" alt="premium border" className="premium-border"/> : null}
          <AnimatePresence>
            {isHovered ? <motion.div variants={changeAvatarBoxVariants} animate={changeAvatarBoxController} initial="initial" exit="exit" className='change-box' onClick={() => {
                setOpenChangeMenu(true)
                setIsHovered(false)
                setFileError("")
            }}>Change profile image</motion.div> : null}
          </AnimatePresence>
          <Modal
          closeButton
          aria-labelledby="modal-title"
          open={openChangeMenu}
          onClose={() => setOpenChangeMenu(false)}
          >
                <Modal.Header>
          <Text className="modal-title" size={18}>
            Change your profile image
          </Text>
        </Modal.Header>
        <Modal.Body>
            {/* @ts-ignore */}
            <FileInput setFile={setFile}/>
            <p className='add-avatar-error'>{fileError}</p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => {
              if (!file) return setFileError("Selected the same file")
              addAvatarFun()
              setTimeout(() => {
                  window.location.reload()
              }, 500)
          }} className="change-avatar-button">Apply changes</button>
        </Modal.Footer>
          </Modal>
        </div>
    )
}

return (
    <div className={`avatar-content ${className}`} style={{
        boxShadow: "0 0 5px black"
    }}
    >
        <img src={`${process.env.REACT_APP_SERVER_IP}/get/user/avatar?userId=${userId}`} alt="user avatar" className="user-avatar" />
        { premium ? <img src="premiumBorder.png" alt="premium border" className="premium-border"/> : null}
        {/* {isHovered ? <div>Change image</div> : null} */}
      </div>
)

}

export default UserAvatar