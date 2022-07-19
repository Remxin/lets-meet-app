import { verifyUser } from "../helpers/auth";


type CookieType = {
    key: String,
    value: String
}

// ------ function for converting cookie string into cookie object -----
function getCookiesFromString(cookieString: String) {
    let returnObj = {}
    if (!cookieString) return
    const separateCookiesArr = cookieString.split("; ")
    const cookiesVals = separateCookiesArr.map((cookie: String) => {
        const cookieKey = cookie.split("=")[0]
        const cookieVal = cookie.split("=")[1]
        return {key: cookieKey, value: cookieVal}
    })
    cookiesVals.forEach((cookie: CookieType) => {
        //@ts-ignore
        returnObj[cookie.key] = cookie.value
    })
 return returnObj
}

export async function verifySocketUser (req:any, callback: any) {
      //@ts-ignore
      const cookies = getCookiesFromString(req.headers.cookie)
    //@ts-ignore
    if (!cookies?.jwt) return callback(null, false)
    //@ts-ignore
    const verifiedUser = await verifyUser(cookies.jwt)
    const isOriginValid = !!verifiedUser
    callback(null, isOriginValid)
}