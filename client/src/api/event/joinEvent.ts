export const joinEvent = (eventId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/user/joinevent`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    eventId
                })
            })

            const resData = await res.json()
            resolve(resData)
        } catch (err) {
            reject({ err })
        }
    })
}