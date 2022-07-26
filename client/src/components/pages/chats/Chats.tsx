// --- logical imports ---
import React, { useEffect, useMemo } from 'react'
import { useChat } from '../../../hooks/useChat'

// --- graphical imports ---
import "../../../styles/scss/pagesComponents/chat/chat.scss"
import { Card, Loading } from "@nextui-org/react"
import Section from './partials/Section'
import MainChat from './partials/MainChat'
import { FaArrowLeft } from "react-icons/fa"
import { NavLink } from 'react-router-dom'


const Chats = () => {
  //@ts-ignore
  const { isSocketConnecting, areChatsLoading, isConnectionError, chatManager, sectionManager } = useChat()

  // useEffect(() => { // this is only for testing useChat utilities
  //   setTimeout(() => {
  //     sectionManager.createNewChatSection("other")
  //     // chatManager.positionChat("625dac2deefa984cdd54164f", 2, "favourites")
  //   }, 1500)
  // }, [])

 
  const Sections = useMemo(() => {
    const sectionName_chats = Object.entries(chatManager.allChats)
    console.log(sectionName_chats)
    return sectionName_chats
  }, [chatManager.allChats])


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
      <div className='special-nav'>
        <NavLink to="/"> <FaArrowLeft/> Return to home </NavLink>
      </div>
      <div className='chats-content'>
        <div className="chats-list">
          <div className="section-menu"></div>
          {areChatsLoading ? <Loading size='md'>Loading chats...</Loading> : null}
          {Sections.map(([sectionName, chats]) => {
            //@ts-ignore
            return <Section name={sectionName} chats={chats} chatManager={chatManager} sectionManager={sectionManager}/>
          })}
        </div>
        <div className="main-chat-content">
          <MainChat chatManager={chatManager}/>
        </div>
      </div>
    </Card>
  )
}

export default Chats