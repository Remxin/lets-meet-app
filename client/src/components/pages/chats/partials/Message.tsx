import React, { useState, useContext } from 'react'
import { UserContext } from '../../../../contexts/UserContext'

import { motion } from "framer-motion"
import UserAvatar from '../../../../modules/UserAvatar'

import userDataHelper from '../../../../helpers/userData'

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

const Message = ({text, userName, userId, timestamps, iterator, messagesCount, lastUserId}: any) => {
    //@ts-ignore
    const { user } = useContext(UserContext)
    const [isOwner, setIsOwner] = useState(userId === user._id)
    const [showTimeStamps, setShowTimeStamps] = useState(false)
    console.log(lastUserId, userId);
    
    const messageStyles = { backgroundColor: isOwner ? "#F0A34B" : "#cdcdcd", color: isOwner ? "#fff" : "#232323" }

  return (
    <motion.div variants={messageVariants} initial={iterator === messagesCount ? "initial" : "" } animate={iterator === messagesCount ? "animate" : ""} className='message-container' >
        <div className={isOwner ? 'message-content my-content' : "message-content friends-content"} style={{justifyContent: isOwner ? "flex-end" : "flex-start" }} onMouseEnter={() => setShowTimeStamps(true)} onMouseLeave={() => setShowTimeStamps(false)}>
          {isOwner ? <p style={messageStyles} className={isOwner ? "own-message" : "friend-message"}>{text}</p> : <>
            {lastUserId !== userId ? <>
              <UserAvatar userId={userId} canChange={false} premium={false} className="user-avatar"/> <p className="user-name-label">{userName}</p><p style={messageStyles} className="friend-message first-friend-message">
                {text}
            </p>  </> : <p style={messageStyles} className={isOwner ? "own-message" : "friend-message"}>{text}</p>} </>
         }
          {showTimeStamps ? <p className="timestamps">{userDataHelper.genTimeFormat(timestamps)}</p> : null}
        </div>    
    </motion.div>
  )
}

export default Message