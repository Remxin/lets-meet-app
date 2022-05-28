import axios from "axios";

export const rejectPlace = (placeId: String) => {
    return new Promise<{err?: string, msg?: string}>(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/delete/place`, {
                method: "DELETE",
                credentials: "include",
                body: JSON.stringify({placeId})
            })
            const resData = await res.json()
            resolve(resData)

        } catch (err) {
            reject({err})
        }
    })
}