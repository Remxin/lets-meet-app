import React, { MutableRefObject, useEffect, useRef, useMemo } from 'react'
import Message from './Message'
import MessageInput from '../../../../modules/MessageInput'
import { Input, Button } from "@nextui-org/react"

import { motion } from "framer-motion"

const MainChat = ({ chatManager }:any) => {
  const chatContentRef = useRef() as MutableRefObject<HTMLDivElement>
  const messagesEndRef = useRef() as MutableRefObject<HTMLDivElement>

  useEffect(() => { // always scroll to the bottom of the chat, after writing a message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end"})
  }, [chatManager.mainChat?.messages, chatManager])

  const messagesData = useMemo(() => {
    if (!chatManager.mainChat?.messages) return <p>Send first message...</p>
    const messagesCount = chatManager.mainChat.messages.length
    let iterator = 0
    let lastUserIdArr: string[] = []
    return chatManager.mainChat.messages.map((message: any) => {
      iterator++
      lastUserIdArr.push(message.userId)
      console.log(lastUserIdArr, iterator);
      
      return <Message key={Date.now() + Math.random()} text={message.message} userName={message.user} userId={message.userId} timestamps={message.timestamps} iterator={iterator} messagesCount={messagesCount} lastUserId={iterator > 1 ? lastUserIdArr[iterator - 2] : null}/>
    })
  }, [chatManager.mainChat?.messages.length])

  if (!chatManager.mainChat) {
    return (
      <div className='main-chat-container'>
        Choose chat you want to write in
      </div>
    )
  }
  return (
    <div className='main-chat-container'>
      <div className="upper-menu"></div>
      <motion.div className="chat-content" ref={chatContentRef}>
        {messagesData}
        <div className="messages-end" ref={messagesEndRef}/>
      </motion.div>
      <div className="message-input">
        <MessageInput sendMessageFun={chatManager.sendMessage}/>
      </div>
    </div>
  )
}

export default MainChat