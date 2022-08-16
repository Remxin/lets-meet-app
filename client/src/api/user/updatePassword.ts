export const updatePassword = (prevPass: string, password: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/update/user/password-verified`, {
                method: "PUT",
                body: JSON.stringify({
                    prevPass,
                    password
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