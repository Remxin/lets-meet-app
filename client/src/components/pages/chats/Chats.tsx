// --- logical imports ---
import React, { useEffect } from 'react'
import { useChat } from '../../../hooks/useChat'

// --- graphical imports ---
import "../../../styles/scss/pagesComponents/chat/chat.scss"
import { Card, Loading } from "@nextui-org/react"


const Chats = () => {
  //@ts-ignore
  const { isSocketConnecting, areChatsLoading, isConnectionError, chatManager, sectionManager } = useChat()
  // console.log(chatManager.allChats)
  // console.log(mainChat)

  useEffect(() => {
    setTimeout(() => {
    
      chatManager.setMainChatId("625dab1aeefa984cdd541644")
     
      // sectionManager.createNewChatSection("ccc")
    }, 1500)
  }, [])

  useEffect(() => {
    console.log(chatManager.mainChat)
    if (!chatManager.mainChatId) return
    setTimeout(() => {
      console.log(chatManager)
      chatManager.sendMessage("bbb")
    }, 1000)
  }, [chatManager.mainChat])




  // const chats

  if (isSocketConnecting) return (
    <Card className='chats'>
      <Loading size='lg'>Connecting to server...</Loading>
    </Card>
  )

  if (isConnectionError) return (
    <Card className='chats'>
      Error
    </Card>
  )

  return (
    <Card className='chats'>
      <div className="chats-list">
        {areChatsLoading ? <Loading size='md'>Loading chats...</Loading> : null}
      </div>
      <div className="main-chat-content"></div>
    </Card>
  )
}

export default Chats