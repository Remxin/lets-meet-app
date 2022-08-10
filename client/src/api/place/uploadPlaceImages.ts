import axios from "axios"

export const uploadPlaceImages = (images: any[], name: string, address: string, website: string, cityId: string, localizationString: string, description: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData()
            let incrementer = 0
            for (let image of images) {
                //@ts-ignore
                formData.append("file" + incrementer, image)
                incrementer++
            }

            formData.append("jsondatarequest", JSON.stringify({
                imagesLen: images.length,
                name,
                address,
                website,
                cityId,
                localizationString,
                description
            }))
            const res = await axios.post(`${process.env.REACT_APP_SERVER_IP}/upload/place/images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })

            const resData = res.data
            resolve(resData)
        } catch (err) {
            reject({ err })
        } 
    })
}