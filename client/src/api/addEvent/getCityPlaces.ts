import { placeType } from "../../types/modelTypes"

type errorType = {
    err: Error
}

type responseType = placeType | errorType


export const getCityPlaces = (cityId: String) => {
    return new Promise<responseType>(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/get/place`, {
                method: "POST",
                body: JSON.stringify({ cityId }),
                credentials: "include"
            })
            const resData = await res.json()
            console.log(resData)
            resolve(resData)
        } catch (err) {
            reject({ err })
        }
    })
}