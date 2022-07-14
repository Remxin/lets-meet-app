import React, { useState, useEffect } from 'react'

function writeToLocalStorage(key: string, currentValue: any) {
    try {
        const prevValue = localStorage.getItem(key)
        //@ts-ignore
        console.log("prev", prevValue, JSON.parse(prevValue))
      
       console.log("current", currentValue)
        //@ts-ignore
       if (!currentValue) return JSON.parse(prevValue)

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

    useEffect(() => {
        const result = writeToLocalStorage(key, value)
        setReturnVal(result)
    }, [value])

    return [returnVal, setValue]
}


export default useLocalStorage