// --- logical imports ---
import React, { useEffect } from 'react'
import { useChat } from '../../../hooks/useChat'

// --- graphical imports ---
import "../../../styles/scss/pagesComponents/chat/chat.scss"
import { Card, Loading } from "@nextui-org/react"


const Chats = () => {
  //@ts-ignore
  const { isSocketConnecting, areChatsLoading, isConnectionError, chatManager, sectionManager } = useChat()

  useEffect(() => { // this is only for testing useChat utilities
    setTimeout(() => {
      sectionManager.createNewChatSection("other")
      // chatManager.positionChat("625dac2deefa984cdd54164f", 2, "favourites")
    }, 1500)
  }, [])

 



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