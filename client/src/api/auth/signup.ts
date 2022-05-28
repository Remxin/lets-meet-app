import { userType } from "../../types/modelTypes";

type errorsType = {
    email: String,
    name: String,
    password: String
}
type responseType = {
    errors: errorsType,
    user: userType
}

export const signup = (name: String, password: String, email: String, sex: String, age: Number) => {
    return new Promise<responseType>(async (resolve, reject) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/signup`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                  name,
                  password,
                  email,
                  sex,
                  age
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