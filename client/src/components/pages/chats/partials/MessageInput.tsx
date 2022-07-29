import React, { useState, useRef, MutableRefObject, useEffect, useMemo } from 'react'
import { Input, Text } from "@nextui-org/react"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    Button
  } from '@chakra-ui/react'
// import { Pop} from "@nextui-org/react"
import { FaSmile, FaHeart, FaArrowAltCircleRight } from "react-icons/fa"

// emojis
import faceEmojis from '../emojis/faceEmojis.json'
import handEmojis from '../emojis/handEmojis.json'
import natureEmojis from '../emojis/natureEmojis.json'
import foodDringEmojis from '../emojis/foodDrinkEmojis.json'
import symbolEmojis from '../emojis/symbolEmojis.json'
import placesEmojis from '../emojis/placesEmojis.json'
import objectEmojis from '../emojis/objectEmojis.json'
import flagsEmojis from '../emojis/flagsEmojis.json'

// animations
import { motion } from "framer-motion"
import { emojiChose, emojiNavIcon } from "../animations/emojiVariants"

const MessageInput = ({sendMessageFun}: any) => {
    const [isUserWriting, setIsUserWriting] = useState(false)
    const [message, setMessage] = useState("")

    const messageInputRef = useRef() as MutableRefObject<HTMLInputElement>
    const faceEmojisRef = useRef() as MutableRefObject<HTMLDivElement>
    const handEmojisRef = useRef() as MutableRefObject<HTMLDivElement>
    const natureEmojisRef = useRef() as MutableRefObject<HTMLDivElement>
    const foodDringEmojisRef = useRef() as MutableRefObject<HTMLDivElement>
    const symbolEmojisRef = useRef() as MutableRefObject<HTMLDivElement>
    const placesEmojisRef = useRef() as MutableRefObject<HTMLDivElement>
    const objectEmojisRef = useRef() as MutableRefObject<HTMLDivElement>
    const flagsEmojisRef = useRef() as MutableRefObject<HTMLDivElement>

    useEffect(() => {
        if (message !== "") return setIsUserWriting(true)
  
        setIsUserWriting(false)
    }, [message])

    function inputHandler (e: React.KeyboardEvent) {
        if (e.key === "Enter" && messageInputRef.current.value !== "") sendMessage()
    }

    function sendMessage () {
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

      const emojisNav = useMemo(() => {
          return (
            <>
                <motion.button variants={emojiNavIcon} whileHover="hover" onClick={() => faceEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{faceEmojis[0]}</motion.button>
                <motion.button variants={emojiNavIcon} whileHover="hover" onClick={() => handEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{handEmojis[0]}</motion.button>
                <motion.button variants={emojiNavIcon} whileHover="hover" onClick={() => natureEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{natureEmojis[0]}</motion.button>
                <motion.button variants={emojiNavIcon} whileHover="hover" onClick={() => foodDringEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{foodDringEmojis[0]}</motion.button>
                <motion.button variants={emojiNavIcon} whileHover="hover" onClick={() => symbolEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{symbolEmojis[0]}</motion.button>
                <motion.button variants={emojiNavIcon} whileHover="hover" onClick={() => placesEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{placesEmojis[0]}</motion.button>
                <motion.button variants={emojiNavIcon} whileHover="hover" onClick={() => objectEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{objectEmojis[0]}</motion.button>
                <motion.button variants={emojiNavIcon} whileHover="hover" onClick={() => flagsEmojisRef.current.scrollIntoView({ behavior: "smooth", block: "start"})}>{flagsEmojis[0]}</motion.button>
            </>
          )
      }, [])
      const emojisSections = useMemo(() => {
          return (
              <>
         <div className="emojis-content" ref={faceEmojisRef}>
                {faceEmojis.map((emoji: string) => {
                    return <motion.button variants={emojiChose} whileTap="click" className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</motion.button>
                })}
        </div>
        <div className="emojis-content" ref={handEmojisRef}>
            {handEmojis.map((emoji: string) => {
                    return <motion.button variants={emojiChose} whileTap="click" className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</motion.button>
                })}
        </div>
        <div className="emojis-content" ref={natureEmojisRef}>
            {natureEmojis.map((emoji: string) => {
                    return <motion.button variants={emojiChose} whileTap="click" className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</motion.button>
                })}
        </div>
        <div className="emojis-content" ref={foodDringEmojisRef}>
            {foodDringEmojis.map((emoji: string) => {
                    return <motion.button variants={emojiChose} whileTap="click" className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</motion.button>
                })}
        </div>
        <div className="emojis-content" ref={symbolEmojisRef}>
            {symbolEmojis.map((emoji: string) => {
                    return <motion.button variants={emojiChose} whileTap="click" className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</motion.button>
                })}
        </div>
        <div className="emojis-content" ref={placesEmojisRef}>
            {placesEmojis.map((emoji: string) => {
                    return <motion.button variants={emojiChose} whileTap="click" className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</motion.button>
                })}
        </div>
        <div className="emojis-content" ref={objectEmojisRef}>
            {objectEmojis.map((emoji: string) => {
                    return <motion.button variants={emojiChose} whileTap="click" className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</motion.button>
                })}
        </div>
        <div className="emojis-content" ref={flagsEmojisRef}>
            {flagsEmojis.map((emoji: string) => {
                    return <motion.button variants={emojiChose} whileTap="click" className='emoji' onClick={() => messageInputRef.current.value += emoji}>{emoji}</motion.button>
                })}
        </div> 
        </>
          )
      }, [])

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
                        {emojisNav}
                     </PopoverHeader>
                     {/* <PopoverCloseButton /> */}
                     <PopoverBody className='popover-body'>
                         {emojisSections}
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