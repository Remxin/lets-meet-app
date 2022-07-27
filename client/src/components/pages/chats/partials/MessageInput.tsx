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
import faceEmojis from '../emojis/faceEmojis.json'
import handEmojis from '../emojis/handEmojis.json'

const MessageInput = ({sendMessageFun}: any) => {
    const [isUserWriting, setIsUserWriting] = useState(false)
    const [message, setMessage] = useState("")

    console.log(faceEmojis, handEmojis)
    const messageInputRef = useRef() as MutableRefObject<HTMLInputElement>
    const faceEmojisRef = useRef() as MutableRefObject<HTMLDivElement>
    const handEmojisRef = useRef() as MutableRefObject<HTMLDivElement>

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

//@ts-ignore
    function moveCaretAtEnd(e) {
        var temp_value = e.target.value
        e.target.value = ''
        e.target.value = temp_value
      }

    return (
        <>
            <Input animated={false} contentClickable={true} placeholder='Type a message...' className='input' onChange={(e) => setMessage(e.target.value)} bordered ref={messageInputRef} onFocus={moveCaretAtEnd} contentRight={
                <Popover onClose={() => messageInputRef.current.focus()}>
                <PopoverTrigger>
                    <Button className='trigger-button'><FaSmile className='popover-trigger'/></Button>
                </PopoverTrigger>
                <PopoverContent className='popover-content' width={100 + "px"}>
                <PopoverArrow />
                     <PopoverHeader className='popover-header'>
                         <button onClick={() => faceEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{faceEmojis[0]}</button>
                         <button onClick={() => handEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{handEmojis[0]}</button>
                     </PopoverHeader>
                     {/* <PopoverCloseButton /> */}
                     <PopoverBody className='popover-body'>
                        <div className="emojis-content" ref={faceEmojisRef}>
                             {faceEmojis.map((emoji: string) => {
                                 return <button className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</button>
                             })}
                        </div>
                        <div className="emojis-content" ref={handEmojisRef}>
                            {handEmojis.map((emoji: string) => {
                                 return <button className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</button>
                             })}
                        </div>
                     </PopoverBody>
                     <PopoverFooter></PopoverFooter>
                </PopoverContent>
            </Popover>
            
            } onKeyPress={(e) => inputHandler(e)}/>
            <button className='button'>{isUserWriting ? <FaArrowAltCircleRight color="orangered" onClick={sendMessage}/> : <FaHeart color='tomato'/>}</button>
        </>
    )
}

export default MessageInput