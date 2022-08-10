import React, { MutableRefObject, useContext, useEffect, useRef, useState} from 'react'
import { AddPlaceContext } from '../../../../contexts/AddPlaceContext'

//UI
import { Card, Grid} from "@nextui-org/react"
import JoditEditor from 'jodit-react'

//animation
import { motion, useAnimation} from "framer-motion"
import { errorVariants } from '../variants/errorVariants'

const Phase3 = ({phaseIncrementer}: any) => {
  const errorVariant = useAnimation()
  //@ts-ignore
  const { description, setDescription } = useContext(AddPlaceContext)

  const descriptionRef = useRef() as MutableRefObject<HTMLTextAreaElement>
  const [err, setErr] = useState("")

  function displayError(error: string) {
    errorVariant.start("animate")
    setErr(error)
  }

  function handleNextPhase() {
    if (!descriptionRef.current?.value) return displayError("Please enter description")
    setDescription(descriptionRef.current.value)
    phaseIncrementer((prev:number) => prev + 1)
  }

  return (
    <Grid.Container  className='add-place-phase-content'>
        <JoditEditor
            value={description}
            config={{placeholder: "Place description: ", maxLenght: 200}}
            //@ts-ignore
            tabIndex={1} // tabIndex of textarea
            //@ts-ignore
            ref={descriptionRef}
        />
        <motion.p variants={errorVariants} initial="initial" animate={errorVariant} className='err'>{err}</motion.p>
        <motion.div className='phase-footer'>
            <motion.button onClick={() => phaseIncrementer((prev:number) => prev - 1)} className="prev">Previous step</motion.button>
            <motion.button onClick={handleNextPhase} className="next">Next step</motion.button>
        </motion.div>
    </Grid.Container>
  )
}

export default Phase3