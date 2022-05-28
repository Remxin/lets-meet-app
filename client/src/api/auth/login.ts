
import {userType} from '../../types/modelTypes'

type errorsType = {
    password: string,
    email: string,
    name?: string
}
type responseType = {
    errors?: errorsType,
    user?: userType
  }

export const login = (password: String, email: String) => {
    return new Promise<responseType>(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/login`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                  password,
                  email
                }),
                headers: { "Content-Type": "application/json" },
              });
              const resData = await res.json();
              resolve(resData)
        } catch (err) {
            reject({err})
        }
    })
}