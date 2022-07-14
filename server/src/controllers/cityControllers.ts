//@ts-nocheck
const City = require("../models/City")
const {verifyUser} = require("../helpers/auth")

type CityProps = {
    cityName: String,
    country: String,
    localizationString: String,
    state: String
}

export const addCity = async (req: Request, res: Response) => {
    try {
        const user = await verifyUser(req.cookies.jwt)
        if (!user) return res.send({err: "cannot verify user"})
        console.log(req.body)
        const {cityName, country, localizationString, state}:CityProps = JSON.parse(req.body)
        console.log(cityName, country, localizationString, state)
        if (!cityName, !country, !localizationString, !state) return res.send({err: "Missing elements in body"})
        await City.create({name: cityName, country, localizationString, state})
        return res.send({msg: "Success!"})

    } catch (err) {
        return res.send({err})
    }
}
export const getCities = async (req, res) => {
    try {
        const user = await verifyUser(req.cookies.jwt)
        if (!user) return res.send({err: "cannot verify user"})
        
        const citiesRes = await City.find()
        return res.send(citiesRes)

    } catch (err) {
        return res.send({err})
    }
}