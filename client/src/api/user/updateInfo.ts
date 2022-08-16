export const updateInfo = (name: string, sex: string, age: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/update/user/informations`, {
                method: "PUT",
                body: JSON.stringify({
                    name, 
                    sex,
                    age
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