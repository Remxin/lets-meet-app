// --- logical imports ---
import React, { useRef, useMemo, useState, MutableRefObject, useEffect } from 'react'
import { useChat } from '../../../hooks/useChat'

// --- graphical imports ---
import "../../../styles/scss/pagesComponents/chat/chat.scss"
import "../../../styles/scss/pagesComponents/chat/576.scss"
import "../../../styles/scss/pagesComponents/chat/769.scss"
import { Card, Loading, Input, Button } from "@nextui-org/react"
import Section from './partials/Section'
import MainChat from './partials/MainChat'
import { FaArrowLeft, FaPlusSquare, FaTimesCircle } from "react-icons/fa"
import { NavLink } from 'react-router-dom'

import ConfirmationModal from '../../../modules/ConfirmationModal'



const Chats = () => {
  //@ts-ignore
  const { isSocketConnecting, areChatsLoading, isConnectionError, chatManager, sectionManager } = useChat()
  const [ wantToAddNewSection, setWantToAddNewSection] = useState(false)
  const [showAddSectionSummary, setShowAddSectionSummary] = useState(false)
  const addSectionInputRef = useRef() as MutableRefObject<HTMLInputElement>
 
  const Sections = useMemo(() => {
    const sectionName_chats = Object.entries(chatManager.allChats)
    console.log(sectionName_chats)
    return sectionName_chats
  }, [Object.keys(chatManager.allChats).length])


  useEffect(() => {
    if (wantToAddNewSection) addSectionInputRef.current.focus()
  }, [wantToAddNewSection])

  function showAddSectionMenu (e: React.KeyboardEvent) {
    // console.log(e.key)
    if (e.key === "Enter") setShowAddSectionSummary(true)
 
  }

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
      <div className='chats-content'>
        <div className="chats-list">
          <div className="section-menu">
            {!wantToAddNewSection ? 
              <label className='one-line' onClick={() => setWantToAddNewSection(true)}>
              <FaPlusSquare/>
              <p>Add new section</p>
              </label> :
            <div className='one-line'>
            <FaTimesCircle onClick={() => setWantToAddNewSection(false)}/>
            <Input placeholder='Press enter to add' animated={false} size="xs" onKeyDown={showAddSectionMenu} ref={addSectionInputRef}/>
            </div>
          }
          </div>
          {areChatsLoading ? <Loading size='md'>Loading chats...</Loading> : null}
          {Sections.map(([sectionName, chats]) => {
            //@ts-ignores
            return <Section name={sectionName} chats={chats} chatManager={chatManager} sectionManager={sectionManager}/>
          })}
        </div>
        <div className="main-chat-content">
          <MainChat chatManager={chatManager}/>
        </div>
      </div>
      <ConfirmationModal visible={showAddSectionSummary} setVisible={setShowAddSectionSummary} confirmHandler={() => {
        sectionManager.createNewChatSection(addSectionInputRef.current?.value)
        setWantToAddNewSection(false)
      }} title={"Add section \"" + addSectionInputRef.current?.value + "\" ?"} text="Are you sure?" />
    </Card>
  )
}

export default Chats