export const sendOpinion = (placeId: string, stars: number, comment: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/place/send/opinion`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    placeId,
                    stars,
                    comment
                })
            })

            const resData = await res.json()
            resolve(resData)
        } catch (err) {
            reject({ err })
        }
    })
}