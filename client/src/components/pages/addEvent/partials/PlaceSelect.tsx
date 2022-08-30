import React, { MutableRefObject, useState, useRef, useImperativeHandle, useEffect, useMemo } from 'react'
import { Grid, Input, Spacer, Checkbox } from "@nextui-org/react"
import { getCityPlaces } from '../../../../api/addEvent/getCityPlaces'
import Select from "react-select"
import { placeType } from '../../../../types/modelTypes'
import "../../../../styles/scss/pagesComponents/addEvent/placeSelect.scss"


type placeSelectType = {
  cityId: String
}

const options = [
  {value: '', label: "My own place"}
]

// @ts-ignore
const  PlaceSelect = ({cityId}: placeSelectType, ref) => {
    const placeRef = useRef() as MutableRefObject<HTMLSelectElement>
    const uniquePlaceRef = useRef() as MutableRefObject<HTMLInputElement>
    const [uniquePlace, setUniquePlace] = useState<boolean>()
    const [addUniquePlace, setAddUniquePlace] = useState<boolean>(false)
    const [cityPlacesArr, setCityPlacesArr] = useState([])
    const [placeId, setPlaceId] = useState("!")
    
    // * ---- custom refs ----
    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                if (placeId !== "") return placeId
                return "^" + uniquePlaceRef.current.value // ^ is unique place prefix
                
            },

            wantToAddUniquePlace:  addUniquePlace
            
        }
    }, [uniquePlaceRef.current?.value, addUniquePlace, placeId])
    // console.log(addUniquePlace)
    
    // * ---- Functions ----
    // define place id
    const placeIdSetter = (e: any) => {
      setPlaceId(e.value)
    }


    // --- set additional fields to specify user own localization ---
    useEffect(() => {
        if (placeId === "") {
        return setUniquePlace(true);
        }
        return setUniquePlace(false);
    }, [placeId])
 


    // fetch for places
    useEffect(() => {
      console.log(cityId)
      if (!cityId) return
      if (cityId === "Own city") return setCityPlacesArr([])
      async function fetchForPlaces () {
        const placesArr = await getCityPlaces(cityId)
        // @ts-ignore
        if (placeRef.err) return
        // @ts-ignore
        setCityPlacesArr(placesArr)
      }

      fetchForPlaces()
    }, [cityId])

    const cityPlacesOptions: any[] = useMemo(() => {
      //@ts-ignore
      if (!cityPlacesArr || cityPlacesArr.length === 0) return [{value: "", label: "My own places"}]
      console.log(cityPlacesArr);
      
      //@ts-ignore
      let cityPlaces: placeType[] = cityPlacesArr.sort((x: any, y:any) => {
        return x.name > y.name
      })
        // @ts-ignore
        cityPlaces = cityPlaces.map((place: placeType) => {
        let address = place.addressString !== "" ? "("+ place.addressString+")" : ""
        //@ts-ignore
        return {value: place._id, label: place.name + address}
      })
      //@ts-ignore
      cityPlaces.unshift({value: "", label: "My own place"})
      return cityPlaces
    }, [cityPlacesArr])
   
    // * -------- Return --------
    return (
      <>
    <Spacer y={.5}/>
    <Grid>
      {/* @ts-ignore */}
     <Select className="place-select" isDisabled={cityId === ""} options={ cityPlacesOptions?.length > 0 ? cityPlacesOptions : options} ref={placeRef} onChange={placeIdSetter} placeholder="Select place"/>
    </Grid>
    {uniquePlace ? (
      <div>
        <Spacer y={.5} />
        <Input
        clearable
        bordered
          type="text"
          placeholder="Describe the place location"
          ref={uniquePlaceRef}
        />
        <p>
          Add this place to official places. Help us and get free premium
          event!{" "}
          <span>
            *after adding event you will be redirected to other subpage
          </span>
        </p>
        <Checkbox
          color='warning'
          onChange={() => setAddUniquePlace(prev => !prev)}
        >Make this place official</Checkbox>
      </div>
    ) : null}
    </>
  )
}

export default React.forwardRef(PlaceSelect)