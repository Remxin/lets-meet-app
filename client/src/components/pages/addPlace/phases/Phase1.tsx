import React from 'react'
import { Card, Input, Grid } from "@nextui-org/react"
import { motion } from 'framer-motion'

type Phase1Types = {
  phaseIncrementer: Function
}

const Phase1 = ({phaseIncrementer}:Phase1Types) => {
  return (
    <motion.div>
      <Card>
        <Grid.Container direction='column'>
          <h2 className='phase-title'>Phase 1/3</h2>
          <Input placeholder='Place name' bordered></Input>
          <Input placeholder='Address' bordered></Input>
          <Input placeholder='Website' bordered></Input>
          <motion.div>
            <motion.button onClick={() => phaseIncrementer((prev:number) => prev + 1)}>Next step</motion.button>
          </motion.div>
        </Grid.Container>
      </Card>
    </motion.div>
  )

}

export default Phase1