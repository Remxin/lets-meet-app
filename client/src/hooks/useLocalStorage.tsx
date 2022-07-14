import React, { useState, useEffect } from 'react'

function writeToLocalStorage(key: string, currentValue: any) {
    try {
        const prevValue = localStorage.getItem(key)
        //@ts-ignore
        console.log("prev", prevValue, JSON.parse(prevValue))
      
       console.log("current", currentValue)
        //@ts-ignore
       if (!currentValue) return JSON.parse(prevValue)

        //if (!prevValue) localStorage.setItem(key, JSON.stringify(currentValue))
        if (prevValue === JSON.stringify(currentValue)) return currentValue
        
        localStorage.setItem(key, JSON.stringify(currentValue))
        return currentValue

    } catch (err) {
        console.log(err)
    }
}

const useLocalStorage = (storageKey: string) => {
    const [key, setKey] = useState(storageKey)
    const [value, setValue] = useState("")
    const [returnVal, setReturnVal] = useState("")
    console.log(value)
    // console.log(storageKey, initialValue)
    // console.log(key, value)

    useEffect(() => {
        // if (!value) return 
        console.log("wchodzi", key)
        const result = writeToLocalStorage(key, value)
        console.log(result)
        setReturnVal(result)
    }, [value])

    // console.log(returnVal)
    return [returnVal, setValue]
}


export default useLocalStorage