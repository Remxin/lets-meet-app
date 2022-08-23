export const rejectUser = () => {
    return new Promise(async (resolve, reject) => {
        try {  
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}`)

        } catch (err) {
            reject({ err })
        }
    })
}