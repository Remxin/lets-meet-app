//@ts-ignore
import Error from '../models/Error'

export const addServerError = (type: String, text: String) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = await Error.create({source: "server", type, text})
            if (!error) {
                resolve({err: "cannot add error to database"})
            }

            resolve({msg: "Successfully added error to database"})
        } catch (err) {
           reject({err})
        }
    })
}

export const addUserError = (type: String, text: String) => {
    return new Promise(async (resolve, reject) => {
        try {
            const error = await Error.create({source: "user reported", type, text})
            if (!error) {
                resolve({err: "cannot add error to database"})
            }

            resolve({msg: "Successfully added error to database"})
        } catch (err) {
           reject({err})
        }
    })
}

