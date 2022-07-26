import React, { useState, useMemo, useEffect, useRef, MutableRefObject } from 'react'
import Chat from './Chat'


// graphical
import { FaAngleDown, FaTrashAlt } from 'react-icons/fa'
import { motion, useAnimation } from 'framer-motion'

// animations
import { sectionVariants, titleVariants, arrowVariants } from "../animations/variants"




// types
type SectionProps = {
  name: String,
  chats: any[],
  chatManager: any,
  sectionManager: any
}

const Section = ({name, chats, chatManager, sectionManager}: SectionProps) => {
  const sectionVariant = useAnimation()
  const arrowVariant = useAnimation()
  const titleVariant = useAnimation()
  const [sectionOpened, setSectionOpened] = useState(false)
  const [showRemoveBin, setShowRemoveBin] = useState(false)

  const titleRef = useRef() as MutableRefObject<HTMLSpanElement>

  
  useEffect(() => {
    // console.log(sectionOpened)
    if (sectionOpened) {
      titleVariant.start("clickDark")
      arrowVariant.start("unrotate")
      sectionVariant.start("showContent")
      
    } else {
      // console.log('unrotate')
      arrowVariant.start("rotate")
      titleVariant.start("clickLight") 
      sectionVariant.start("hideContent")
    }
  }, [sectionOpened])




  return (
    <motion.div className="section"
      animate={sectionVariant}
      variants={sectionVariants}
    >
        <motion.span className='section__title' 
        ref={titleRef}
        animate={titleVariant}
        variants={titleVariants}
        onClick={() => setSectionOpened(prev => !prev)}
        whileHover="hover"
        onMouseEnter={() => setShowRemoveBin(true)}
        onMouseLeave={() => setShowRemoveBin(false)}
        whileTap="hold"
        ><h2>{name}</h2> <motion.div className='arrow-container' animate={arrowVariant} variants={arrowVariants}><FaAngleDown className='arrow'/></motion.div> {showRemoveBin && name !== "other" && name !== "my events chats" ? <FaTrashAlt className='bin'/> : null}</motion.span>
        <div>
            {chats.map((chat:any) => {
                return <Chat data={chat} setMainChatId={chatManager.setMainChatId} mainChatId={chatManager.mainChatId}/>
            })}
        </div>

    </motion.div>
  )
}

export default Section