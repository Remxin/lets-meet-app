import React, { useContext, useEffect, useCallback } from 'react'
import useFetch from "../../../../hooks/useFetch"

import { AddPlaceContext } from '../../../../contexts/AddPlaceContext'
import { uploadPlaceImages } from '../../../../api/place/uploadPlaceImages'
import { Grid, Loading, Card, Button } from "@nextui-org/react"
import { useNavigate } from 'react-router'

import { AnimatePresence, motion } from 'framer-motion'

import { FaCheckCircle } from 'react-icons/fa'

const Confirmation = () => {
  const navigate = useNavigate()
  //@ts-ignore
  const {name, address, website, cityId, localizationString, description, files} = useContext(AddPlaceContext)

  const fetchFunction = useCallback(() => {
    return uploadPlaceImages(files, name, address, website, cityId, localizationString, description )
  }, [])
    //@ts-ignore
    const {loading, error, data, startFetching} = useFetch(fetchFunction, true)

    const redirectToMenu = useCallback(() => {
      navigate("/")
      window.location.reload()
  }, [])

  const addAnotherPlace = useCallback(() => {
      window.location.reload()
  }, [])


  return (
    <Grid.Container className='confirmation'>
        <Card className="confirmation-content">
        <AnimatePresence>
            {loading ? (<Loading size="lg"/>) : null}
        </AnimatePresence>
        <AnimatePresence>
            {error ? (<p>Error</p>) : null}
        </AnimatePresence>
        <AnimatePresence>
            {data ? (
                <div className='result-container'>
            <motion.div className='result-block'
            initial={{
                top: 0,
                scale: .2,
                opacity: .2

            }}
            animate={{
                top: [0, 0, -30],
                scale: [1.3, 1.3, 1],
                opacity: 1,
                rotate: [0, 360, 360],
            }}
            transition={{
                duration: 1,
                ease: "easeOut",
            }}
            >
            <FaCheckCircle color='green' className='check-icon'/>
            </motion.div>
            <motion.p 
                initial={{
                    opacity: 0,
                    scale: .5
                }}
                animate={{
                    opacity: 1,
                    scale: [1.5, 1, 1.2, 1]
                }} 
                transition={{
                    duration: 0.5,
                    delay: 1
                }}
                className='data-text'>{data}
            </motion.p>
            <motion.div
                initial={{
                    scale: 0.3,
                    opacity: 0
                }}
                animate={{
                    scale: 1,
                    opacity: 1
                }}
                transition={{
                    delay: 1.5
                }}
                className="data-buttons"
            >
                <Button ghost shadow size="sm" onClick={redirectToMenu}>Return to menu</Button>
                <Button ghost shadow size="sm" onClick={addAnotherPlace}>Add another place</Button>
            </motion.div>

            
            </div>) : null}
        </AnimatePresence>
    </Card>
</Grid.Container>
  )
}

export default Confirmation