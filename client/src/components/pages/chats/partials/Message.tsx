import React, { useState, useContext } from 'react'
import { UserContext } from '../../../../contexts/UserContext'

import { motion } from "framer-motion"

const messageVariants = {
  initial: {
    opacity: 0.8,
    scale: .8
  },

  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150
    }
  }
}

const Message = ({text, userName, userId, timestamps}: any) => {
    //@ts-ignore
    const { user } = useContext(UserContext)
    const [isOwner, setIsOwner] = useState(userId === user._id)

  return (
    <motion.div variants={messageVariants} initial="initial" animate="animate" className='message-container' style={{justifyContent: isOwner ? "flex-end" : "flex-start" }}>
        <div className="message-content" style={{ backgroundColor: isOwner ? "#F0A34B" : "#454545" }}>{text}
        </div>    
    </motion.div>
  )
}

export default Message