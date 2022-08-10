import React, { useState, useContext, useEffect, useMemo } from 'react'
import { UserContext } from "../../../../contexts/UserContext"

import { motion, useAnimation, useMotionValue } from "framer-motion"
import { contentVariants, containerVariants } from "../animations/sideChatVariants"
import { Popover,PopoverTrigger, PopoverContent, PopoverArrow } from '@chakra-ui/react'
import ChoseModal from '../../../../modules/ChoseModal'

import { FaEllipsisV } from "react-icons/fa"
import ConfirmationModal from '../../../../modules/ConfirmationModal'


type LastMessageType = {
  user: String,
  userId: String,
  message: String,
  timestamps: number
}

const Chat = ({data, setMainChatId, mainChatId}: any) => {
  //@ts-ignore
  const { user } = useContext(UserContext)
  const contentVariant = useAnimation()
  const containerVariant = useAnimation()


   const [isHover, setIsHover] = useState(false)
   const [showMoveMenu, setShowMoveMenu] = useState(false)
  const [moveMenu, setMoveMenu] = useState(false)

  //  console.log(showMoveMenu)
  
  useEffect(() => {
    if (data._id === mainChatId) {
      containerVariant.start("selected")
    } else {
      containerVariant.start("initial")
    }
  }, [mainChatId])

  useEffect(() => {
    console.log("zmienia showMenu")
  }, [showMoveMenu])
  const choseModal = useMemo(() => {
    // return <OwnChoseModal/>
     return <ChoseModal visible={showMoveMenu} setVisible={setShowMoveMenu} title="Chose section you want to move chat to" optionArr={["a", "b"]} confirmHandler={() => console.log("jest")}/> 
  }, [showMoveMenu])

  const lastMessageData = data.messages[data.messages.length - 1]

 const lastMessageText = lastMessageData.message.length > 20 ? lastMessageData.message.slice(0, 20) + "..." : lastMessageData.message
  return (
    <motion.div className="chat-container" variants={containerVariants} whileHover="hover" onClick={(e) => setMainChatId(data._id)} animate={containerVariant} initial="initial"
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      
    >
      <motion.div className='chat-content'
        animate={contentVariant}
        variants={contentVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <img src={`${process.env.REACT_APP_SERVER_IP}/get/event-image?eventId=${data.event._id}`} alt="event image" className='event-image'/>
        <div className="text">
          <h4 className='chat-title'>{data.event.name}</h4>
          {lastMessageData ? <><p className="last-message">{user._id === lastMessageData.userId ? "You" : lastMessageData.user}: {lastMessageText} <span className="timestamps">{}</span></p></> : null}
        </div>
        
      </motion.div>
        { isHover ? 
        <>
          <FaEllipsisV className='menu-icon' onClick={(e) => {
            e.stopPropagation()
            console.log("idzie")
            setShowMoveMenu(true)
          }}/>
          {/* <ConfirmationModal visible={showMoveMenu} setVisible={setShowMoveMenu} title="Chose section you want to move chat to" text={"ab"} confirmHandler={() => console.log("jest")}/> */}
        </> : null}
         {choseModal}
    </motion.div>
  )
}

export default Chat