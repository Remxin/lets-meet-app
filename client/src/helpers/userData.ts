import React from 'react'
class UserDataHelpers {
    getDay = (number: number) => {
        switch(number) {
            case 0:
                return "Sun"
            case 1:
                return "Mon"
            case 2:
                return "Tue"
            case 3:
                return "Wed"
            case 4:
                return "Thu"
            case 5:
                return "Fri"
            case 6:
                return "Sat"
            default: 
                return "Wrong day number"
            
        }
    }

    add0 = (number: number) => {
        return number < 10 ? "0" + number : "" + number
    }

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

    genFullDateFormat = (number: number) => {
        const date = new Date(number)
        const month = date.getMonth() < 12 ? date.getMonth() + 1 : 1

        const returnString = `${this.getDay(date.getDay())} ${this.add0(date.getDate())}.${month}`
        return returnString
    }

    genTimeFormat = (number: number) => {
        const date = new Date(number)
        const returnString = `${this.add0(date.getHours())}:${this.add0(date.getMinutes())}`
        return returnString
    }
}

const userDataHelper = new UserDataHelpers()
export default userDataHelper