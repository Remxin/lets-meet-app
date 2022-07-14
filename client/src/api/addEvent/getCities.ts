import { cityType } from "../../types/modelTypes"

type responseType = cityType[] | errType
type errType = {
    err: Error
}
export const getCities = () => {
    return new Promise<responseType>(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/get/city`, {
                method: "POST",
                credentials: "include"
            })
            const resData = await res.json()
            resolve(resData)
        } catch (err) {
            reject({ err })
        }
    })
}