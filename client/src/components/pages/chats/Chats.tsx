// --- logical imports ---
import React from 'react'
import { useChat } from '../../../hooks/useChat'

// --- graphical imports ---
import "../../../styles/scss/pagesComponents/chat/chat.scss"
import { Card } from "@nextui-org/react"


const Chats = () => {
  // const {} = useChat()
  return (
    <Card className='chats'>
      <div className="chats-list"></div>
      <div className="main-chat-content"></div>
    </Card>
  )
}

export default Chats