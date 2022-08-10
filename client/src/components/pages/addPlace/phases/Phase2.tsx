import React, { MutableRefObject, useRef, useState, useContext } from 'react'
import { AddPlaceContext } from '../../../../contexts/AddPlaceContext'

//UI
import { Card, Input, Grid } from '@nextui-org/react'
import GoogleMaps from '../../../../modules/GoogleMaps'

//animations
import { motion, useAnimation } from "framer-motion"
import { errorVariants } from '../variants/errorVariants'

const Phase2 = ({phaseIncrementer}:any) => {
  const errorVariant = useAnimation()
  //@ts-ignore
  const { localizationString, setLocalizationString} = useContext(AddPlaceContext)
    const googleStringRef = useRef() as MutableRefObject<HTMLInputElement>
    const [err, setErr] = useState("")

function displayError(error: string) {
  setErr(error)
  errorVariant.start("animate")
}

function nextHandler() {
  if (!localizationString) return displayError("Please enter google maps link")
  phaseIncrementer((prev: number) => prev + 1)
}

  return (

    <Grid.Container className='add-place-phase-content'>
      <h2>Localization</h2>
        <span><Input placeholder='Localization from google: ' bordered ref={googleStringRef} onChange={(e) => {
          setLocalizationString(e.target.value)
          setErr("")
        }} initialValue={localizationString}/><span>Show me how</span></span>
        <p>Place google localization should display here</p>
        <div className='maps'> 
          <GoogleMaps localizationString={localizationString} changeFun={setLocalizationString}/>
        </div>
    
      <motion.p variants={errorVariants} initial="initial" animate={errorVariant} className='err'>{err}</motion.p>
        <motion.div className='phase-footer'>
            <button onClick={() => phaseIncrementer((prev:number) => prev - 1)} className="prev">Previous step</button>
            <button onClick={nextHandler} className="next">Next step</button>
        </motion.div>
    </Grid.Container>
  )
}

export default Phase2