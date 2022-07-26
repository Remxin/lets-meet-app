import React, { MutableRefObject, useEffect, useRef } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import { Input, Button } from "@nextui-org/react"

const MainChat = ({ chatManager }:any) => {
  const chatContentRef = useRef() as MutableRefObject<HTMLDivElement>
  const messagesEndRef = useRef() as MutableRefObject<HTMLDivElement>
  useEffect(() => {
    console.log("idzie")
    console.log(messagesEndRef.current)
    // chatContentRef.current?.scrollIntoView({ behavior: "smooth"})
    // chatContentRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest"})
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end"})
  }, [chatManager.mainChat?.messages, chatManager])

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
      <div className="chat-content" ref={chatContentRef}>
        {chatManager.mainChat.messages.map((message: any) => {
          return <Message text={message.message} userName={message.user} userId={message.userId} timestamps={message.timestamps}/>
        })}
        <div className="messages-end" ref={messagesEndRef}/>
      </div>
      <div className="message-input">
        <MessageInput sendMessageFun={chatManager.sendMessage}/>
      </div>
    </div>
  )
}

export default MainChat