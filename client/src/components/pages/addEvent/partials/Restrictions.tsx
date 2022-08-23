// @ts-nocheck
import React, { MutableRefObject, useRef, useReducer, useMemo, useEffect, useState} from 'react'
import { Input, Button, Grid, Spacer } from "@nextui-org/react"
import { IconButton, Text } from '@chakra-ui/react'
import { FaTrashAlt, FaPlus } from "react-icons/fa"
import { setDefaultResultOrder } from 'dns'

import '../../../../styles/scss/pagesComponents/addEvent/restrictions.scss'

enum ACTIONS {
    ADDRESTRICTION = "ADDRESTRICTION",
    REMOVERESTRICTION = "REMOVERESCRICTION"
}

function reducer (restrictions, action) {
    switch(action.type) {
        case ACTIONS.ADDRESTRICTION: 
    
            return [...restrictions, action.payload.newRestriction]
           
        case ACTIONS.REMOVERESTRICTION:
            let newRestrictions = restrictions.filter((restriction) => restriction !== action.payload.restrictionName)
            return newRestrictions
    }

}

const Restrictions = ({setRestrictions, defaultRestrictions}) => {
    const [error, setError] = useState("")
    const [restrictions, dispatch] = useReducer(reducer, defaultRestrictions)
    const inputRef = useRef() as MutableRefObject<HTMLInputElement>

    function handleAddRestriction() {
        setError("")
        if (inputRef.current.value === "") return
        if (restrictions.length >= 10) {
            inputRef.current.value = ""
            return setError("You can set max 10 restrictions")
        }
        dispatch({ type: ACTIONS.ADDRESTRICTION, payload: { newRestriction: inputRef.current.value}})
        inputRef.current.value = ""
        inputRef.current.focus()
    }

    function handleRemoveRestriction(e: React.TouchEvent<HTMLButtonElement>) {
        dispatch({type: ACTIONS.REMOVERESTRICTION, payload: {restrictionName: e.currentTarget.dataset.restriction}})
    }

    const restrictionsListComponent = useMemo(() => {
        let iterator = 0
        return restrictions.map((restriction) => {
            iterator++
            return (
                <li className='restriction-li' key={Date.now() + iterator}><IconButton className="restricion-delete-btn" onClick={handleRemoveRestriction} colorScheme="red" icon={< FaTrashAlt />} aria-label='delete restriction'  data-restriction={restriction}/> {restriction}  </li>
            )
        })
    }, [restrictions])

    useEffect(() => {
        setRestrictions(restrictions)
    }, [restrictions])

  return (
      <>
      <Grid.Container direction='column'>
        <Text fontSize='sm' color="tomato" >{error}</Text>
        <Grid.Container direction='row'>
            <Input
            bordered
            // type="text"
            placeholder='New restriction: '
            // labelPlaceholder="New restriction: "
            ref={inputRef}
            onKeyDown={(e) => {
                
                if (e.key == "Enter") {
                    e.preventDefault()
                    handleAddRestriction()
                }
            }}
            // onKeyDown={(e) => e.key == "Enter" ? console.log(e.key) : null}
            />
            <Spacer x={.3}/>
            <IconButton bordered colorScheme="green" auto onClick={handleAddRestriction} className="restrictions-adding-button" icon={<FaPlus/>}/>
                
        </Grid.Container>     
            <ul>{restrictionsListComponent}</ul>
        </Grid.Container>
    </>
  )
}

export default Restrictions