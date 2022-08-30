export const getPlaceImagesLen = (placeId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/get/place/imgLen?placeId=${placeId}`, {
                method: "GET",
                credentials: "include"
            })

            const resData = await res.json()
            resolve(resData)
        } catch (err) {
            reject({ err })
        }
    })
}