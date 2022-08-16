import React from 'react'
class UserDataHelpers {
    capitalize = (string: String) => {
        const returnString = string.charAt(0).toLocaleUpperCase() + string.substring(1)
        return returnString
    }

    countYears = (age: Number) => {
        // @ts-ignore
        const birthDate = new Date(age)
        const actualDate = new Date()

        const year = actualDate.getTime() - birthDate.getTime()

        return Math.floor(year / (1000*60*60*24*365.25))
    }

    isMongooseId = (string: String) => {
        if (string.match(/^[0-9a-fA-F]{24}$/)) {
            return true
        }
        return false
    }

    genBirthdateString = (number: number) => {
        const birthDate = new Date(number)
        const birthdateFormat = `${birthDate.getFullYear()}-${birthDate.getMonth() < 10 ? "0" + birthDate.getMonth() : birthDate.getMonth() }-${birthDate.getDay() < 10 ? "0" + birthDate.getDay() : birthDate.getDay()}`
    
        return birthdateFormat
    }
}

const userDataHelper = new UserDataHelpers()
export default userDataHelper