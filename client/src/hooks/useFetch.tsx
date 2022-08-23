import React, { useEffect, useState, useMemo, useCallback } from 'react'

type PromiseType ={
    err?: String,
    msg?: String
}

const useFetch = (fetchPromise: () => Promise<PromiseType>, startOnLoad?: boolean) => {

    const [data, setData] = useState<null | String>(null)
    const [loading, setLoading ] = useState(false)
    const [error, setError] = useState<null | String>(null)

    const startFetching = useCallback(async () => {
        setLoading(true)
        const response = await fetchPromise()
        if (response.err) {
            setLoading(false)
            return setError(response.err)
        }
        if (response.msg) {
            setLoading(false)
            return setData(response.msg)
        } else {
            setLoading(false)
            //@ts-ignore
            return setData(response)
        }
    }, [])

    useEffect(() => {
        if (startOnLoad) {
            startFetching()
        }
    }, [startOnLoad])


  return {loading, error, data, startFetching}
}

export default useFetch