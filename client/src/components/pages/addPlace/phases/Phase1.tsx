import React, { useState, useMemo, useContext } from 'react'
import { Input, Grid, Loading } from "@nextui-org/react"
import Select from 'react-select'
import { motion, useAnimation } from 'framer-motion'

import useFetch from "../../../../hooks/useFetch"
import { getCities } from "../../../../api/addEvent/getCities"

import { AddPlaceContext } from "../../../../contexts/AddPlaceContext"

import { errorVariants } from "../variants/errorVariants"

type Phase1Types = {
  phaseIncrementer: Function
}

const Phase1 = ({phaseIncrementer}:Phase1Types) => {
  const errorVariant = useAnimation()
  //@ts-ignore
  const { name, setName, address, setAddress, website, setWebsite, cityId, setCityId, cityName, setCityName} = useContext(AddPlaceContext)
  //@ts-ignore
  const {data: cityData, error:cityError, loading: cityLoading} = useFetch(getCities, true)
  const [err, setErr] = useState("")

  function displayError(error: string) {
    setErr(error)
    errorVariant.start("animate")
  }

  const cityOptions = useMemo(() => {
    setErr("")  
    if (!Array.isArray(cityData)) return setErr("Cannot get cities arr - internal server error")
    // @ts-ignore
    let cities: cityType[] = cityData.sort((x: cityType, y:cityType) => {
      return x.name > y.name
    })
    const options = cities.map((cityData) => {
      return { value: cityData._id, label: cityData.name }
    })
    return options
  }, [cityData])

  function nextHandler() {
    if (!name) return displayError("Please type name")
    // if (!address) return displayError("Please type address")
    if (!website) return displayError("Please type place website")
    if (!cityId) return displayError("Please select city")

    phaseIncrementer((prev: number) => prev + 1)
  }

  return (
    <Grid.Container className='add-place-phase-content'>
      <h2>Basic informations</h2>
      <Input placeholder='Place name' bordered initialValue={name} onChange={(e) => setName(e.target.value)}></Input>
      <Input placeholder='Address' bordered initialValue={address} onChange={(e) => setAddress(e.target.value)}></Input>
      <Input placeholder='Website' bordered initialValue={website} onChange={(e) => setWebsite(e.target.value)}></Input>
      {cityError ? <p>Error in loading cities</p> : null}
      {cityLoading ? <Loading>Loading cities...</Loading> : null}
      {/* @ts-ignore */}
      <Select className="place-select" disables={cityLoading} options={cityOptions} placeholder="Select city" onChange={(e) => {
        //@ts-ignore
        setCityId(e.value)
        //@ts-ignore
        setCityName(e.label)
        }} defaultValue={{ value: cityId, label: cityName}}/>
        <motion.p variants={errorVariants} initial="initial" animate={errorVariant} className='err'>{err}</motion.p>
      <motion.div className='phase-footer'>
        <button onClick={nextHandler} className="next">Next step</button>
      </motion.div>
    </Grid.Container>
  )

}

export default Phase1