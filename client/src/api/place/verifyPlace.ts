import axios from "axios";

type responseType = {
    err?: string,
    msg?: string
}

export const verifyPlace = (placeId: String) => {
    return new Promise<responseType>(async(resolve, reject) => {
        try {
            console.log(placeId)
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/verify/place`, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({placeId})
            })
           
            const resData = await res.json()
            console.log(resData)
            resolve(resData)
        } catch (err) {
            reject({err})
        }
    })
}