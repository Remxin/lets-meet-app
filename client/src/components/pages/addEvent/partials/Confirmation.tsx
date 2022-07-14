import React, { useCallback, useMemo } from 'react'
import "../../../../styles/scss/pagesComponents/addEvent/confirmation.scss"
import useFetch from '../../../../hooks/useFetch'
import { useNavigate } from 'react-router-dom'

import { Grid, Card, Button } from "@nextui-org/react"
import { motion, AnimatePresence } from "framer-motion"
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import { Loading } from "@nextui-org/react"




type ConfirmationType = {
    submitHandler: () => Promise<any>,
    wantToAddUniquePlace: boolean
}

type ErrorType = {
    errorText: String
}




const Error = ({errorText}: ErrorType) => {

    return (
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
            <FaExclamationCircle color='red' className='check-icon'/>
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
                className='error-text'>{errorText}
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
                <Button ghost shadow color="error">Return to menu</Button>
                <Button ghost shadow color="error">Add another place</Button>
            </motion.div>
        </div>
        )

}

const LoadingBlock = () => {
    return (
        <div className='result-container'>
            <div className='result-block'>
                <Loading size="lg">Adding event</Loading>
            </div>
        </div>
    )
}

const Confirmation = ({submitHandler, wantToAddUniquePlace = false}: ConfirmationType) => {

  
   const {data, error, loading } = useFetch(submitHandler, true) 
   const navigate = useNavigate()
   
   const redirectToMenu = useCallback(() => {
       navigate("/")
       window.location.reload()
   }, [])

   const addAnotherEvent = useCallback(() => {
       window.location.reload()
   }, [])

   const redirectToAddPlace = useCallback(() => {
    navigate('/add/place')
    window.location.reload()
   }, [])


   
    return (
    <Grid.Container className='confirmation'>
        <Card className="confirmation-content">
            <AnimatePresence>
                {loading ? (<LoadingBlock/>) : null}
            </AnimatePresence>
            <AnimatePresence>
                {error ? (<Error errorText={error}/>) : null}
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
                    {wantToAddUniquePlace ? <Button ghost shadow color="success" onClick={redirectToAddPlace}>Add this unique place</Button> : null}
                    <Button ghost shadow size="sm" onClick={redirectToMenu}>Return to menu</Button>
                    <Button ghost shadow size="sm" onClick={addAnotherEvent}>Add another event</Button>
                </motion.div>

                
                </div>) : null}
            </AnimatePresence>
        
        </Card>
    </Grid.Container>
  )
}

export default Confirmation