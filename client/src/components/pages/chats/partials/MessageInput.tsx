import React, { useState, useRef, MutableRefObject, useEffect } from 'react'
import { Input, Text } from "@nextui-org/react"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Portal,
    Button
  } from '@chakra-ui/react'
// import { Pop} from "@nextui-org/react"
import { FaSmile, FaHeart, FaArrowAltCircleRight } from "react-icons/fa"

const MessageInput = ({sendMessageFun}: any) => {
    const [isUserWriting, setIsUserWriting] = useState(false)
    const messageInputRef = useRef() as MutableRefObject<HTMLInputElement>
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (messageInputRef.current?.value !== "") {
            setIsUserWriting(true)
            return
        }
        setIsUserWriting(false)
    }, [message])

    function inputHandler (e: React.KeyboardEvent) {
        if (e.key === "Enter" && messageInputRef.current.value !== "") sendMessage()
    }

    function sendMessage () {
        console.log(messageInputRef.current.value)
        sendMessageFun(messageInputRef.current.value)
        messageInputRef.current.value = ""
        setMessage("")
    }

    return (
        <>
            <Input animated={false} contentClickable={true} placeholder='Type a message...' className='input' onChange={(e) => setMessage(e.target.value)} bordered ref={messageInputRef} contentRight={
                <Popover>
                <PopoverTrigger>
                    <Button><FaSmile className='popover-trigger'/></Button>
                </PopoverTrigger>
                <PopoverContent>
                <PopoverArrow />
                     <PopoverHeader>Header</PopoverHeader>
                     <PopoverCloseButton />
                     <PopoverBody>
                         <a href='#'>link do niczego</a>
                     </PopoverBody>
                     <PopoverFooter>This is the footer</PopoverFooter>
                </PopoverContent>
            </Popover>
            
            } onKeyPress={(e) => inputHandler(e)}/>
            <button className='button'>{isUserWriting ? <FaArrowAltCircleRight color="orangered" onClick={sendMessage}/> : <FaHeart color='tomato'/>}</button>
        </>
    )
}

export default MessageInput