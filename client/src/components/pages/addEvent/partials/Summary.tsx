import React from 'react'
import "../../../../styles/scss/pagesComponents/addEvent/summary.scss"

import { Text } from "@chakra-ui/react"
import { Button, Grid, Card } from "@nextui-org/react"
import SummaryBoolItem from './SummaryBoolItem'
import { motion } from 'framer-motion'
import ts from 'typescript'

type SummaryType = {
    name: String,
    description: string,
    restrictions: String[],
    city: String,
    place: String,
    premium: Boolean,
    openChat: Boolean,
    openEvent: Boolean,
    setShowThisMenu: Function,
    setShowConfirmation: Function
}

const Summary = ({name, description, restrictions, city, place, premium, openChat, openEvent, setShowThisMenu, setShowConfirmation}: SummaryType) => {
  const restrictionsLi = restrictions.map((restriction) => {
    return <li><Text fontSize="xs">{restriction}</Text></li>
  })
  
  console.log(place)
  return (
 
        <Grid.Container gap={2} justify="flex-start" className='summary'>
            <motion.div
                className='summary-animation-div'
                animate={{
                    scale: 1,
                    opacity: 1
                }}
                initial={{
                    scale: 0.3,
                    opacity: 0.3
                }}
                exit={{
                    scale: 0.3,
                    opacity: 0.3
                }}
                transition={{
                    duration: 0.3, ease: "easeOut"
                }}
    >
        <Card className='summary-content'>
                <Text fontSize="xl" className='center'>Event name: {name}</Text>
                <Text fontSize="sm">Restrictions: </Text>
                <ul className='restricions-list'>
                    {restrictionsLi}
                </ul>
                <Text fontSize="sm" >City: {city}</Text>
                <Text fontSize="sm" >Place: {place.charAt(0) == "^" ? "own place" : "public place"}</Text>
                <SummaryBoolItem isTrue={premium} text="Premium Event"/>
                <SummaryBoolItem isTrue={openChat} text="Everyone can write on chat"/>
                <SummaryBoolItem isTrue={openEvent} text="Everybody can join"/>
                <h2>Description: </h2>
                <div className='summary__description' dangerouslySetInnerHTML={{__html: description}}/>
                <div className="buttons">
                    <Button shadow color="error" onClick={() => setShowThisMenu(false)} className="button" auto ghost>Reject</Button>
                    <Button shadow color="success" onClick={() => {
                        setShowThisMenu(false)
                        setShowConfirmation(true)}
                    } className="button" auto ghost>Add place</Button>
                </div>
                </Card>
            {/* </Grid> */}
            </motion.div>     
        </Grid.Container>
     
  )
}

export default Summary