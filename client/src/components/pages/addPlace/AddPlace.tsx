import React, { MutableRefObject, useMemo, useState, useRef, useCallback } from 'react'
import { Card, Grid, Input, Loading } from "@nextui-org/react"
import { NavLink } from "react-router-dom"
import JoditEditor from 'jodit-react'
import Select from 'react-select'
import GoogleMaps from '../../../modules/GoogleMaps'
import { FaRegFileImage } from "react-icons/fa"

import Phase1 from './phases/Phase1'

import { cityType } from '../../../types/modelTypes'

import useFetch from '../../../hooks/useFetch'

import { getCities } from '../../../api/addEvent/getCities'

import "../../../styles/scss/pagesComponents/addPlace/addPlace.scss"



const AddPlace = () => {
  const [phaseNumber, setPhaseNumber] = useState(1)
  //@ts-ignore
  const {data: cityData, error:cityError, loading: cityLoading} = useFetch(getCities, true)
  const [err, setErr] = useState("")

  const [localizationString, setLocalizationString] = useState("")
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("Chose place file")

  // refs
  const googleStringRef = useRef() as MutableRefObject<HTMLInputElement>

  const cityOptions = useMemo(() => {
    if (!Array.isArray(cityData)) return setErr("Cannot get cities arr - internal server error")
    // @ts-ignore
    let cities: cityType[] = cityData.sort((x: cityType, y:cityType) => {
      return x.name > y.name
    })
    const options = cities.map((cityData:cityType) => {
      return { value: cityData._id, label: cityData.name }
    })
    return options
  }, [cityData])

  const addFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      //@ts-ignore
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  }, []);





  // returns
  if (phaseNumber === 1) {
    return <Phase1 phaseIncrementer={setPhaseNumber}/>
  }
  return (
    <Card>
      <h2>Add Place</h2>
      <p>*earn 1 free premium event for every 4 places added</p>
      <form>
      <Grid.Container direction='column'>
          <Input placeholder='Place name' bordered></Input>
          <Input placeholder='Address' bordered></Input>
          <span><Input placeholder='Localization from google: ' bordered ref={googleStringRef} onChange={(e) => setLocalizationString(e.target.value)}/><NavLink to="/tutorials/google-map-place">Show me how</NavLink></span>
          <Input placeholder='Website' bordered></Input>
      </Grid.Container>
      <JoditEditor
                value={""}
                config={{placeholder: "Place description: ", maxLenght: 200}}
                  //@ts-ignore
                tabIndex={1} // tabIndex of textarea
        />
      </form>
      <Grid.Container>
        <p>Place google localization should display here</p>
        <GoogleMaps localizationString={googleStringRef.current?.value} changeFun={setLocalizationString}/>
      </Grid.Container>
      {cityError ? <p>Error in loading cities</p> : null}
      {cityLoading ? <Loading>Loading cities...</Loading> : null}
      {/* @ts-ignore */}
      <Select className="place-select" disables={cityLoading} options={cityOptions} placeholder="Select city"/>
      <Grid.Container>
        <label htmlFor='place-file-input' className='place-image-label'><FaRegFileImage/><span>{fileName}</span></label>
        <input id="place-file-input" className="place-image-input" type="file" onChange={addFile} accept="image/png, image/jpg"/>
      </Grid.Container>
    </Card>
  )
}

export default AddPlace