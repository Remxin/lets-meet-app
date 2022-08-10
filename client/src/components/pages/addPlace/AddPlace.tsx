import React, { useState, useContext, useMemo, useCallback } from 'react'
import { Card, Grid, Input, Loading } from "@nextui-org/react"
import { motion } from 'framer-motion'

import { AddPlaceContext } from '../../../contexts/AddPlaceContext'

import Phase1 from './phases/Phase1'
import Phase2 from './phases/Phase2'
import Phase3 from './phases/Phase3'
import Phase4 from './phases/Phase4'

import "../../../styles/scss/pagesComponents/addPlace/addPlace.scss"
import Confirmation from './phases/Confirmation'


const AddPlace = () => {
  const [phaseNumber, setPhaseNumber] = useState(1)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [website, setWebsite] = useState("")
  const [cityId, setCityId] = useState("")
  const [cityName, setCityName] = useState("Select City")  // using only for remembering the value by select
  const [localizationString, setLocalizationString] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState(null)
  
  //@ts-ignore
  const phaseSwitch = useCallback((phase:number) => {
    switch(phase) {
      case 1:
        return <Phase1 phaseIncrementer={setPhaseNumber}/>
      case 2: 
        return <Phase2 phaseIncrementer={setPhaseNumber}/>
      case 3: 
        return <Phase3 phaseIncrementer={setPhaseNumber}/>
      case 4: 
        return <Phase4 phaseIncrementer={setPhaseNumber}/>
      case 5:
        return <Confirmation/>
      default:
        return <Phase1 phaseIncrementer={setPhaseNumber}/>
    }
  }, [])

 
  return (
  // @ts-ignore
    <AddPlaceContext.Provider value={{name, setName, address, setAddress, website, setWebsite, cityId, setCityId, cityName, setCityName, localizationString, setLocalizationString, description, setDescription, files, setFiles}}>
    <Card className='add-place-container'>
      <Grid.Container direction='column'>
      <motion.div>
      <h2 className='phase-title'>Step {phaseNumber}/5</h2>
        {phaseSwitch(phaseNumber)}
      </motion.div>
      </Grid.Container>

    </Card>
    </AddPlaceContext.Provider>
  )
}

export default AddPlace