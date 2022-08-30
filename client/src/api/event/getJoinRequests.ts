export const getJoinRequests = (eventId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/get/event/joinrequests`, {
                method: "POST",
                body: JSON.stringify({
                    eventId
                }),
                credentials: "include"
            })
            
            const resData = await res.json()
            resolve(resData)
        } catch (err) {
            reject({ err })
        }
    })
}