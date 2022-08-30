export const rejectUser = (requestId: string) => {
    return new Promise(async (resolve, reject) => {
        try {  
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/event/reject/user`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    requestId
                })
            })

            const resData = await res.json()
            resolve(resData)

        } catch (err) {
            reject({ err })
        }
    })
}