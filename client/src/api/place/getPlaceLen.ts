import axios from "axios";

export const getPlaceImgLen = (placeId: String) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/get/place/imgLen?placeId=${placeId}`, {
                method: "GET",
                credentials: "include"
            })
            const resData = await res.json()
            if (resData.err) {
                resolve({err: resData.err})
            }
            resolve({len: resData.len})
        } catch (err) {
            reject({err})
        }
    })
}