import React, { useState, useContext } from 'react'
import { UserContext } from '../../../../contexts/UserContext'

const Message = ({text, userName, userId, timestamps}: any) => {
    //@ts-ignore
    const { user } = useContext(UserContext)
    const [isOwner, setIsOwner] = useState(userId === user._id)

  return (
    <div className='message-container' style={{justifyContent: isOwner ? "flex-end" : "flex-start" }}>
        <div className="message-content" style={{ backgroundColor: isOwner ? "#F0A34B" : "#454545" }}>{text}
        </div>    
    </div>
  )
}

export default Message