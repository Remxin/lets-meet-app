import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from "../../../../contexts/UserContext"

import { motion, useAnimation } from "framer-motion"
import { contentVariants, containerVariants } from "../animations/sideChatVariants"


type LastMessageType = {
  user: String,
  userId: String,
  message: String,
  timestamps: number
}
const Chat = ({data, setMainChatId, mainChatId}: any) => {
  //@ts-ignore
  const { user } = useContext(UserContext)
  const [lastMessageData, setLastMessageData] = useState<LastMessageType | null>(data.messages[data.messages.length - 1])
  const contentVariant = useAnimation()
  const containerVariant = useAnimation()
  
  useEffect(() => {
    console.log(data._id === mainChatId)
    if (data._id === mainChatId) {
      containerVariant.start("selected")
    } else {
      containerVariant.start("initial")
    }
  }, [mainChatId])


  useEffect(() => {
    setLastMessageData(data.messages[data.messages.length - 1])
  })
  
  // console.log(data._id, mainChatId)
  return (
    <motion.div className="chat-container" variants={containerVariants} whileHover="hover" onClick={() => setMainChatId(data._id)} animate={containerVariant} initial="initial">
      <motion.div className='chat-content'
        animate={contentVariant}
        variants={contentVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <img src={`${process.env.REACT_APP_SERVER_IP}/get/event-image?eventId=${data.event._id}`} alt="event image" className='event-image'/>
        <div className="text">
          <h4 className='chat-title'>{data.event.name}</h4>
          {lastMessageData ? <><p className="last-message">{user._id === lastMessageData.userId ? "You" : lastMessageData.user}: {lastMessageData.message} <span className="timestamps">{}</span></p></> : null}
        </div>
        
      </motion.div>
    </motion.div>
  )
}

export default Chat