//@ts-nocheck
import React, { MutableRefObject, useImperativeHandle, useRef, useState, useMemo, useEffect } from 'react'
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { getCities } from '../../../../api/addEvent/getCities';

import { Input, Grid, Spacer } from '@nextui-org/react';

import { cityType } from '../../../../types/modelTypes';

//@ts-ignore
const CitySelect = ({setId}, ref) => {
    // * -- states --
    const [first, setFirst] = useState(true) // first component render
    const [cities, setCities] = useState<cityType[]>([])
    // const [cityId, setCityId] = useLocalStorage("cityId") // daj useState
    // const [cityName, setCityName] = useLocalStorage("cityName") // daj useState
    const [cityId, setCityId] = useState("")
    const [cityName, setCityName] = useState("")
    const [rerender, setRerender] = useState(false) // use to force rerendering this component
    // * -- refs --
    const cityIdRef = useRef() as MutableRefObject<HTMLDataListElement>
    const cityNameRef = useRef() as MutableRefObject<HTMLInputElement>
    

   // sorts cities and inserts their names to select
  const citiesOpt = useMemo(() => {
    let citiesSort = cities.sort();
    return citiesSort.map((city) => {
      // console.log(city)
      return (
        //@ts-ignore
        <option data-value={`${city._id}`} key={city.id}>
          {city.name}
        </option>
      );
    });
  }, [cities]);
 

    // * ---- own ref ----
    useImperativeHandle(ref, () => {
        return {
            name: () => {
              return cityNameRef.current?.value
            },

            id: () => {
              return cityId
            },
        }
    })

    // * ---- fetch for cities ----
    useEffect(() => {
        const fetchForCities = async () => {
            const citiesRes = await getCities()
            //@ts-ignore
            if (citiesRes?.err) {
                return
            }
            //@ts-ignore
            setCities(citiesRes)
            setRerender(prev => !prev)
        }

        fetchForCities()
    }, [])

    useEffect(() => {
      console.log(first, cityNameRef.current?.value)
      if (first) return 
      // cityNameRef.current.value = cityName
      //@ts-ignore
        let foundCity = cities.find((city) => city.name === cityNameRef.current?.value)
        if (foundCity) {
          //@ts-ignore
          // setId(foundCity._id)
          // console.log(foundCity._id)
          //@ts-ignore
          setCityName(foundCity.name)

          return setCityId(foundCity._id)

        } else if (cityNameRef.current?.value !== "" ) {
          setCityName(cityNameRef.current.value)

          return setCityId("Own city")
        }
        setCityName("")
        return setCityId("")
        // setId("Own city")
    }, [cityNameRef.current?.value])


    // function that passes cityId to parent component
    const passCityId = () => {
      // console.log(cityId)
      setId(cityId)
    }

    // * -------- render --------
  return (
      <>
      <Spacer y={.5}/>
      <Grid>
            {cities.length === 0 ? <p>Loading cities...</p> : null}
            {/* @ts-ignore */}
        <Input ref={cityNameRef} type="text" list="cityData" bordered placeholder="Select city" onBlur={passCityId} onChange={e => {
          setCityName(e.currentTarget.value) 
          setFirst(false)
          }} initialValue={cityName}/> 
        {/* // * onChange={setCityId} */}
        <datalist ref={cityIdRef} id="cityData">
            <option value="">other</option>
            {citiesOpt}
        </datalist>
      </Grid>
      </>
  )
}

export default React.forwardRef(CitySelect)